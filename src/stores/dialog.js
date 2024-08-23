import {defineStore} from "pinia";
import {ref} from "vue";

export const useDialogStore = defineStore('dialogStore', () => {
    const isOpenDialog = ref(false)
    const selectedComponent = ref('')

    const openDialog = (componentName) => {
        selectedComponent.value = componentName
        isOpenDialog.value = true
    }
    const closeDialog = () => {
        isOpenDialog.value = false
    }

    return {
        selectedComponent,
        isOpenDialog,
        openDialog,
        closeDialog
    }
})