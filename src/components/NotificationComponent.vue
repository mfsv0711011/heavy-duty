<template>
    <div class="border-b overflow-hidden border-gray-300 bg-white rounded-lg w-full h-[400px] gap-4 flex flex-col">
        <div class="relative h-full bg-white">
            <transition name="all">
                <div v-if="notificationStore.getNotifications.totalItems" id="notification" class="px-4 overflow-y-auto h-[calc(100%_-_40px)] py-2">
                    <transition-group name="list" tag="div" class="overflow-hidden">
                        <div
                            v-for="notification of notificationStore.getNotifications.models"
                            :key="notification.id"
                            class="flex justify-between items-center border-b border-gray-300 py-1"
                        >
                            <div class="flex justify-between items-center w-full">
                                <div class="flex flex-col justify-center">
                                    <p class="text-[10px] text-gray-500">{{ formatDateWithTime(notification.createdAt) }}</p>
                                    <h3  class="text-xs font-medium leading-6 text-gray-900 whitespace-break-spaces text-start">
                                        {{ notification.name }} <b>{{ notification.qty }} {{ $t(notification.unit.name) }}</b> {{ $t('left') }}
                                    </h3>
                                </div>
                                <div class="w-11 h-full">
                                    <button @click="see(notification.id)" class="ml-auto text-white h-8 flex items-center bg-green-500 hover:bg-green-600 transition-all px-2 rounded-lg justify-center">
                                        <SpinnerLoader v-if="isLoading && notification.id === activeNotificationId"/>
                                        <span v-else>OK</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </div>
                <div class="h-full flex items-center justify-center text-sm" v-else>{{ $t('emptyNotification') }}</div>
            </transition>
            <button @click="seeAll" class="bg-green-500 flex justify-center items-center w-full h-10 mt-auto text-white hover:bg-green-600">
                <SpinnerLoader v-if="isLoadingForAll"/>
                <span class="w-full text-center" v-else>{{ $t('hasSeen') }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";
import {useNotificationStore} from "@/stores/modules/notification.js";
import SpinnerLoader from "@/components/UI/SpinnerLoader.vue";
import {formatDateWithTime} from "../helpers/formatData.js";

const isLoading = ref(false);
const isLoadingForAll = ref(false);
const activeNotificationId = ref(null);
const notificationStore = useNotificationStore()

const see = notificationId => {
    activeNotificationId.value = notificationId;
    isLoading.value = true;

    notificationStore.changeHasSeenNotification(notificationId, { hasSeen: true })
        .then(() => {
            notificationStore.fetchNotifications()
        })
        .finally(() => {
            isLoading.value = false;
        })
}
const seeAll = notificationId => {
    isLoadingForAll.value = true
    notificationStore.changeHasSeenNotifications()
        .then(() => {
            notificationStore.fetchNotifications()
        })
        .finally(() => {
            isLoadingForAll.value = false
        })
}


</script>

<style scoped>
#notification::-webkit-scrollbar-track {
    transition: all 0.3s ease;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50px;
    background: #fff;
}

#notification::-webkit-scrollbar {
    width: 0.3rem;
    height: 0.3rem;
}

#notification::-webkit-scrollbar {
    width: 0.3rem;
}

#notification::-webkit-scrollbar-thumb {
    background-color: #a3b2bd;
    border-radius: 50px;
    cursor: pointer;
}

#notification::-webkit-scrollbar-thumb:hover {
    background-color: #a3b2bddd;
}
#notification::selection {
    background: #535461;
    color: #fff;
}
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
.all-enter-active,
.all-leave-active {
    transition: all 0.5s ease;
}
.all-enter-from,
.all-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>