<template>
    <div class="maintable">
        <div v-for="(_, rowNum) in [...Array(5)]" :key="rowNum" class="tablerow">
            <div class="tablecell tablecell-title">
                <div class="title" v-if="movieIdArray[rowNum] && screeningEventsByMovieId[movieIdArray[rowNum]]">
                    <div class="title-main-and-sub">
                        <div :class="['title-main', { 'title-main-rating': screeningEventsByMovieId[movieIdArray[rowNum]][0].contentRating }]">
                            <h1>{{ screeningEventsByMovieId[movieIdArray[rowNum]][0].title }}</h1>
                            <span class="mark mark-rating" v-if="screeningEventsByMovieId[movieIdArray[rowNum]][0].contentRating">{{
                                screeningEventsByMovieId[movieIdArray[rowNum]][0].contentRating
                            }}</span>
                            <h2 v-if="screeningEventsByMovieId[movieIdArray[rowNum]][0].subtitle">{{ screeningEventsByMovieId[movieIdArray[rowNum]][0].subtitle }}</h2>
                        </div>
                    </div>
                    <div class="title-en">
                        <p>{{ screeningEventsByMovieId[movieIdArray[rowNum]][0].entitle }}</p>
                    </div>
                </div>
            </div>
            <div v-for="(_, i) in [...Array(6)]" :key="`pf${rowNum}${i}`" class="tablecell tablecell-pf">
                <div class="pf" v-if="screeningEventsByMovieId[movieIdArray[rowNum]] && screeningEventsByMovieId[movieIdArray[rowNum]][i]">
                    <div class="pf-time">
                        <h2>{{ screeningEventsByMovieId[movieIdArray[rowNum]][i].startHHmm }}</h2>
                    </div>
                    <div class="pf-data">
                        <div :class="`pf-data-status pf-data-status-${screeningEventsByMovieId[movieIdArray[rowNum]][i].availabilityName}`">
                            <span></span>
                        </div>
                        <div class="pf-data-floor">{{ screeningEventsByMovieId[movieIdArray[rowNum]][i].addressEnglish }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * スケジュールTable
 * 内容の有無に関係無く常に5行6列表示。
 */
import Vue from 'vue';

export default Vue.extend({
    name: 'schedule-table',
    props: {
        screeningEventsByMovieId: {
            type: Object,
            required: true,
        },
    },
    computed: {
        // 作品ID配列
        movieIdArray(): string[] {
            const idArray = Object.keys(this.screeningEventsByMovieId);
            // datePublishedが新しい作品を優先表示
            idArray.sort((a, b) => {
                if (this.screeningEventsByMovieId[a][0].datePublished > this.screeningEventsByMovieId[b][0].datePublished) {
                    return -1;
                }
                if (this.screeningEventsByMovieId[a][0].datePublished < this.screeningEventsByMovieId[b][0].datePublished) {
                    return 1;
                }
                return 0;
            });
            return idArray;
        },
    },
});
</script>
