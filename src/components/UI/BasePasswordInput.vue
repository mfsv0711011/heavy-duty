<template>
    <div>
        <div class="flex items-center justify-between">
            <label v-if="label" for="password" class="block text-sm font-medium leading-6 text-gray-900">{{label}}</label>
            <div v-if="isResetPasswordVisible" class="text-sm">
                <router-link :to="{name: 'forgot-password'}" class="font-semibold text-green-600 hover:text-baseGreen">{{ $t('forgotPassword') }}</router-link>
            </div>
        </div>
        <div class="mt-2 relative">
            <input
                @input="$emit('update:modelValue', $event.target.value)"
                :value="modelValue"
                id="password"
                name="password"
                :type="isVisible ? 'text' : 'password'"
                autocomplete="current-password"
                class="block w-full rounded-md border-0 py-3 text-blackText shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:leading-6"
            />
            <button
                type="button"
                @click="togglePassword"
                class="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3"
            >
                <svg v-if="!isVisible" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
            </button>
        </div>
        <p class="mt-2 text-sm text-red-500" id="email-error">{{errorMessage}}</p>
    </div>
</template>

<script setup>
import {ref} from "vue";

defineProps({
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number],
        required: true
    },
    errorMessage: {
        type: String,
        default: ''
    },
    isResetPasswordVisible: {
        type: Boolean,
        default: false
    }
})

const isVisible = ref(false)

const togglePassword = () => {
    isVisible.value = !isVisible.value
}
</script>

<style scoped>

</style>