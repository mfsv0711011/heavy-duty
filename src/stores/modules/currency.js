import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useCurrencyStore = defineStore('currencyStore', () => {
    const state = reactive({
        currencies: {
            models: [],
            totalItems: 0
        }
    })

    const fetchCurrencies = async (filterProps = {}) => {
        await axios.get('/currencies?page=' + filterProps.page).then(res => {
            state.currencies.models = res.data['hydra:member']
            state.currencies.totalItems = res.data['hydra:totalItems']
        })
    }

    return {
        getCurrencies: computed(() => state.currencies),
        fetchCurrencies

    }
})