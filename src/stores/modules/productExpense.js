import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useProductExpenseStore = defineStore('productExpenseStore', () => {
    const state = reactive({
        productExpenses: {
            models: [],
            totalItems: 0
        },
        productExpense: {
            id: null,
            product: {
                name: null,
                unit: {
                    name: null
                }
            },
            qty: null,
            customer: null,
            sum: null,
            currency: {
                id: null,
                name: null
            },
            createdAt: null
        }
    })

    const fetchProductExpenses = async (filterProps = {}) => {
        let productExpenseUrl = ''

        if (filterProps.name) {
            productExpenseUrl += '&name=' + filterProps.name
        }

        if (filterProps.unit) {
            productExpenseUrl += '&unit=' + filterProps.unit
        }

        if (filterProps.periodFrom) {
            productExpenseUrl += '&from=' + filterProps.periodFrom;
        }

        if (filterProps.periodTo) {
            productExpenseUrl += '&to=' + filterProps.periodTo;
        }

        await axios.get('/product_expenses?page=' + filterProps.page + productExpenseUrl)
            .then(res => {
                state.productExpenses.models = res.data['hydra:member']
                state.productExpenses.totalItems = res.data['hydra:totalItems']
            })
    }

    const fetchProductExpense = async (id) => {
        await axios.get('/product_expenses/' + id).then(res => state.productExpense = res.data)
    }

    const putProductExpense = async (productExpense) => {
        await axios.put('/product_expenses/' + productExpense.id, productExpense)
    }

    const pushProductExpense = async (productExpense) => {
        await axios.post('/product_expenses', productExpense)
    }

    return {
        fetchProductExpenses,
        fetchProductExpense,
        putProductExpense,
        pushProductExpense,
        getProductExpenses: computed(() => state.productExpenses),
        getProductExpense: computed(() => state.productExpense),
    }
})