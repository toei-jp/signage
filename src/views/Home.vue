<template>
    <div class="home">
        <p class="systemMsg">{{ $store.state.systemMsg }}</p>
        <h1>劇場一覧</h1>
        <ul>
            <li v-for="theater in theaterArray" :key="theater.id">
                <h2>[{{ theater.location.branchCode }}] {{ theater.name.ja }}</h2>
                <router-link :to="{ name: 'scheduleView', params: { branchCode: theater.location.branchCode }}">スケジュール画面</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
            theaterArray: [],
        };
    },
    async created() {
        this.$store.commit('UPDATE_systemMsg', '');
        try {
            const { organizationService } = await this.$cinerino.getAuthedServices();
            this.theaterArray = (await organizationService.searchMovieTheaters({})).data;
        } catch (e) {
            this.$store.commit('UPDATE_systemMsg', `劇場一覧の取得に失敗しました: ${e.message}`);
        }
    },
};
</script>

<style lang="scss" scoped>
.systemMsg {
    color: red;
}
h3 {
    margin: 0;
}
</style>
