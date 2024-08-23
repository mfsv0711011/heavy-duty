<template>
    <Transition name="loader">
        <div v-if="loaderStore.isLoading" class="fixed bg-white bg-opacity-40 w-full h-screen z-[100] flex items-center justify-center">
            <div class="bars"></div>
        </div>
    </Transition>
</template>

<script setup>
import {useLoaderStore} from "@/stores/loader.js";

const loaderStore = useLoaderStore()
</script>

<style scoped>
.bars {
    width: 50.4px;
    height: 44.8px;
    --c: linear-gradient(#22C55E 0 0);
    background: var(--c) 0%   50%,
    var(--c) 50%  50%,
    var(--c) 100% 50%;
    background-size: 10.1px 100%;
    background-repeat: no-repeat;
    animation: bars-t0lx83md 1s infinite linear;
}

@keyframes bars-t0lx83md {
    33% {
        background-size: 10.1px 10% ,10.1px 100%,10.1px 100%;
    }

    50% {
        background-size: 10.1px 100%,10.1px 10% ,10.1px 100%;
    }

    66% {
        background-size: 10.1px 100%,10.1px 100%,10.1px 10%;
    }
}

.loader-enter-active,
.loader-leave-active {
    transition: opacity 0.2s ease;
}

.loader-enter-from,
.loader-leave-to {
    opacity: 0;
}
</style>