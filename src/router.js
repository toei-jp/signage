import Vue from 'vue';
import VueRouter from 'vue-router';
import ScheduleView from './views/ScheduleView.vue';

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
        },
    ],
});

export default Router;
