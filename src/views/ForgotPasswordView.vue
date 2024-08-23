<template>

    <div class="flex h-fit bg-white min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="/assets/heavy_cmyk_color%202.svg" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">Parolni tiklash</h2>
        </div>

        <div v-if="successSend" class="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
            <div class="text-sm">
                <p class="font-medium">
                    Parolni tiklash uchun havola elektron pochtangizga yuborildi. Havolani amal qilish muddati 10 daqiqa. Agar sizga xat bormagan bo'lsa, spam papkasini tekshiring yoki
                    <button @click="sendForm" class="font-semibold text-green-600 hover:text-green-500 cursor-pointer">qayta urinib ko'ring</button>.
                </p>
            </div>
        </div>

        <div v-else class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="sendForm" class="space-y-6">
                <BaseInput
                    label="Email"
                    type="email"
                    autocomplete="email"
                    v-model="email"
                    auto-focus
                />

                <div>
                    <BaseButton
                        type="submit"
                        color="green"
                        :is-disable="isDisable"
                    >Jo'natish</BaseButton>
                </div>
            </form>
            <BaseButton @click="back" class="mt-4 hover:opacity-75" color="bg-gray-400">Orqaga</BaseButton>
        </div>
    </div>
</template>


<script setup>
import {useUserStore} from "@/stores/modules/user.js";
import {useField, useForm} from "vee-validate";
import {string, object} from "yup";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {useToast} from 'vue-toastification'
import BaseButton from "@/components/UI/BaseButton.vue";

const userStore = useUserStore()
const isDisable = ref(false)
const successSend = ref(false)
const toast = useToast()
const router = useRouter()
const { t } = useI18n()
const email = ref('')

const sendForm = () => {
    isDisable.value = true
    userStore.fetchIsUniqueEmail({email: email.value})
        .then(() => {
            if (userStore.getIsUniqueEmail) {
                toast.error(t('notEmail'))
                isDisable.value = false
            } else {
                userStore.requestToResetPassword({email: email.value})
                    .then(() => {
                        successSend.value = true
                        toast.success('Xabar elektron pochtangizga yuborildi.')
                    })
            }
        })
}

const back = () => router.back()
</script>

<style scoped>

</style>
