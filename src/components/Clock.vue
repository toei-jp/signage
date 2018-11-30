<template>
    <span class="clock">
        <span>{{ dayjs_now.format('M/D') }}</span>
        <span class="dayname">({{ dayname }})</span>
        <span class="time icon-clock">
            <span>{{ dayjs_now.format('HH') }}</span>
            <span class="colon">:</span>
            <span>{{ dayjs_now.format('mm') }}</span>
        </span>
    </span>
</template>

<script>
import dayjs from 'dayjs';
import { getNextTickUnixtime } from '../misc';

const dnameArray = ['日', '月', '火', '水', '木', '金', '土'];

export default {
    data() {
        return {
            dayjs_now: dayjs(),
            min3Count: 0, // 3分おきの着火用カウント
            timeoutInstance_update: null,
        };
    },
    computed: {
        dayname() {
            return dnameArray[this.dayjs_now.day()];
        },
    },
    methods: {
        setTimeoutUpdate() {
            clearTimeout(this.timeoutInstance_update);
            this.timeoutInstance_update = setTimeout(() => {
                this.dayjs_now = dayjs();
                this.$emit('tick');
                this.min3Count++;
                if (this.min3Count === 3) {
                    this.min3Count = 0;
                    this.$emit('tick3min');
                }
                this.setTimeoutUpdate();
            }, getNextTickUnixtime());
        },
    },
    created() {
        this.setTimeoutUpdate();
    },
    beforeDestroy() {
        clearTimeout(this.timeoutInstance_update);
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
