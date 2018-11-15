import 'normalize.css';
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import cinerinoPlugin from './plugins/cinerio';
import { sleep, fetchEnv } from './misc';

Vue.config.productionTip = false;

axios.defaults.timeout = 50000;
axios.defaults.cache = false;
Vue.use(VueAxios, axios);

(async () => {
    try {
        // 環境変数をサーバから取る。拾えなかったら1分待機してリトライ
        window.appEnv = null;
        while (!window.appEnv) {
            try {
                // eslint-disable-next-line
                window.appEnv = await fetchEnv();
            } catch (e) {
                window.document.getElementById(
                    'app',
                ).innerHTML = `<pre>[FATAL][${new Date().toLocaleString()}] failed to fetch the server environment variables. (automatically retry in 60 seconds.)<br><br>${e.message}</pre>`;
                // eslint-disable-next-line
                await sleep(60000);
            }
        }
        // this.$cinerino をセットする。Cognito認証に失敗しても自動でやり直すのでここではスルーする
        await cinerinoPlugin.install(Vue, { authConfig: window.appEnv.authConfig, cognitoUser: window.appEnv.cognitoUser, CINERINO_API_ENDPOINT: window.appEnv.CINERINO_API_ENDPOINT });
    } catch (e) {
        console.log('[main.js][catched]', e);
        store.commit('UPDATE_systemMsg', `[FATAL] init Auth Error: ${e.message}`);
    }

    Vue.component('Clock', require('./components/Clock.vue').default);

    return new Vue({
        router,
        store,
        render: (h) => h(App),
    }).$mount('#app');
})();
