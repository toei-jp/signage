/**
 * Cinerino利用ラッパープラグイン (this.$cinerino)
 *
 * 非同期のCognito認証ありきなので通常のプラグインのようにVue.use()はせずasyncでinstall()する
 * 認証処理は全てAWS-Amplifyで行う(CinerinoクライアントはJWTを渡せば動く)
 * ※CinerinoクライアントはfetchAPIが使われているのでリクエスト時は別途タイムアウト処理を付ける必要あり
 */
import Auth from '@aws-amplify/auth';
import { CognitoUser, CognitoAccessToken } from 'amazon-cognito-identity-js';
import * as cinerino from '@cinerino/api-javascript-client';

export interface ICinerinoServices {
    eventService: cinerino.service.Event;
    orderService: cinerino.service.Order;
    sellerService: cinerino.service.Seller;
    personService: cinerino.service.Person;
    paymentService: cinerino.service.Payment;
    placeOrderService: cinerino.service.txn.PlaceOrder;
}

let cognitoUserId = '';
let cognitoUserPw = '';
let cognitoTokenExpirationUnixTime = 0;
let is_initialized = false; // Cinerinoクライアント使用準備完了フラグ
let currentCognitoUser: CognitoUser | null = null;
let cinerinoServices: ICinerinoServices | null = null;
// Cinerinoクライアントはサービスを使う度にnewが発生するのでここに入れて上書きしていく
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
const setTokenToCinerinoClient = (accessToken: CognitoAccessToken): void => {
    console.log('[cinerinoPlugin][setTokenToCinerinoClient]', accessToken, `accessToken will be expired at ${new Date(accessToken.payload.exp * 1000).toLocaleString()}`);
    cognitoTokenExpirationUnixTime = accessToken.payload.exp;
    cinerinoServiceArguments.auth.setCredentials({
        accessToken: accessToken.getJwtToken(),
    });
    is_initialized = true;
};

// Cognitoにサインインしてトークンを取得してCinerinoクライアントにセット
const siginInAndSetAccessToken = async (): Promise<void> => {
    try {
        const signInResponse = await Auth.signIn(cognitoUserId, cognitoUserPw);
        console.log('[cinerinoPlugin][siginInAndGetAccessToken][Amplify.Auth.signIn]', signInResponse);

        // Cognitoユーザーのパスワード変更が必要だったらサイネージアカウント共通パスワードに変更実行
        if (signInResponse.challengeName === 'NEW_PASSWORD_REQUIRED') {
            const completeNewPasswordChallengeResponse = await signInResponse.completeNewPasswordChallenge('M0P!X-signage');
            console.log('[cinerinoPlugin][siginInAndGetAccessToken][Amplify.Auth.completeNewPasswordChallenge]', completeNewPasswordChallengeResponse);
            return window.location.reload(true);
        }

        // ユーザーのSTATUSがCONFIRMEDでなくてもIDとパスワードが合ってればsignIn自体は通ってしまうので確実化のためcurrentAuthenticatedUserを取る
        currentCognitoUser = await Auth.currentAuthenticatedUser();
        if (!currentCognitoUser) {
            throw new Error('Auth.currentAuthenticatedUser() is null');
        }
        const signInUserSession = currentCognitoUser.getSignInUserSession();
        if (!signInUserSession) {
            throw new Error('CognitoUser.getSignInUserSession() is null');
        }
        console.log('[cinerinoPlugin][siginInAndGetAccessToken][Amplify.Auth.currentAuthenticatedUser]', currentCognitoUser);
        setTokenToCinerinoClient(signInUserSession.getAccessToken());
        return;
    } catch (e) {
        throw typeof e === 'string' ? new Error(`[Amplify.Auth] Error: ${e}`) : e;
    }
};

/**
 * Coginioトークンを確認・更新 (Auth.currentSession()するだけでトークンは新しく保たれる)
 * https://github.com/aws-amplify/amplify-js/issues/2560#issuecomment-481707972
 *
 * */
const refreshAuth = async (): Promise<void> => {
    try {
        if (!currentCognitoUser || !is_initialized) {
            await siginInAndSetAccessToken();
        }
        // トークン有効期限の5分前から警戒してセッション更新
        const keepLimitTime = cognitoTokenExpirationUnixTime - 5 * 60;
        if (Date.now() > keepLimitTime * 1000) {
            const currentSession = await Auth.currentSession();
            // console.log('currentSession', currentSession);
            setTokenToCinerinoClient(currentSession.getAccessToken());
        }
        return;
    } catch (e) {
        console.log('[catched][cinerinoPlugin][refreshAuth]', e);
        throw typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e;
    }
};

// Cinerinoサービスを使える状態で返す
export const getAuthedServices = async (): Promise<ICinerinoServices> => {
    try {
        await refreshAuth();
        cinerinoServices = {
            eventService: new cinerino.service.Event(cinerinoServiceArguments),
            orderService: new cinerino.service.Order(cinerinoServiceArguments),
            sellerService: new cinerino.service.Seller(cinerinoServiceArguments),
            personService: new cinerino.service.Person(cinerinoServiceArguments),
            paymentService: new cinerino.service.Payment(cinerinoServiceArguments),
            placeOrderService: new cinerino.service.transaction.PlaceOrder(cinerinoServiceArguments),
        };
        return cinerinoServices;
    } catch (e) {
        console.log('[catched][cinerinoPlugin][getAuthedServices]', e);
        throw typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e;
    }
};

export default {
    // 非同期のinstall
    install: async (Vue: any, options: any): Promise<void> => {
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
            return;
        } catch (e) {
            console.log('[catched][cinerinoPlugin][install]', e);
            throw typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e;
        }
    },
};
