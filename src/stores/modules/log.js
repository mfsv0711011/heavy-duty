import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import axios from "@/services/axios.js";

export const useLogStore = defineStore('logStore', () => {
    const state = reactive({
        logs: {
            models: [],
            totalItems: 0
        }
    })

    const fetchLogs = async (filterProps = {}) => {
        let logUrl = ''

        if (filterProps.department) {
            logUrl += '&department=' + filterProps.department
        }

        if (filterProps.type) {
            logUrl += '&type=' + filterProps.type
        }

        if (filterProps.periodFrom) {
            logUrl += '&from=' + filterProps.periodFrom;
        }

        if (filterProps.periodTo) {
            logUrl += '&to=' + filterProps.periodTo;
        }

        await axios.get('/logs?page=' + filterProps.page + logUrl).then(res => {
            state.logs.models = res.data['hydra:member']
            state.logs.totalItems = res.data['hydra:totalItems']
        })
    }

    return {
        fetchLogs,
        getLogs: computed(() => state.logs)
    }
})