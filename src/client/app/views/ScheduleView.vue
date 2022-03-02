<template>
    <div class="maincontent">
        <schedule-table :screeningEventsByMovieId="screeningEventsByMovieId"></schedule-table>
        <footer>
            <div class="clockcontainer">
                <clock class="clock" :dayjs_force="dayjs_force" @tick="update()" @tick3min="checkEnv()"></clock>
            </div>
            <div class="msg">
                <span class="anim-loading" v-show="busy_update"></span>
                <span class="msgtext" v-if="$store.state.systemMsg">{{ $store.state.systemMsg }}</span>
            </div>
            <div class="logo"></div>
        </footer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
// @ts-ignore
import { diff } from 'deep-diff';
import { sleep, fetchEnv } from '../misc';
import ScheduleTable from '../components/ScheduleTable.vue';
import Clock from '../components/Clock.vue';
import { authorize, searchMovies, searchScreeningEvent, searchScreeningEventSeries } from '../plugins/api';
import { ScreeningEventTypes } from '../Constants';

dayjs.extend(isBetween);

export default Vue.extend({
    name: 'mainview',
    components: {
        Clock,
        ScheduleTable,
    },
    data() {
        return {
            dayjs_force: null as dayjs.Dayjs | null,
            busy_update: true,
            lastupdate: '',
            screeningEventsByMovieId: {},
        };
    },
    computed: {
        // 劇場コード
        branchCode(): string {
            return this.$route.params.branchCode;
        },
    },
    methods: {
        updateSystemMsg(msg: string) {
            this.$store.commit('UPDATE_systemMsg', msg);
        },
        // 定期的に環境変数を確認して変更を検知したら自動でリロードする
        async checkEnv(): Promise<void> {
            const limit = 5;
            let count = 0;
            let loop = true;
            while (loop) {
                loop = false;
                try {
                    const latestEnv = await fetchEnv();
                    if (diff(window.appEnv, latestEnv)) {
                        this.updateSystemMsg(`環境変数の変更を検知 (20秒後リロード)`);
                        await sleep(20000);
                        return window.location.reload();
                    }
                } catch (e) {
                    const error = e as any;
                    if (count < limit) {
                        loop = true;
                        count++;
                        await sleep(5000);
                        continue;
                    }
                    this.updateSystemMsg(`[${dayjs().format('HH:mm')}] 環境変数の確認に失敗 ${error.message}`);
                }
            }
            return;
        },
        // 上映枠データからCSSクラス用の文字列を決定
        getCssNameFromScreeningEvent(screeningEvent: ScreeningEventTypes): string {
            const { remainingAttendeeCapacity, maximumAttendeeCapacity } = screeningEvent;
            if (!remainingAttendeeCapacity || !maximumAttendeeCapacity) {
                return 'soldout';
            }
            const remainPercentage = (remainingAttendeeCapacity / maximumAttendeeCapacity) * 100;
            const crowdedThresholdPercentage = window.appEnv.STATUS_THRESHOLD_CROWDED || 30;
            if (remainPercentage <= crowdedThresholdPercentage) {
                return 'crowded';
            }
            return 'vacant';
        },
        // 更新処理 (時計のtickイベントで着火)
        async update() {
            if (this.busy_update) {
                return false;
            }
            this.busy_update = true;
            try {
                // ※BrightSignはnavigator.onLineが機能していないので貫通してしまう
                if (!window.navigator.onLine) {
                    throw new Error('端末がオフライン状態です');
                }
                await authorize();
                const dayjs_now = this.dayjs_force || dayjs();
                const startFrom = dayjs_now
                    .subtract(window.appEnv.STATUS_THRESHOLD_OUTOFDATE || 20, 'minute')
                    .toDate()
                    .toISOString();
                const startThrough = dayjs_now
                    .set('hour', 23)
                    .set('minute', 59)
                    .toDate()
                    .toISOString();
                // 上映イベント検索は上映開始時刻からSTATUS_THRESHOLD_OUTOFDATE分後の上映までは表示に含めるようにする
                const screeningEvents = await searchScreeningEvent({
                    startFrom,
                    startThrough,
                    superEventLocationBranchCode: this.branchCode,
                });
                const sellingScreeningEvents = screeningEvents.filter((event: ScreeningEventTypes) => {
                    if (event.offers === undefined) {
                        return false;
                    }
                    // 実際にPOSで販売できなければ無意味なのでvalidFromとvalidThroughでフィルターする
                    return dayjs_now.isBetween(event.offers.validFrom, event.offers.validThrough);
                });
                if (!sellingScreeningEvents.length) {
                    this.screeningEventsByMovieId = {};
                    this.updateSystemMsg('現在表示できるスケジュールはありません');
                    this.busy_update = false;
                    return true;
                }
                sellingScreeningEvents.sort((a, b) => {
                    if (a.startDate < b.startDate) {
                        return -1;
                    }
                    if (a.startDate > b.startDate) {
                        return 1;
                    }
                    return 0;
                });
                const screeningEventSeries = await searchScreeningEventSeries({
                    locationBranchCode: this.branchCode,
                });
                const movies = await searchMovies({});
                // 上映情報を作品ごとにまとめつつ整形する
                const screeningEventsByMovieId = sellingScreeningEvents.reduce((a, b) => {
                    if (!b || !b.workPerformed || !b.location) {
                        return a;
                    }
                    const movieId = b.workPerformed.identifier;
                    if (!a[movieId]) {
                        a[movieId] = [];
                    }
                    // 表示するのは6個まで
                    if (a[movieId].length === 6) {
                        return a;
                    }
                    const screeningEventSeriesData = screeningEventSeries.find((data) => {
                        return data.id === b.superEvent.id;
                    });
                    const MovieData = movies.find((movie) => {
                        return movie.identifier === b.workPerformed.identifier;
                    });
                    a[movieId].push({
                        id: b.id,
                        datePublished: new Date(MovieData?.datePublished || 0),
                        contentRating: b.workPerformed.contentRating !== 'G' ? b.workPerformed.contentRating : '',
                        startHHmm: dayjs(b.startDate).format('HH:mm'),
                        title: screeningEventSeriesData?.additionalProperty.find((data) => data.name === 'signageDisplayName')?.value || MovieData?.name.ja || '',
                        subtitle: screeningEventSeriesData?.additionalProperty.find((data) => data.name === 'signageDislaySubtitleName')?.value || b.workPerformed.headline,
                        entitle: MovieData?.name.en || '',
                        addressEnglish: b.location.address ? b.location.address.en : '-',
                        availabilityName: this.getCssNameFromScreeningEvent(b),
                    });
                    return a;
                }, {} as any);
                this.screeningEventsByMovieId = screeningEventsByMovieId;
                this.lastupdate = dayjs().format('HH:mm');
                this.updateSystemMsg('');
            } catch (e) {
                const error = e as any;
                const msg = this.lastupdate ? `(現在${this.lastupdate}時点のデータを表示中)` : '';
                this.updateSystemMsg(`[${dayjs().format('HH:mm')}] 更新処理に失敗しました${msg} (${error.message})`);
            }
            this.busy_update = false;
            return true;
        },
    },
    async created() {
        try {
            if (typeof this.$route.query.unix === 'string' && this.$route.query.unix.length) {
                this.dayjs_force = dayjs.unix(parseInt(this.$route.query.unix, 10));
            }
            this.busy_update = false;
            this.update();
        } catch (e) {
            const error = e as any;
            this.updateSystemMsg(error.message);
            this.busy_update = false;
        }
    },
});
</script>

