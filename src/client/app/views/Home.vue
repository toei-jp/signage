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
            this.theaterArray = theaterData
                .filter((theater) => {
                    return theater.name && (theater.name as any).en && /TOEI/.test((theater.name as any).en);
                })
                .map((theater) => {
                    if (theater.location && theater.location.branchCode) {
                        return theater;
                    }
                    const name = (theater.name as any).ja;
                    let branchCode = '';
                    if (/渋谷/.test(name)) {
                        branchCode = '001';
                    } else if (/丸の内/.test(name)) {
                        branchCode = '002';
                    } else {
                        branchCode = 'unknown';
                    }
                    theater.location = {
                        branchCode,
                    } as any;
                    return theater;
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
