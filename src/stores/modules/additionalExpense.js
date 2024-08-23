import {defineStore} from "pinia";
import axios from "@/services/axios.js";

export const useAdditionalExpenseStore = defineStore('additionalExpenseStore', () => {

    const putAdditionalExpense = async (additionalExpense) => {
        await axios.put('/additional_expenses/' + additionalExpense.id, additionalExpense)
    }

    return {
        putAdditionalExpense,
    }
})