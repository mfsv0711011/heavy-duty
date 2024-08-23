<template>
    <div class="flex h-fit bg-white min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="/assets/heavy_cmyk_color%202.svg" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">{{ $t('signIn') }}</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="sendForm" class="space-y-6">
                <BaseInput
                    :label="$t('email')"
                    type="email"
                    autocomplete="email"
                    v-model="email"
                    auto-focus
                    :error-message="errors.email"
                />

                <BasePasswordInput
                    :label="$t('password')"
                    v-model="password"
                    :error-message="errors.password"
                    is-reset-password-visible
                />

                <div>
                    <BaseButton
                        type="submit"
                        color="green"
                        :is-loading="isLoading"
                    >{{ $t('signIn') }}</BaseButton>
                </div>
            </form>
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

const userStore = useUserStore()
const router = useRouter()
const isLoading = ref(false)
const toast = useToast()
const { t } = useI18n()

const validationSchema = object({
    email: string().required(t('empty')),
    password: string().required(t('empty'))
})

const {handleSubmit, errors} = useForm({
    validationSchema,
    initialValues: {
        email: '',
        password: ''
    }
})

const {value: email} = useField('email')
const {value: password} = useField('password')

const sendForm = handleSubmit(user => {
    isLoading.value = true
    userStore.fetchIsUniqueEmail({email: user.email})
        .then(() => {
            if (userStore.getIsUniqueEmail) {
                toast.error(t('notEmail'))
                isLoading.value = false
            } else {
                userStore.fetchToken(user)
                    .then(() => {
                        userStore.fetchAboutMe()
                        router.replace({name: 'home'})
                        toast.success(t('successAuth'))
                    })
                    .catch(() => {
                        toast.error(t('errorPassword'))
                        isLoading.value = false
                    })
            }
        })
        .catch(() => {
            toast.error(t('notEmail'))
            isLoading.value = false
        })
})
</script>

<style scoped>

</style>
