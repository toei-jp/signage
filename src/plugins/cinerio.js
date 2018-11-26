/**
 * Cinerino利用プラグイン with AWS-Amplify (this.$cinerino)
 *
 * 非同期のCognito認証ありきなので通常のプラグインのようにVue.use()はせずasyncでinstall()する
 */
import Auth from '@aws-amplify/auth';
import * as cinerino from '@cinerino/api-javascript-client';

let cognitoUserId = '';
let cognitoUserPw = '';
let is_initialized = false;
let authExpireTime = null;
let cinerinoServices = {}; // サービスを使う度にnewしないといけないのでここに入れて上書きしていく
const cinerinoServiceArguments = {
    endpoint: '',
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

// cinerinoClientにcognitoのトークンをセット
const setTokenToCinerinoClient = (accessToken) => {
    console.log('[cinerinoPlugin][setTokenToCinerinoClient]', accessToken, `accessToken will be expired at ${new Date(accessToken.payload.exp * 1000).toLocaleString()}`);
    authExpireTime = accessToken.payload.exp;
    cinerinoServiceArguments.auth.setCredentials({ accessToken: accessToken.jwtToken });
    is_initialized = true;
};

// 認証を実行してトークンをセット
const siginInAndSetAccessToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const signInResponse = await Auth.signIn(cognitoUserId, cognitoUserPw);
            console.log('[cinerinoPlugin[siginInAndGetAccessToken] signInResponse', signInResponse);
            if (signInResponse.challengeName === 'NEW_PASSWORD_REQUIRED') {
                const completeNewPasswordChallengeResponse = await signInResponse.completeNewPasswordChallenge('M0P!X-signage');
                console.log('[cinerinoPlugin[siginInAndGetAccessToken] completeNewPasswordChallengeResponse', completeNewPasswordChallengeResponse);
                return window.location.reload(true);
            }
            // ユーザーのSTATUSがCONFIRMEDで無くてもsignIn自体は成功するのでcurrentAuthenticatedUserを取る
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

// 認証状況を確認
const checkAuth = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!is_initialized) {
                await siginInAndSetAccessToken();
            }
            await Auth.currentAuthenticatedUser();
            resolve();
        } catch (e) {
            console.log('[failed][cinerinoPlugin][checkAuth]', e);
            reject(typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e);
        }
    });
};

// トークン更新 (expireTimeの5分前から警戒)
const refreshAuth = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!is_initialized) {
                await siginInAndSetAccessToken();
            }
            const keepLimitTime = (authExpireTime - 5 * 60) * 1000;
            if (Date.now() > keepLimitTime) {
                console.log('[cinerinoPlugin][refreshAuth] token will be expired (and auto refreshed by Amplify) withn 5 minutes.');
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

// サービスを使える状態で返す
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
                            return { checkAuth, getAuthedServices };
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
