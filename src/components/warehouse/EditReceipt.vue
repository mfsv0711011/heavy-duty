<template>
    <div class="h-fit">
        <XButton class="absolute top-4 md:top-6 right-4 md:right-6" @click="cancelAddMaterial"/>
        <div class="font-semibold">
            {{ $t('editReceipt')}}
        </div>
        <div class="mt-6">
            <form class="flex flex-col gap-4 lg:gap-6">
                <BaseInput
                    v-model="name"
                    :label="$t('name')"
                    :error-message="errors.name"
                />
                <BaseSelect
                    v-model="product"
                    :label="$t('product')"
                    :options="productStore.getProductsAll.models"
                    :error-message="errors.product"
                />
                <BaseSelect
                    v-model="volume"
                    :label="$t('volume')"
                    :options="volumes"
                    :error-message="errors.volume"
                />
                <div class="flex flex-col gap-4 lg:gap-6">
                    <TransitionGroup name="inputList">
                        <div
                            v-for="(expense, index) in materialRecepts.length"
                            :key="index"
                            class="flex flex-col md:flex-row gap-4 lg:gap-6 items-end"
                        >
                            <BaseSelect
                                :label="$t('material') + ' ' + (index + 1)"
                                v-model="materialRecepts[index].material"
                                :options="materialStore.getMaterialsAll.models"
                                class="w-full"
                            />
                            <BaseInput
                                :label="$t('amount') + ' ' + (index + 1)"
                                :placeholder="$t('amount')"
                                v-model.number="materialRecepts[index].qty"
                                class="w-full md:max-w-[150px]"
                                type="number"
                            />
                        </div>
                    </TransitionGroup>
                </div>

                <div class="flex justify-end gap-4 mt-4">
                    <button @click.prevent="" class="bg-red-500 hover:bg-red-600 p-3 text-white rounded-full">
                        <MinusIcon @click.prevent="removeMaterialRecepts" class="size-5 font-semibold"/>
                    </button>
                    <button @click.prevent="addMaterialRecepts" class="bg-green-500 hover:bg-green-600 p-3 text-white rounded-full">
                        <PlusIcon class="size-5 font-semibold"/>
                    </button>
                </div>

                <div class="flex flex-col md:flex-row gap-4 lg:gap-6 mt-6 mb-10">
                    <BaseButton
                        @click="editReceipt"
                        color="green"
                        :is-disable="isDisable"
                    >{{ $t('save') }}</BaseButton>
                    <BaseButton type="button" @click="cancelAddMaterial" class="md:order-first" color="red">{{ $t('cancel') }}</BaseButton>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import {useDialogStore} from "@/stores/dialog.js";
import {Form, useField, useForm} from "vee-validate";
import BaseInput from "@/components/UI/BaseInput.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import XButton from "@/components/XButton.vue";
import {useI18n} from "vue-i18n";
import {object, string} from "yup";
import {useMaterialStore} from "@/stores/modules/material.js";
import {useToast} from "vue-toastification";
import {computed, onMounted, ref} from "vue";
import {useProductStore} from "@/stores/modules/product.js";
import {useVolumeStore} from "@/stores/modules/volume.js";
import BaseSelect from "@/components/UI/BaseSelect.vue";
import {useReceiptStore} from "@/stores/modules/recept.js";
import {useMaterialReceptStore} from "@/stores/modules/materialReceipt.js";
import {MinusIcon, PlusIcon} from "@heroicons/vue/24/outline/index.js";

const materialStore = useMaterialStore()
const materialReceptStore = useMaterialReceptStore()
const receiptStore = useReceiptStore()
const volumeStore = useVolumeStore()
const productStore = useProductStore()
const dialogStore = useDialogStore()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)
const isDisable = ref(false)

const validationSchema = object({
    name: string().required(t('empty')).max(50, t('maxStrValue') + ' 50'),
    product: string().required(t('empty')),
    volume: string().required(t('empty'))
})

const {handleSubmit, errors} = useForm({
    validationSchema
})

const {value: name} = useField('name')
const {value: product} = useField('product')
const {value: volume} = useField('volume')

const editReceipt = handleSubmit(async receipt => {
    const recept = receiptStore.getReceipt

    const receiptData = {
        id: recept.id
    }

    if (name.value !== recept.name) {
        receiptData.name = receipt.name
    }

    if (product.value !== recept.product['@id']) {
        receiptData.product = receipt.product
    }

    if (volume.value !== recept.volume['@id']) {
        receiptData.volume = receipt.volume
    }

    let changedMaterialRecept = false

    for (let i = 0; i < recept.materialRecepts.length; i++) {
        const deleteItem = materialRecepts.value.find((material) => material.id === recept.materialRecepts[i].id)

        if (deleteItem) {
            if (
                materialRecepts.value[i].material !== recept.materialRecepts[i].material['@id'] ||
                materialRecepts.value[i].qty !== recept.materialRecepts[i].qty
            ) {
                await materialReceptStore.putMaterialRecept(materialRecepts.value[i])
                changedMaterialRecept = true
            }
        } else {
            await materialReceptStore.deleteMaterialRecept(recept.materialRecepts[i].id)
            changedMaterialRecept = true
        }
    }

    for (let i = 0; i < materialRecepts.value.length; i++) {
        if (materialRecepts.value[i].material && materialRecepts.value[i].qty && !materialRecepts.value[i].id) {
            await materialReceptStore.postMaterialRecept({
                recept: recept['@id'],
                material: materialRecepts.value[i].material,
                qty: materialRecepts.value[i].qty
            })

            changedMaterialRecept = true
        }
    }

    if (Object.keys(receiptData).length > 1 || changedMaterialRecept) {
        isLoading.value = true
        receiptStore.putReceipt(receiptData)
            .then(() => {
                dialogStore.closeDialog()
                receiptStore.fetchReceipts({page: 1})
                toast.success(t('successfullySaved'))
            })
            .catch(() => {
                toast.error(t('errorSave'))
                isLoading.value = false
            })
    }
})

const cancelAddMaterial = async () => {
    await dialogStore.closeDialog()
}

const volumes = computed(() => [...volumeStore.getVolumes.models].map(volume => {
    volume.name = volume.qty;
    return volume
}))

const materialRecepts = ref([
    {material: '', qty: null },
])

const addMaterialRecepts = () => {
    materialRecepts.value.push({material: '', qty: null })
}

const removeMaterialRecepts = () => {
    if (materialRecepts.value.length > 1) {
        materialRecepts.value.pop();
    }
}

onMounted(async () => {
    await productStore.fetchProductsAll()
    await materialStore.fetchMaterialsAll()
    const recept = receiptStore.getReceipt
    name.value = recept.name
    product.value = recept.product['@id']
    volume.value = recept.volume['@id']

    materialRecepts.value = receiptStore.getReceipt.materialRecepts.map(materialRecept => {
        return {
            id: materialRecept.id,
            material: materialRecept.material['@id'],
            qty: materialRecept.qty
        }
    })
})
</script>

<style scoped>

.inputList-enter-active,
.inputList-leave-active {
    transition: all 0.3s ease;
}
.inputList-enter-from,
.inputList-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>