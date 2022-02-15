import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'normalize.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { sleep, fetchEnv } from './misc';

Vue.config.productionTip = false;

const appElm = window.document.getElementById('app');

(async () => {
    if (!appElm) {
        return alert('invalid HTML (#app not exist)');
    }
    try {
        // 認証情報初期化
        window.oAuth2data = {
            accessToken: '',
            tokenType: '',
            expiryDate: NaN,
            lastUpdate: NaN,
        };
        // 環境変数をサーバから取る。拾えなかったら1分待機してリトライ
        while (!window.appEnv) {
            try {
                window.appEnv = await fetchEnv();
            } catch (e) {
                appElm.innerHTML = `<pre>[FATAL][${new Date().toLocaleString()}] failed to fetch the server environment variables. (automatically retry in 60 seconds.)<br><br>${
                    e.message
                }</pre>`;
                await sleep(60000);
            }
        }
        console.log('[main.js][init] server environment variables', window.appEnv);
    } catch (e) {
        console.log('[catched][main.js]', e);
        store.commit('UPDATE_systemMsg', `init Auth Error: ${e.message}`);
    }

    return new Vue({
        router,
        store,
        render: (h) => h(App),
    }).$mount('#app');
})();
