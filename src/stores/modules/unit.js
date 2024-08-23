import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useUnitStore = defineStore('unitStore', () => {
    const state = reactive({
        units: {
            models: [],
            totalItems: 0
        }
    })

    const fetchUnits = async () => {
        await axios.get('/units')
            .then(res => state.units.models = res.data['hydra:member'])
    }

    return {
        fetchUnits,
        getUnits: computed(() => state.units),
    }
})