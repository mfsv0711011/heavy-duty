import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useMaterialInvoiceStore = defineStore('materialInvoiceStore', () => {
    const state = reactive({
        materialInvoices: {
            models: [],
            totalItems: 0
        },
        materialInvoice: {
            id: null,
            material: {
                name: null,
                unit: {
                    name: null
                }
            },
            qty: null,
            price: null,
            currency: {
                name: null
            },
            hasNds: null,
            ndsRate: null,
            additionalExpenses: [],
            provider: null,
            createdAt: null
        }
    })

    const fetchMaterialInvoices = async (filterProps = {}) => {
        let materialInvoiceUrl = ''

        if (filterProps.name) {
            materialInvoiceUrl += '&name=' + filterProps.name
        }

        if (filterProps.unit) {
            materialInvoiceUrl += '&unit=' + filterProps.unit
        }

        if (filterProps.periodFrom) {
            materialInvoiceUrl += '&from=' + filterProps.periodFrom;
        }

        if (filterProps.periodTo) {
            materialInvoiceUrl += '&to=' + filterProps.periodTo;
        }

        await axios.get('/material_invoices?page=' + filterProps.page + materialInvoiceUrl)
            .then(res => {
                state.materialInvoices.models = res.data.materialInvoices['hydra:member']
                state.materialInvoices.totalItems = res.data.totalItems
            })
    }

    const fetchMaterialInvoice = async (id) => {
        await axios.get('/material_invoices/' + id).then(res => state.materialInvoice = res.data)
    }

    const putMaterialInvoice = async (materialInvoice) => {
        await axios.put('/material_invoices/' + materialInvoice.id, materialInvoice)
    }

    const pushMaterialInvoice = async (invoice) => {
        await axios.post('/material_invoices', invoice)
    }

    return {
        getMaterialInvoices: computed(() => state.materialInvoices),
        getMaterialInvoice: computed(() => state.materialInvoice),
        fetchMaterialInvoices,
        fetchMaterialInvoice,
        putMaterialInvoice,
        pushMaterialInvoice
    }
})