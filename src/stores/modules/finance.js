import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useFinanceStore = defineStore('finance', () => {
    const state = reactive({
        finances: {
            models: [],
            totalItems: 0,
            totalUzs: 0,
            totalUsd: 0
        },
        finance: {
            name: null,
            sum: null,
            currency: {
                id: null,
                name: null
            },
            isIncome: null,
            createdAt: null
        }
    })

    const fetchFinances = async (filterProps = {}) => {
        let financeUrl = ''

        if (filterProps.name) {
            financeUrl += '&name=' + filterProps.name
        }

        if (filterProps.isIncome) {
            financeUrl += '&is-income=' + filterProps.isIncome
        }

        if (filterProps.currency) {
            financeUrl += '&currency=' + filterProps.currency
        }

        if (filterProps.periodFrom) {
            financeUrl += '&from=' + filterProps.periodFrom;
        }

        if (filterProps.periodTo) {
            financeUrl += '&to=' + filterProps.periodTo;
        }

        await axios.get('/finances?page=' + filterProps.page + financeUrl)
            .then(res => {
                state.finances.models = res.data['hydra:member']
                state.finances.totalItems = res.data['hydra:totalItems']
                state.finances.totalUzs = res.data.totalUzs
                state.finances.totalUsd = res.data.totalUsd

            })
    }

    const fetchFinance = async (id) => await axios.get(`/finances/${id}`)
        .then(res => state.finance = res.data)
    const editFinance = async (data) => await axios.put(`/finances/${data.id}`, data)
    const pushFinance = async (data) => await axios.post(`/finances`, data)

    return {
        fetchFinances,
        fetchFinance,
        editFinance,
        pushFinance,
        getFinances: computed(() => state.finances),
        getFinance: computed(() => state.finance),
    }
})
