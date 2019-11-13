import axios from 'axios';
import { IAppConfig } from './Constants';

axios.defaults.timeout = 50000;

// PHPなどのsleepと同じ
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Promiseにタイムアウトを付ける
export const promiseTimeoutWrapper = <_, T>(ms: number, promise: Promise<T>): Promise<T> => {
    return Promise.race([
        new Promise((_, reject): any =>
            setTimeout(() => {
                reject(new Error(`Timeout Error (${ms}ms)`));
            }, ms),
        ),
        promise,
    ]) as Promise<T>;
};

// オブジェクトのプロパティが数値として読めなかったらnullにする
const parseIntOrSetNull = (obj: any, key: string): void => {
    obj[key] = parseInt(obj[key], 10);
    if (Number.isNaN(obj[key])) {
        obj[key] = null;
    }
};

// 環境変数をサーバから得る
export const fetchEnv = async (): Promise<IAppConfig> => {
    const env: IAppConfig = (await axios.get(`/env?${Date.now()}`)).data;
    if (
        // 必須な値の確認
        typeof env !== 'object' ||
        !env.authConfig ||
        !env.cognitoUser ||
        !env.CINERINO_API_ENDPOINT ||
        !env.authConfig.userPoolId ||
        !env.authConfig.userPoolWebClientId ||
        !env.cognitoUser.userId ||
        !env.cognitoUser.password
    ) {
        throw new Error('/env invalid respoponse');
    }
    parseIntOrSetNull(env, 'CINERINO_SCHEDULE_FETCH_TIMEOUT');
    parseIntOrSetNull(env, 'STATUS_THRESHOLD_CROWDED');
    parseIntOrSetNull(env, 'STATUS_THRESHOLD_OUTOFDATE');
    return env;
};

// 現在時刻から次の更新時刻までのsetTimeout用msを得る
export const getNextTickUnixtime = (): number => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0).getTime() - now.getTime();
};
