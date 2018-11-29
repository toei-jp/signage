<template>
    <span class="clock">
        <span>{{ date }}</span>
        <span class="dayname">{{ dayname }}</span>
        <span class="time icon-clock">
            <span>{{ HH }}</span>
            <span class="colon">:</span>
            <span>{{ mm }}</span>
        </span>
    </span>
</template>

<script>
import * as moment from 'moment';
import { getNextTickUnixtime } from '../misc';

// 3分おきの着火用カウント
let min3Count = 0;

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
                min3Count++;
                if (min3Count === 3) {
                    min3Count = 0;
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