<style lang="scss">
$color_tablerow_bg_odd: #0a318e;
$color_floor_bg_odd: #0e326e;
$color_tablerow_bg_even: #004098;
$color_floor_bg_even: #013a7f;
$color_status_bg: #092147;

.maincontent {
    width: 100vw;
    height: 56.25vw;
    background: #000;
    color: #fff;
    padding: 0.5vw;
    overflow: hidden;
    .maintable {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 51vw;
        .tablerow {
            background: $color_tablerow_bg_odd;
            border-top: 2px solid #c2cde3;
            flex: 1;
            height: 20%; // ※BrightSignのため必要
            overflow: hidden;
            &:first-child {
                border: none;
            }
            .mark {
                background: $color_tablerow_bg_odd;
            }
            .pf-data-floor {
                background: $color_floor_bg_odd;
            }
        }
        .tablerow:nth-child(even) {
            background: $color_tablerow_bg_even;
            .mark {
                background: $color_tablerow_bg_even;
            }
            .pf-data-floor {
                background: $color_floor_bg_even;
            }
        }
        .tablecell {
            display: inline-block;
            height: 100%;
            vertical-align: top;
        }
        .tablecell-title {
            width: 42%;
            padding: 0.8vw;
            border-right: 2px solid #000;
            position: relative;
            height: 101%;
            .title {
                position: relative;
                width: 100%;
                height: 100%;
                h1,
                h2,
                p {
                    height: 1.5em;
                    line-height: 1.5;
                    overflow-y: hidden;
                    word-break: break-all;
                }
                .title-main-and-sub {
                    position: absolute;
                    width: 100%;
                    height: 75%;
                    left: 0;
                    top: 0;
                    display: table;
                }
                .title-main {
                    display: table-cell;
                    vertical-align: middle;
                    position: relative;
                    h1 {
                        font-size: 2.34vw;
                    }
                    h2 {
                        font-size: 1.5vw;
                        font-weight: lighter;
                    }
                    &.title-main-rating {
                        h1 {
                            padding-right: 6.4vw;
                        }
                    }
                    .mark {
                        position: absolute;
                        right: 0;
                        top: 0;
                        padding: 0 0.5vw;
                        font-size: 1.6vw;
                        line-height: 2;
                        border: 1px solid #fff;
                    }
                }
                .title-en {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 25%;
                    left: 0.15vw;
                    font-size: 1.15vw;
                }
            }
        }
        .tablecell-pf {
            width: 9.666%;
            height: 101%;
            text-align: center;
            border-right: 2px solid #000;
            &:last-child {
                border-right: none;
            }
            .pf {
                width: 100%;
                height: 100%;
                font-weight: bold;
                > div {
                    display: table;
                    width: 100%;
                }
                .pf-time {
                    border-bottom: 2px solid #000;
                    height: 54%;
                    > h2 {
                        display: table-cell;
                        vertical-align: middle;
                        font-size: 2.8vw;
                    }
                }
                .pf-data {
                    height: 46%;
                    > div {
                        width: 50%;
                        display: table-cell;
                        vertical-align: middle;
                        &:first-child {
                            border-right: 1px solid #000;
                        }
                        &:last-child {
                            border-left: 1px solid #000;
                        }
                    }
                    .pf-data-status {
                        background: $color_status_bg;
                        font-size: 2vw;
                        span {
                            width: 100%;
                            height: 100%;
                            display: table;
                            &::before {
                                display: block;
                                content: '';
                                width: 100%;
                                height: 100%;
                                background-position: 50%;
                                background-repeat: no-repeat;
                                background-size: 50%;
                            }
                        }
                        &.pf-data-status-vacant span::before {
                            background-image: url(../assets/icon_status_vacant.svg);
                        }
                        &.pf-data-status-crowded span::before {
                            background-image: url(../assets/icon_status_crowded.svg);
                        }
                        &.pf-data-status-soldout span::before {
                            color: #e71f18;
                            content: '完売';
                            display: table-cell;
                            vertical-align: middle;
                        }
                    }
                    .pf-data-floor {
                        font-size: 2.4vw;
                    }
                }
            }
        }
    }
    footer {
        padding: 0.5vw;
        display: table;
        width: 100%;
        height: 4.5vw;
        overflow: hidden;
        color: #fff;
        > div {
            display: table-cell;
            vertical-align: middle;
        }
        .clockcontainer {
            width: 22vw;
        }
        .clock {
            font-size: 2vw;
            vertical-align: middle;
            .icon-clock {
                &::before {
                    width: 1.6vw;
                    height: 1.6vw;
                    margin-right: 0.5vw;
                }
            }
            .dayname {
                font-size: 1.4vw;
                margin: 0 0.6vw 0 0.2vw;
            }
        }
        .msg {
            text-align: center;
            vertical-align: bottom;
            .msgtext {
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 0 1em;
                display: inline-block;
                max-height: 1.15em;
            }
            .anim-loading {
                margin: auto;
                width: 24px;
                height: 24px;
                position: relative;
                display: block;
            }
        }
        .logo {
            width: 20vw;
            background-position: 50%;
            background-repeat: no-repeat;
            background-image: url(../assets/logo_toei.svg);
        }
    }
}
</style>
