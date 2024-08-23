<template>

    <div class="relative rounded-md">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
            type="text"
            name="inputField"
            id="inputField"
            class="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>

<script setup>

import {MagnifyingGlassIcon} from "@heroicons/vue/24/outline/index.js";

defineProps({
    placeholder: {
        type: String,
        default: 'Search'
    },
    modelValue: {
        type: [String, Number],
        default: ''
    },
})
</script>

<style scoped>

</style>