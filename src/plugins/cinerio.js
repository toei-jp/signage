/**
 * Cinerino利用ラッパープラグイン (this.$cinerino)
 *
 * 非同期のCognito認証ありきなので通常のプラグインのようにVue.use()はせずasyncでinstall()する
 * 認証処理は全てAWS-Amplifyで行う(CinerinoクライアントはJWTを渡せば動く)
 * ※CinerinoクライアントはfetchAPIが使われているのでリクエスト時は別途タイムアウト処理を付ける必要あり
 */
import Auth from '@aws-amplify/auth';
import * as cinerino from '@cinerino/api-javascript-client';

let cognitoUserId = '';
let cognitoUserPw = '';
let cognitoTokenExpirationUnixTime = 0;
let is_initialized = false; // Cinerinoクライアント使用準備完了フラグ
let cinerinoServices = {}; // Cinerinoクライアントはサービスを使う度にnewが発生するのでここに入れて上書きしていく
const cinerinoServiceArguments = {
    endpoint: '', // CINERINO_API_ENDPOINT
    auth: cinerino.createAuthInstance({
        domain: '',
        clientId: '',
        redirectUri: '',
        logoutUri: '',
        responseType: '',
        scope: '',
        state: '',
        nonce: null,
        tokenIssuer: '',
    }),
};

// CinerinoクライアントにCognitoのjwtTokenをセット
const setTokenToCinerinoClient = (accessToken) => {
    console.log('[cinerinoPlugin][setTokenToCinerinoClient]', accessToken, `accessToken will be expired at ${new Date(accessToken.payload.exp * 1000).toLocaleString()}`);
    cognitoTokenExpirationUnixTime = accessToken.payload.exp;
    cinerinoServiceArguments.auth.setCredentials({ accessToken: accessToken.jwtToken });
    is_initialized = true;
};

// Cognitoにサインインしてトークンを取得してCinerinoクライアントにセット
const siginInAndSetAccessToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const signInResponse = await Auth.signIn(cognitoUserId, cognitoUserPw);
            console.log('[cinerinoPlugin[siginInAndGetAccessToken] signInResponse', signInResponse);

            // Cognitoユーザーのパスワード変更が必要だったらサイネージアカウント共通パスワードに変更実行
            if (signInResponse.challengeName === 'NEW_PASSWORD_REQUIRED') {
                const completeNewPasswordChallengeResponse = await signInResponse.completeNewPasswordChallenge('M0P!X-signage');
                console.log('[cinerinoPlugin[siginInAndGetAccessToken] completeNewPasswordChallengeResponse', completeNewPasswordChallengeResponse);
                return window.location.reload(true);
            }

            // ユーザーのSTATUSがCONFIRMEDでなくてもIDとパスワードが合ってればsignIn自体は通ってしまうのでcurrentAuthenticatedUserを取る
            const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
            console.log('[cinerinoPlugin][siginInAndGetAccessToken] currentAuthenticatedUser', currentAuthenticatedUser);
            setTokenToCinerinoClient(currentAuthenticatedUser.signInUserSession.accessToken);
            resolve();
        } catch (e) {
            reject(typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e);
        }
        return true;
    });
};

// トークンを確認・更新 (Amplifyが勝手に更新してくれてる気がするが念のため)
const refreshAuth = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!is_initialized) {
                await siginInAndSetAccessToken();
            }
            // トークン有効期限の5分前から警戒してセッション更新
            const keepLimitTime = cognitoTokenExpirationUnixTime - 5 * 60;
            if (Date.now() > keepLimitTime * 1000) {
                const currentSession = await Auth.currentSession();
                // console.log('currentSession', currentSession);
                setTokenToCinerinoClient(currentSession.accessToken);
            }
            return resolve();
        } catch (e) {
            console.log('[failed][cinerinoPlugin][refreshAuth]', e);
            return reject(typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e);
        }
    });
};

// Cinerinoサービスを使える状態で返す
const getAuthedServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await refreshAuth();
            cinerinoServices = {
                eventService: new cinerino.service.Event(cinerinoServiceArguments),
                orderService: new cinerino.service.Order(cinerinoServiceArguments),
                reservationService: new cinerino.service.Reservation(cinerinoServiceArguments),
                organizationService: new cinerino.service.Organization(cinerinoServiceArguments),
                personService: new cinerino.service.Person(cinerinoServiceArguments),
                transactionService: {
                    placeOrder: new cinerino.service.transaction.PlaceOrder(cinerinoServiceArguments),
                },
            };
            resolve(cinerinoServices);
        } catch (e) {
            console.log('[failed][cinerinoPlugin][getAuthedServices]', e);
            reject(typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e);
        }
    });
};

export default {
    // 非同期のinstall
    install: (Vue, options) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('[cinerinoPlugin][install]', options);
                cognitoUserId = options.cognitoUser.userId;
                cognitoUserPw = options.cognitoUser.password;
                cinerinoServiceArguments.endpoint = options.CINERINO_API_ENDPOINT;
                Object.defineProperties(Vue.prototype, {
                    $cinerino: {
                        get() {
                            return { getAuthedServices };
                        },
                    },
                });
                await Auth.configure(options.authConfig);
                await siginInAndSetAccessToken();
                resolve();
            } catch (e) {
                console.log('[failed][cinerinoPlugin][install]', e);
                reject(typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e);
            }
        });
    },
};
