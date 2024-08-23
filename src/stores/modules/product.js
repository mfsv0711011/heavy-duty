import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useProductStore = defineStore('productStore', () => {
    const state = reactive({
        products: {
            models: [],
            totalItems: 0
        },
        productsAll: {
            models: [],
            totalItems: 0
        },
        product: {
            id: null,
            name: null,
            unit: {
                name: null
            },
            delimit: null
        },
        isUnique: null,
    })

    const fetchProducts = async (filterProps = {}) => {
        let productUrl = ''

        if (filterProps.name) {
            productUrl += '&name=' + filterProps.name
        }

        if (filterProps.unit) {
            productUrl += '&unit=' + filterProps.unit
        }

        await axios.get('/products?page=' + filterProps.page + productUrl)
            .then(res => {
                state.products.models = res.data['hydra:member']
                state.products.totalItems = res.data['hydra:totalItems']
            })
    }

    const fetchProductsAll = async () => {
        await axios.get('/products/all?order%5Bid%5D=desc')
            .then(res => {
                state.productsAll.models = res.data['hydra:member']
                state.productsAll.totalItems = res.data['hydra:totalItems']
            })
    }

    const fetchProduct = async (id) => {
        await axios.get('/products/' + id).then(res => state.product = res.data)
    }

    const fetchIsUniqueProduct = (data) =>
        axios.post('/products/is_unique', data).then((res) => (state.isUnique = res.data.isUnique))

    const pushProduct = async (product) => {
        await axios.post('/products', product)
    }

    const putProduct = async (product) => {
        await axios.put('/products/' + product.id, product)
    }

    return {
        fetchProducts,
        fetchProductsAll,
        fetchProduct,
        fetchIsUniqueProduct,
        pushProduct,
        putProduct,
        getProducts: computed(() => state.products),
        getProductsAll: computed(() => state.productsAll),
        getProduct: computed(() => state.product),
        getIsUniqueProduct: computed(() => state.isUnique),
    }
})