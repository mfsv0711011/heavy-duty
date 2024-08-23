import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useProductInvoiceStore = defineStore('productInvoiceStore', () => {
    const state = reactive({
        productInvoices: {
            models: [],
            totalItems: 0
        },
        productInvoice: {
            id: null,
            product: {
                name: null,
                unit: {
                    name: null
                }
            },
            qty: null,
            recept: {
                name: null,
                volume: {
                    qty: null
                },
                materialRecepts: []
            },
            createdAt: null
        }
    })

    const fetchProductInvoices = async (filterProps = {}) => {
        let productInvoiceUrl = ''

        if (filterProps.name) {
            productInvoiceUrl += '&name=' + filterProps.name
        }

        if (filterProps.unit) {
            productInvoiceUrl += '&unit=' + filterProps.unit
        }

        if (filterProps.periodFrom) {
            productInvoiceUrl += '&from=' + filterProps.periodFrom;
        }

        if (filterProps.periodTo) {
            productInvoiceUrl += '&to=' + filterProps.periodTo;
        }

        await axios.get('/product_invoices?page=' + filterProps.page + productInvoiceUrl)
            .then(res => {
                state.productInvoices.models = res.data.productInvoices['hydra:member']
                state.productInvoices.totalItems = res.data.totalItems
            })
    }

    const fetchProductInvoice = async (id) => {
        await axios.get('/product_invoices/' + id).then(res => state.productInvoice = res.data)
    }

    const putProductInvoice = async (productInvoice) => {
        await axios.put('/product_invoices/' + productInvoice.id, productInvoice)
    }

    const pushProductInvoice = async (productInvoice) => {
        await axios.post('/product_invoices', productInvoice)
    }

    return {
        fetchProductInvoices,
        fetchProductInvoice,
        putProductInvoice,
        pushProductInvoice,
        getProductInvoices: computed(() => state.productInvoices),
        getProductInvoice: computed(() => state.productInvoice),
    }
})