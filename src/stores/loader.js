import {defineStore} from "pinia";
import {ref} from "vue";

export const useLoaderStore = defineStore('loaderStore', () => {
    const isLoading = ref(false)

    const showLoader = () => {
        isLoading.value = true
    }

    const hideLoader = () => {
        isLoading.value = false
    }

    return {
        isLoading,
        showLoader,
        hideLoader
    }
})