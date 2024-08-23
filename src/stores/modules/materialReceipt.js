import {defineStore} from "pinia";
import axios from "@/services/axios.js";
import {computed, reactive} from "vue";

export const useMaterialReceptStore = defineStore('materialReceptStore', () => {
    const state = reactive({
        materialRecept: {
            id: null,
            material: null,
            qty: null
        },
    })

    const postMaterialRecept = async (materialRecept) => {
        await axios.post('/material_recepts', materialRecept)
            .then((res) => state.materialRecept = res.data)
    }

    const putMaterialRecept = async (materialRecept) => {
        await axios.put('/material_recepts/' + materialRecept.id, materialRecept)
    }

    const deleteMaterialRecept = async (id) => {
        await axios.delete('/material_recepts/' + id)
    }

    return {
        postMaterialRecept,
        putMaterialRecept,
        deleteMaterialRecept,
        getMaterialRecept: computed(() => state.materialRecept),
    }
})