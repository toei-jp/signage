<template>
    <span class="clock">
        {{ date }}<span class="dayname">{{ dayname }}</span><span class="time icon-clock">{{ HH }}<span class="colon">:</span>{{ mm }}</span>
    </span>
</template>

<script>
import * as moment from 'moment';
import { getNextTickUnixtime } from '../misc';

// 5分おきの着火用カウント
let min5Count = 0;

export default {
    data() {
        return {
            moment_now: moment(),
            timeoutInstance_updateMoment: null,
        };
    },
    computed: {
        date() {
            return this.moment_now.format('M/D');
        },
        dayname() {
            return this.moment_now.format('(ddd)');
        },
        HH() {
            return this.moment_now.format('HH');
        },
        mm() {
            return this.moment_now.format('mm');
        },
    },
    methods: {
        setTimeoutUpdateMoment() {
            clearTimeout(this.timeoutInstance_updateMoment);
            this.timeoutInstance_updateMoment = setTimeout(() => {
                this.moment_now = moment();
                this.$emit('tick');
                min5Count++;
                if (min5Count === 5) {
                    min5Count = 0;
                    this.$emit('tick5min');
                }
                this.setTimeoutUpdateMoment();
            }, getNextTickUnixtime());
        },
    },
    created() {
        this.setTimeoutUpdateMoment();
    },
    beforeDestroy() {
        clearTimeout(this.timeoutInstance_updateMoment);
    },
};
</script>

<style lang="scss" scoped>
@keyframes blink {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    51% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}
.colon {
    animation-name: blink;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}
</style>
