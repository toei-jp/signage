<template>
    <div class="home">
        <p class="systemMsg">{{ $store.state.systemMsg }}</p>
        <h1>劇場一覧</h1>
        <ul>
            <li v-for="theater in theaters" :key="theater.length">
                <h2>[{{ theater.branchCode }}] {{ theater.name.ja }}</h2>
                <router-link
                    :to="{
                        name: 'scheduleView',
                        params: { branchCode: theater.branchCode },
                    }"
                    >スケジュール画面</router-link
                >
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { authorize, searchMovieTheaters } from '../plugins/api';
import { theaterTypes } from '../Constants';

export default Vue.extend({
    name: 'home',
    data() {
        return {
            theaters: [] as theaterTypes[],
        };
    },
    async created() {
        this.$store.commit('UPDATE_systemMsg', '');
        try {
            await authorize();
            this.theaters = await searchMovieTheaters();
        } catch (e) {
            const error = e as any;
            this.$store.commit('UPDATE_systemMsg', `劇場一覧の取得に失敗しました: ${error.message}`);
        }
    },
});
</script>

<style lang="scss" scoped>
.systemMsg {
    color: red;
}
h3 {
    margin: 0;
}
</style>
