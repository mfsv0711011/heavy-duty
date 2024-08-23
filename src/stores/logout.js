import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user.js'

export const useLogoutStore = defineStore('logoutStore', () => {

    const {clearToken} = useUserStore()

    const isLogoutDialogOpen = ref(false)
    const isLoading = ref(false)

    const openLogoutDialog = () => {
        isLogoutDialogOpen.value = true
    }

    const closeLogoutDialog = () => {
        isLogoutDialogOpen.value = false
    }

    const logout = async () => {
        isLoading.value = true
        await clearToken()
        await location.reload()
        isLogoutDialogOpen.value = false
        isLoading.value = false
    }

    return {
        isLogoutDialogOpen,
        isLoading,
        openLogoutDialog,
        closeLogoutDialog,
        logout
    }
})