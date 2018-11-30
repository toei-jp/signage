<template>
    <span class="clock">
        <span>{{ moment_now.format('M/D') }}</span>
        <span class="dayname">{{ moment_now.format('(ddd)') }}</span>
        <span class="time icon-clock">
            <span>{{ moment_now.format('HH') }}</span>
            <span class="colon">:</span>
            <span>{{ moment_now.format('mm') }}</span>
        </span>
    </span>
</template>

<script>
import * as moment from 'moment';
import { getNextTickUnixtime } from '../misc';

export default {
    data() {
        return {
            moment_now: moment(),
            min3Count: 0, // 3分おきの着火用カウント
            timeoutInstance_updateMoment: null,
        };
    },
    methods: {
        setTimeoutUpdateMoment() {
            clearTimeout(this.timeoutInstance_updateMoment);
            this.timeoutInstance_updateMoment = setTimeout(() => {
                this.moment_now = moment();
                this.$emit('tick');
                this.min3Count++;
                if (this.min3Count === 3) {
                    this.min3Count = 0;
                    this.$emit('tick3min');
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
