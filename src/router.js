import Vue from 'vue';
import VueRouter from 'vue-router';
import ScheduleView from './views/ScheduleView.vue';
import store from './store';

Vue.use(VueRouter);

Vue.use(VueRouter);

const Router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
        },
        {
            path: '/view/:branchCode',
            name: 'scheduleView',
            component: ScheduleView,
            meta: {
                auth_required: true,
            },
        },
    ],
});

Router.beforeEach(async (to, from, next) => {
    try {
        const { $cinerino } = Router.app;
        await $cinerino.checkAuth();
    } catch (e) {
        store.commit('UPDATE_systemMsg', `Auth Error: ${e.message}`);
    }
    return next();
});

export default Router;
