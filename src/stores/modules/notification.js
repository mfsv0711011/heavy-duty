import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useNotificationStore = defineStore('notification', () => {
    const state = reactive({
        notifications: {
            models: [],
            totalItems: 0
        }
    })

    const fetchNotifications = async () => await axios.get('notifications')
        .then(res => {
            state.notifications.models = res.data['hydra:member']
            state.notifications.totalItems = res.data['hydra:totalItems']
        })

    const changeHasSeenNotification = async (id, data) => await axios.put('notifications/' + id, data)
    const changeHasSeenNotifications = async () => await axios.get('notifications/change-has-seen')

    return {
        fetchNotifications,
        changeHasSeenNotification,
        changeHasSeenNotifications,
        getNotifications: computed(() => state.notifications),
    }
})
