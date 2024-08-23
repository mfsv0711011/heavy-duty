import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useVolumeStore = defineStore('volumeStore', () => {
    const state = reactive({
        volumes: {
            models: [],
            totalItems: 0
        }
    })

    const fetchVolumes = () => axios.get('/volumes')
        .then(res => {
            state.volumes.models = res.data['hydra:member']
            state.volumes.totalItems = res.data['hydra:totalItems']
        })

    return {
        fetchVolumes,
        getVolumes: computed(() => state.volumes),
    }
})