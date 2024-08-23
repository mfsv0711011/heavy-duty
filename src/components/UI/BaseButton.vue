<template>
    <button
        :disabled="isDisable || isLoading"
        class="flex gap-1 w-full justify-center whitespace-nowrap rounded-md px-4 py-3 font-medium leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        :class="[isDisable || isLoading ? 'opacity-75 cursor-not-allowed' : `${color}`, `${color}`]"
    >

        <slot></slot>
        <CircleOutline v-if="isLoading" class="animate-spin fill-white"/>
    </button>
</template>

<script setup>
import CircleOutline from "@/icons/CircleOutline.vue";

defineProps({
    isDisable: {
        type: Boolean,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: 'green'
    }
})
</script>

<style scoped>
.green {
    background-color: rgb(34, 197, 94);
}
.green:hover {
    background-color: rgb(22 163 74);
}
.green:focus-visible {
    outline: rgb(22, 163, 74);
}
.red {
    background-color: rgb(239, 68, 68);
}
.red:hover {
    background-color: rgb(220 38 38);
}
.red:focus-visible {
    outline: rgb(220, 38, 38);
}
.white {
    background-color: white;
    color: #222;
    box-shadow: inset 0 0 0 1px #D1D5DB;
 }
.white:hover {
    background-color: rgb(249, 250, 251);
}
</style>