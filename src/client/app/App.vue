<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    name: 'App',
});
</script>

<style lang="scss">
* {
    box-sizing: border-box;
}

html,
body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
}
table,
tr,
td,
th {
    padding: 0;
}
h1,
h2,
p {
    margin: 0;
}
#app {
    position: relative;
    width: 100%;
    height: 100%;
    -webkit-font-smoothing: antialiased;
}

.icon-clock {
    &::before {
        content: '';
        display: inline-block;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url('./assets/icon_clock.svg');
    }
}

.anim-loading {
    margin: 2em auto;
    width: 24px;
    height: 24px;
    position: relative;
    &::before,
    &::after {
        content: '';
        display: block;
        background-color: #fff;
        width: 8px;
        height: 8px;
        position: absolute;
        top: 0;
        left: 0;
        animation: sk-cubemove 1.8s infinite ease-in-out;
    }
    &::after {
        animation-delay: -0.9s;
    }
}

@keyframes sk-cubemove {
    25% {
        transform: translateX(15px) rotate(-90deg) scale(0.5);
    }
    50% {
        transform: translateX(15px) translateY(15px) rotate(-179deg);
    }
    50.1% {
        transform: translateX(15px) translateY(15px) rotate(-180deg);
    }
    75% {
        transform: translateX(0px) translateY(15px) rotate(-270deg) scale(0.5);
    }
    100% {
        transform: rotate(-360deg);
    }
}

@keyframes sk-cubemove-small {
    25% {
        transform: translateX(8px) rotate(-90deg) scale(0.5);
    }
    50% {
        transform: translateX(8px) translateY(8px) rotate(-179deg);
    }
    50.1% {
        transform: translateX(8px) translateY(8px) rotate(-180deg);
    }
    75% {
        transform: translateX(0px) translateY(8px) rotate(-270deg) scale(0.5);
    }
    100% {
        transform: rotate(-360deg);
    }
}

.fade-leave-to {
    display: none;
}
.fade-enter-active,
.fade-leave-active {
    transition: all 1s;
}
.fade-enter,
.fade-leave-active {
    opacity: 0;
}

.fadeup-leave-to {
    display: none;
}
.fadeup-enter-active,
.fadeup-leave-active {
    transition: all 0.4s;
}
.fadeup-enter,
.fadeup-leave-active {
    opacity: 0;
    transform: translateY(25px);
}
</style>
