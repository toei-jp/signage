<template>
    <div class="home">
        <p class="systemMsg">{{ $store.state.systemMsg }}</p>
        <h1>劇場一覧</h1>
        <ul>
            <li v-for="theater in theaterArray" :key="theater.id">
                <h2>[{{ theater.location.branchCode }}] {{ theater.name.ja }}</h2>
                <router-link
                    :to="{
                        name: 'scheduleView',
                        params: { branchCode: theater.location.branchCode },
                    }"
                    >スケジュール画面</router-link
                >
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'home',
    data() {
        return {
            theaterArray: [] as any[],
        };
    },
    async created() {
        this.$store.commit('UPDATE_systemMsg', '');
        try {
            const { sellerService } = await this.$cinerino.getAuthedServices();
            const theaterData = (await sellerService.search({})).data;
            console.log('theaterData', theaterData);
            this.theaterArray = theaterData.filter((theater) => {
                return !!theater.location && /TOEI/.test(theater.name.ja);
            });
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
