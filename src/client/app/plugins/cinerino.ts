/**
 * Cinerino利用ラッパープラグイン (this.$cinerino)
 *
 * 非同期のCognito認証ありきなので通常のプラグインのようにVue.use()はせずasyncでinstall()する
 * ※CinerinoクライアントはfetchAPIが使われているのでリクエスト時は別途タイムアウト処理を付ける必要あり
 */
import Auth from '@aws-amplify/auth';
import { CognitoUser, CognitoAccessToken } from 'amazon-cognito-identity-js';
import * as cinerino from '@cinerino/sdk';
import axios from 'axios';
import { ImplicitGrantClient } from '@cinerino/sdk/lib/auth/implicitGrantClient';
import moment from 'moment';

export interface ICinerinoServices {
    eventService: cinerino.service.Event;
    placeService: cinerino.service.Place;
}

let cinerinoServices: ICinerinoServices | null = null;
let cinerinoServiceAuth: ImplicitGrantClient | undefined = undefined;

/**
 * Cinerinoサービスを使える状態で返す
 */
export const getAuthedServices = async (): Promise<ICinerinoServices> => {
    try {
        // await refreshAuth();
        const option = await createOption();
        cinerinoServices = {
            eventService: new cinerino.service.Event(option),
            placeService: new cinerino.service.Place(option),
        };
        return cinerinoServices;
    } catch (e) {
        console.log('[catched][cinerinoPlugin][getAuthedServices]', e);
        throw typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e;
    }
};

/**
 *  設定作成
 */
async function createOption() {
    cinerinoServiceAuth = await authorize();
    return {
        endpoint: window.appEnv.CINERINO_API_ENDPOINT,
        auth: cinerinoServiceAuth,
        project: { id: window.appEnv.PROJECT_ID },
    };
}

/**
 * 認証情報取得
 */
async function authorize() {
    // eslint-disable-next-line prettier/prettier
    if (cinerinoServiceAuth !== undefined
        && cinerinoServiceAuth.credentials.expiryDate !== undefined) {
        const expiryDate = cinerinoServiceAuth.credentials.expiryDate;
        const isTokenExpired =
            expiryDate !== undefined
                ? moment(expiryDate)
                      .add(-5, 'minutes')
                      .unix() <= moment().unix()
                : false;
        if (!isTokenExpired) {
            // 期限が5分以上あるならアクセストークン更新しない
            return cinerinoServiceAuth;
        }
    }
    const url = '/api/authorize/getCredentials';
    const limit = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            const result = (await axios.post<{ accessToken: string; expiryDate: number; clientId: string }>(url)).data;
            return setCredentials(result);
        } catch (error) {
            if (error.status !== undefined && error.status >= 500) {
                loop = count < limit;
                count++;
                await sleep(20000);
                continue;
            }
            throw error;
        }
    }
}

/**
 * 認証情報設定
 */
// eslint-disable-next-line prettier/prettier
function setCredentials(params: {
    clientId: string;
    accessToken: string;
    expiryDate: number;
}) {
    const option = {
        domain: '',
        clientId: params.clientId,
        redirectUri: '',
        logoutUri: '',
        responseType: '',
        scope: '',
        state: '',
        nonce: null,
        tokenIssuer: '',
    };
    const auth = cinerino.createAuthInstance(option);
    auth.setCredentials({ accessToken: params.accessToken, expiryDate: params.expiryDate });
    return auth;
}

/**
 * 待機
 */
async function sleep(time: number = 500) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

export default {
    // 非同期のinstall
    install: async (Vue: any): Promise<void> => {
        Object.defineProperties(Vue.prototype, {
            $cinerino: {
                get() {
                    return { getAuthedServices };
                },
            },
        });
    },
};
