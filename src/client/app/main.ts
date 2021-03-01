import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'normalize.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import cinerinoPlugin from './plugins/cinerino';
import { sleep, fetchEnv } from './misc';

Vue.config.productionTip = false;

const appElm = window.document.getElementById('app');

(async () => {
    if (!appElm) {
        return alert('invalid HTML (#app not exist)');
    }
    try {
        // 環境変数をサーバから取る。拾えなかったら1分待機してリトライ
        while (!window.appEnv) {
            try {
                // eslint-disable-next-line
                window.appEnv = await fetchEnv();
            } catch (e) {
                // eslint-disable-next-line
                appElm.innerHTML = `<pre>[FATAL][${new Date().toLocaleString()}] failed to fetch the server environment variables. (automatically retry in 60 seconds.)<br><br>${
                    e.message
                }</pre>`;
                // eslint-disable-next-line
                await sleep(60000);
            }
        }
        console.log('[main.js][init] server environment variables', window.appEnv);
        // this.$cinerino をセットする
        cinerinoPlugin.install(Vue);
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
