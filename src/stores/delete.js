import {defineStore} from "pinia";
import axios from "@/services/axios.js";
import {ref} from "vue";

export const useDeleteStore = defineStore('deleteStore', () => {

    const route = ref('')
    const id = ref('')
    const isOpenDialog = ref(false)

    const openDialog = (routeValue, idValue) => {
        route.value = routeValue
        id.value = idValue
        isOpenDialog.value = true
    }

    const closeDialog = () => {
        isOpenDialog.value = false
    }

    const deleteData = async () => {
        await axios.delete('/' + route.value + '/' + id.value)
    }

    return {
        openDialog,
        deleteData,
        closeDialog,
        isOpenDialog
    }
})