import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import axios from "@/services/axios.js";

export const useCurrencyRateStore = defineStore('currencyRateStore', () => {
    const state = reactive({
        currencyRate: {
            id: null,
            usdToUzs: null
        }
    })

    const fetchCurrencyRate = async () => {
        await axios.get('/currency_rates' ).then(res => {
            state.currencyRate = res.data
        })
    }

    return {
        getCurrencyRate: computed(() => state.currencyRate),
        fetchCurrencyRate
    }
})