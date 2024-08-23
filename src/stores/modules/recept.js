import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useReceiptStore = defineStore('receiptStore', () => {
    const state = reactive({
        receipts: {
            models: [],
            totalItems: 0
        },
        receipt: {
            id: null,
            name: null,
            product: null,
            volume: null,
            materialRecepts: []
        }
    })

    const fetchReceipts = async (filterProps = {}) => {
        let receiptUrl = ''

        if (filterProps.name) {
            receiptUrl += '&name=' + filterProps.name
        }

        if (filterProps.product) {
            receiptUrl += '&product=' + filterProps.product
        }

        await axios.get('/recepts?page=' + filterProps.page + receiptUrl).then(res => {
            state.receipts.models = res.data.recepts['hydra:member']
            state.receipts.totalItems = res.data.totalItems
        })
    }

    const fetchReceipt =  (receiptId) => axios.get('/recepts/' + receiptId)
        .then((res) => state.receipt = res.data)

    const pushReceipt = async (receipt) => {
        await axios.post('/recepts', receipt)
    }
    const putReceipt = async (receipt) => {
        await axios.put('/recepts/' + receipt.id, receipt)
    }

    const putMaterialRecepts = async (receipt) => {
        await axios.put('/recepts/material_recepts/' + receipt.id, receipt)
    }

    return {
        fetchReceipts,
        fetchReceipt,
        pushReceipt,
        putReceipt,
        putMaterialRecepts,
        getReceipts: computed(() => state.receipts),
        getReceipt: computed(() => state.receipt),
    }
})