import axios from 'axios';

axios.defaults.timeout = 50000;
axios.defaults.cache = false;

// PHPなどのsleepと同じ
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// 環境変数をサーバから得る
export function fetchEnv() {
    return new Promise(async (resolve, reject) => {
        try {
            const env = (await axios.get('/env.php')).data;
            if (
                typeof env !== 'object' ||
                !env.authConfig ||
                !env.cognitoUser ||
                !env.CINERINO_API_ENDPOINT ||
                !env.authConfig.identityPoolId ||
                !env.authConfig.region ||
                !env.authConfig.userPoolId ||
                !env.authConfig.userPoolWebClientId ||
                !env.cognitoUser.userId ||
                !env.cognitoUser.password
            ) {
                throw new Error('env.php invalid reposponce');
            }
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
