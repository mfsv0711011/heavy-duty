<template>
    <component :is="$route.meta.layout" />
</template>

<script setup>
import {onMounted} from "vue"
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/modules/user.js";
import {useNotificationStore} from "@/stores/modules/notification.js";

const { isAuthorized, getRefreshToken } = storeToRefs(useUserStore())
const { fetchAboutMe, refreshToken, clearToken } = useUserStore()
const notificationStore = useNotificationStore()

const router = useRouter()

onMounted(() => {
    if (isAuthorized.value) {
        fetchAboutMe()
            .catch(() => {
                refreshToken(getRefreshToken.value)
                    .then(() => location.reload())
                    .catch(() => {
                        clearToken()
                        router.push('/auth')
                    })
        })

        notificationStore.fetchNotifications()
    } else {
        router.push('/auth')
    }
})
</script>

<style>
</style>
