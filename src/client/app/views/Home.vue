<template>
    <div class="home">
        <p class="systemMsg">{{ $store.state.systemMsg }}</p>
        <h1>劇場一覧</h1>
        <ul>
            <li v-for="theater in theaterArray" :key="theater.id">
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
import { factory } from '@cinerino/sdk';
import Vue from 'vue';

export default Vue.extend({
    name: 'home',
    data() {
        return {
            theaterArray: [] as factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[],
        };
    },
    async created() {
        this.$store.commit('UPDATE_systemMsg', '');
        try {
            const { placeService } = await this.$cinerino.getAuthedServices();
            const theaterData = (await placeService.searchMovieTheaters({})).data;
            console.log('theaterData', theaterData);
            this.theaterArray = theaterData;
        } catch (e) {
            this.$store.commit('UPDATE_systemMsg', `劇場一覧の取得に失敗しました: ${e.message}`);
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
