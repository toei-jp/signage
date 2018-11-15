<template>
    <div class="maincontent">
        <div class="maintable">
            <div v-for="(key) in performanceMovieIdArray" :key="key" class="tablerow">
                <template v-if="screeningEventsByMovieId[key]">
                    <div class="tablecell tablecell-title">
                        <div class="title">
                            <div class="marks">
                                <span class="mark mark-rating" v-if="screeningEventsByMovieId[key][0].contentRating">
                                    {{ screeningEventsByMovieId[key][0].contentRating }}
                                </span>
                            </div>
                            <h1>{{ screeningEventsByMovieId[key][0].signageDisplayName }}</h1>
                            <h2>{{ screeningEventsByMovieId[key][0].signageDislaySubtitleName }}</h2>
                            <p>{{ screeningEventsByMovieId[key][0].signageDisplayEnglishName }}</p>
                        </div>
                    </div>
                    <div v-for="pf in screeningEventsByMovieId[key]" :key="pf.id" class="tablecell tablecell-pf">
                        <div class="pf">
                            <div class="pf-time">
                                <h2>{{ pf.startHHmm }}</h2>
                            </div>
                            <div class="pf-data">
                                <div :class="`pf-data-status pf-data-status-${pf.availabilityName}`"><span></span></div>
                                <div class="pf-data-floor">{{ pf.addressEnglish }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <footer>
            <div class="clockcontainer">
                <clock class="clock" @tick="update()" @tick5min="checkEnv()"></clock>
            </div>
            <div class="msg">
                <span class="anim-loading" v-if="busy_update"></span>
                <span class="msgtext">{{ $store.state.systemMsg }}</span>
            </div>
            <div class="logo"></div>
        </footer>
    </div>
</template>

<script>
import * as moment from 'moment';
import { diff } from 'deep-diff';
import { sleep, fetchEnv } from '../misc';

moment.locale('ja');

export default {
    name: 'mainview',
    data() {
        return {
            theater: null,
            busy_update: true,
            screeningEventsByMovieId: [],
        };
    },
    computed: {
        // 劇場コード
        branchCode() {
            return this.$route.params.branchCode;
        },
        // 作品ID配列
        performanceMovieIdArray() {
            const keys = Object.keys(this.screeningEventsByMovieId);
            keys.length = 5; // 足りなくて多くても常に5行表示する
            return keys;
        },
    },
    methods: {
        // 定期的に環境変数を確認する
        checkEnv() {
            return new Promise(async (resolve) => {
                try {
                    const latestEnv = await fetchEnv();
                    if (diff(window.appEnv, latestEnv)) {
                        this.$store.commit('UPDATE_systemMsg', `環境変数の変更を検知 (20秒後リロード)`);
                        await sleep(20000);
                        return window.location.reload(true);
                    }
                } catch (e) {
                    this.$store.commit('UPDATE_systemMsg', `環境変数の再取得に失敗 ${e.message}`);
                }
                return resolve();
            });
        },
        // 残席数をCSSクラス用の文字列に変換
        getAvailabilityNameByRemainingAttendeeCapacity(remainingAttendeeCapacity) {
            if (!remainingAttendeeCapacity) {
                return 'soldout';
            }
            if (remainingAttendeeCapacity <= 10) {
                return 'crowded';
            }
            return 'vacant';
        },
        // URLの劇場コードから劇場を取得・保存する
        fetchTheterByUrlParam() {
            return new Promise(async (resolve, reject) => {
                this.$store.commit('UPDATE_systemMsg', `劇場コード ${this.branchCode} の情報を取得中...`);
                try {
                    const { organizationService } = await this.$cinerino.getAuthedServices();
                    // cinerinoAPIはbranchCodeでtheaterを検索できない(定義はあるが実装されていない)ので一旦全て拾う
                    const allTheaterArray = (await organizationService.searchMovieTheaters({})).data;
                    const theater = allTheaterArray.filter((t) => {
                        return t.location.branchCode === this.branchCode;
                    })[0];
                    if (!theater) {
                        throw new Error(`劇場コード ${this.branchCode} の劇場情報を取得できませんでした`);
                    }
                    this.theater = theater;
                    this.$store.commit('UPDATE_systemMsg', '');
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        },
        // 更新処理 (時計のtickイベントで着火)
        async update() {
            if (this.busy_update) {
                return false;
            }
            this.busy_update = true;
            try {
                if (!window.navigator.onLine) {
                    throw new Error('端末がオフライン状態です');
                }
                if (!this.theater) {
                    await this.fetchTheterByUrlParam();
                }
                const { eventService } = await this.$cinerino.getAuthedServices();
                const moment_now = moment();
                const screeningEvents = (await eventService.searchScreeningEvents({
                    superEvent: {
                        locationBranchCodes: [this.theater.location.branchCode],
                    },
                    startFrom: moment_now.toDate(),
                    endThrough: moment()
                        .hour(23)
                        .minute(59)
                        .toDate(),
                })).data.filter((event) => {
                    // 購入可能状態の上映だけ抽出する
                    return /EventScheduled|EventRescheduled/.test(event.eventStatus) && moment_now.isBetween(event.offers.validFrom, event.offers.validThrough);
                });
                if (!screeningEvents.length) {
                    this.$store.commit('UPDATE_systemMsg', '現在表示できるスケジュールはありません');
                    this.busy_update = false;
                    return true;
                }
                screeningEvents.sort((a, b) => {
                    if (a.startDate < b.startDate) {
                        return -1;
                    }
                    if (a.startDate > b.startDate) {
                        return 1;
                    }
                    return 0;
                });
                // 上映を作品ごとにまとめつつ整形する
                const screeningEventsByMovieId = screeningEvents.reduce((a, b) => {
                    if (!a[b.superEvent.id]) {
                        a[b.superEvent.id] = [];
                    }
                    // 表示するのは6個まで
                    if (a[b.superEvent.id].length === 6) {
                        return a;
                    }
                    a[b.superEvent.id].push({
                        id: b.id,
                        contentRating: b.contentRating !== 'G' ? b.contentRating : '',
                        videoFormat: b.superEvent.videoFormat,
                        soundFormat: b.superEvent.soundFormat,
                        startHHmm: moment(b.startDate).format('HH:mm'),
                        signageDisplayName: b.superEvent.signageDisplayName,
                        signageDislaySubtitleName: b.superEvent.signageDislaySubtitleName,
                        signageDisplayEnglishName: b.superEvent.name.en,
                        addressEnglish: b.location.address.en,
                        availabilityName: this.getAvailabilityNameByRemainingAttendeeCapacity(b.remainingAttendeeCapacity),
                    });
                    return a;
                }, {});
                this.screeningEventsByMovieId = screeningEventsByMovieId;
                this.$store.commit('UPDATE_systemMsg', '');
            } catch (e) {
                this.$store.commit('UPDATE_systemMsg', `更新処理に失敗しました (${e.message})`);
            }
            this.busy_update = false;
            return true;
        },
    },
    async created() {
        try {
            await this.fetchTheterByUrlParam();
            this.$store.commit('UPDATE_systemMsg', `「${this.theater.name.ja}」のスケジュールを取得中...`);
            this.busy_update = false;
            this.update();
        } catch (e) {
            this.$store.commit('UPDATE_systemMsg', e.message);
            this.busy_update = false;
        }
    },
};
</script>

<style lang="scss" scoped>
.maincontent {
    width: 100vw;
    height: 56.25vw;
    background: #000;
    color: #fff;
    padding: 1vw;
    overflow: hidden;
    h1,
    h2,
    p {
        margin: 0;
    }
    .maintable {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 51vw;
        .tablerow {
            background: #0a318e;
            border-top: 2px solid #c2cde3;
            flex: 1;
            height: 20%; // ※BrightSignのため必要
            &:first-child {
                border: none;
            }
            .marks {
                background: #0a318e;
            }
        }
        .tablerow:nth-child(even) {
            background: #004098;
            .marks {
                background: #004098;
            }
        }
        .tablecell {
            display: inline-block;
            height: 100%;
            vertical-align: top;
        }
        .tablecell-title {
            width: 40%;
            padding: 0.8vw;
            border-right: 2px solid #000;
            .title {
                position: relative;
                h1,
                h2,
                p {
                    height: 1.5em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: hidden;
                    line-height: 1.5;
                }
                h1 {
                    font-size: 2.2vw;
                }
                h2 {
                    font-size: 1.2vw;
                    margin-bottom: 0.5vw;
                    font-weight: lighter;
                }
                p {
                    font-size: 1vw;
                }
                .marks {
                    position: absolute;
                    right: -0.5vw;
                    top: -0.5vw;
                    padding: 0 0 1em 0;
                }
                .mark {
                    padding: 0 0.5vw;
                    font-size: 1.6vw;
                    line-height: 2;
                    border: 1px solid #fff;
                }
            }
        }
        .tablecell-pf {
            width: 10%;
            text-align: center;
            border-right: 2px solid #000;
            .pf {
                width: 100%;
                height: 100%;
                font-weight: bold;
                > div {
                    display: table;
                    width: 100%;
                    height: 50%;
                }
                .pf-time {
                    border-bottom: 2px solid #000;
                    > h2 {
                        display: table-cell;
                        vertical-align: middle;
                        font-size: 2.8vw;
                    }
                }
                .pf-data {
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
                        background: #092147;
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
                            color: red;
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
        color: #fff;
        > div {
            display: table-cell;
            vertical-align: middle;
        }
        .clockcontainer {
            width: 22vw;
        }
        .clock /deep/ {
            font-size: 2vw;
            vertical-align: middle;
            .icon-clock {
                &::before {
                    width: 1.6vw;
                    height: 1.6vw;
                    margin-right: 0.4vw;
                }
            }
            .dayname {
                font-size: 1.4vw;
                margin: 0 0.6vw 0 0.2vw;
            }
        }
        .msg {
            text-align: center;
            .anim-loading {
                margin: auto;
                width: 24px;
                height: 24px;
                position: relative;
                display: block;
            }
            .msgtext {
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
