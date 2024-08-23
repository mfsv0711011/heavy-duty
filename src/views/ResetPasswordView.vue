<template>
    <div class="flex h-fit bg-white min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="/assets/heavy_cmyk_color%202.svg" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">Parolni tiklash</h2>
        </div>

        <div v-if="userStore.isAvailableResetToken"  class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="sendPassword" class="space-y-6">
                <BasePasswordInput
                    label="Yangi parol"
                    v-model="password"
                />

                <BasePasswordInput
                    label="Parolni takrorlang"
                    v-model="rePassword"
                />

                <div>
                    <BaseButton
                        @click="sendPassword"
                        color="green"
                        :is-disable="rePassword !== password"
                        :is-loading="isDisable"
                    >Kirish</BaseButton>
                </div>
            </form>
        </div>

        <div v-else class="flex justify-center items-center mt-4">
            <p class="font-medium">
                Ushbu havola allaqachon ishlatilgan yoki muddati tugagan.
                <router-link :to="{name: 'forgot-password'}" class="font-semibold text-green-600 hover:text-green-500">Qayta urinib ko'ring</router-link>
            </p>
        </div>
    </div>
</template>


<script setup>
import {useUserStore} from "@/stores/modules/user.js";
import {useField, useForm} from "vee-validate";
import {string, object} from "yup";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {useToast} from 'vue-toastification'
import BasePasswordInput from "@/components/UI/BasePasswordInput.vue";
import router from "@/router/index.js";

const props = defineProps({
    resetToken: {
        type: String,
        required: true
    }
})

const userStore = useUserStore()
const isDisable = ref(false)
const rePassword = ref('')
const password = ref('')
const toast = useToast()
const { t } = useI18n()

const sendPassword = () => {
    isDisable.value = true
    userStore.resetPassword({
        newPassword: password.value,
        resetToken: props.resetToken,
    })
        .then((res) => {
            userStore.fetchToken({
                email: res.data.email,
                password: password.value,
            })
                .then(() => {
                    router.replace({name: 'home'})
                    toast.success(t('successAuth'))
                })
                .catch(() => {
                    toast.error(t('errorPassword'))
                })
                .finally(() => {
                    isDisable.value = false
                })
        })
}

onMounted(() => {
    userStore.checkResetToken({resetToken: props.resetToken})
})
</script>

<style scoped>

</style>
