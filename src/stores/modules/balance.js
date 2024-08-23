import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useBalanceStore = defineStore('balance', () => {
    const state = reactive({
        balance: null
    })

    const fetchBalance = async () => await axios.get('/balances')
        .then(res => state.balance = res.data['hydra:member'][0])

    return {
        fetchBalance,
        getBalance: computed(() => state.balance),
    }
})
