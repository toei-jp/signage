import axios from 'axios';

axios.defaults.timeout = 50000;
axios.defaults.cache = false;

// PHPなどのsleepと同じ
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Promiseにタイムアウトを付ける
export function promiseTimeoutWrapper(ms, promise) {
    return Promise.race([
        new Promise((resolve, reject) =>
            setTimeout(() => {
                return reject(new Error(`Timeout Error (${ms}ms)`));
            }, ms),
        ),
        promise,
    ]);
}

// オブジェクトのプロパティが数値として読めなかったらnullにする
function parseIntOrSetNull(obj, key) {
    obj[key] = parseInt(obj[key], 10);
    if (Number.isNaN(obj[key])) {
        obj[key] = null;
    }
}

// 環境変数をサーバから得る
export function fetchEnv() {
    return new Promise(async (resolve, reject) => {
        try {
            const env = (await axios.get(`/env?${Date.now()}`)).data;
            if (
                // 必須な値の確認
                typeof env !== 'object' ||
                !env.authConfig ||
                !env.cognitoUser ||
                !env.CINERINO_API_ENDPOINT ||
                !env.authConfig.region ||
                !env.authConfig.userPoolId ||
                !env.authConfig.userPoolWebClientId ||
                !env.cognitoUser.userId ||
                !env.cognitoUser.password
            ) {
                throw new Error('/env invalid respoponse');
            }
            parseIntOrSetNull(env, 'CINERINO_SCHEDULE_FETCH_TIMEOUT');
            parseIntOrSetNull(env, 'STATUS_THRESHOLD_CROWDED');
            return resolve(env);
        } catch (e) {
            return reject(e);
        }
    });
}

// 現在時刻から次の更新時刻までのsetTimeout用msを得る
export function getNextTickUnixtime() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0) - now;
}
