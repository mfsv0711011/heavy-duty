import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import axios from "@/services/axios.js";

export const useMaterialStore = defineStore('materialStore', () => {
    const state = reactive({
        materials: {
            models: [],
            totalItems: 0
        },
        materialsAll: {
            models: [],
            totalItems: 0
        },
        material: {
            id: null,
            name: null,
            unit: {
                name: null
            },
            delimit: null
        },
        isUnique: null,
    })

    const fetchMaterials = async (filterProps = {}) => {
        let materialUrl = ''

        if (filterProps.name) {
            materialUrl += '&name=' + filterProps.name
        }

        if (filterProps.unit) {
            materialUrl += '&unit=' + filterProps.unit
        }

        await axios.get('/materials?page=' + filterProps.page + materialUrl).then(res => {
            state.materials.models = res.data['hydra:member']
            state.materials.totalItems = res.data['hydra:totalItems']
        })
    }

    const fetchMaterialsAll = async () => {
        await axios.get('/materials/all?order%5Bid%5D=desc').then(res => {
            state.materialsAll.models = res.data['hydra:member']
            state.materialsAll.totalItems = res.data['hydra:totalItems']
        })
    }

    const fetchMaterial = async (id) => {
        await axios.get('/materials/' + id).then(res => state.material = res.data)
    }

    const fetchIsUniqueMaterial = (data) =>
        axios.post('/materials/is_unique', data)
            .then((res) => (state.isUnique = res.data.isUnique))

    const pushMaterial = async (material) => {
        await axios.post('/materials', material)
    }

    const putMaterial = async (material) => {
        await axios.put('/materials/' + material.id, material)
    }

    return {
        fetchMaterials,
        fetchMaterialsAll,
        pushMaterial,
        fetchMaterial,
        fetchIsUniqueMaterial,
        putMaterial,
        getMaterials: computed(() => state.materials),
        getMaterialsAll: computed(() => state.materialsAll),
        getMaterial: computed(() => state.material),
        getIsUniqueMaterial: computed(() => state.isUnique),
    }
})