<template>
    <div class="h-fit">
        <XButton class="absolute top-4 md:top-6 right-4 md:right-6" @click="cancelAddMaterial"/>
        <div class="font-semibold">
            {{ $t('addReceipt')}}
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
                                v-model.number="materialRecepts[index].qty"
                                :label="$t('amount') + ' ' + (index + 1)"
                                :placeholder="$t('amount')"
                                class="w-full md:max-w-[150px]"
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
                        @click="createReceipt"
                        color="green"
                        :is-disable="isDisable"
                    >{{ $t('create') }}</BaseButton>
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
import {MinusIcon, PlusIcon} from "@heroicons/vue/24/outline/index.js";
import {useReceiptStore} from "@/stores/modules/recept.js";
import {formatCurrency} from "@/helpers/formatData.js";

const materialStore = useMaterialStore()
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

const createReceipt = handleSubmit(receipt => {
    isLoading.value = true
    materialRecepts.value = materialRecepts.value.filter(materialRecept => materialRecept.material && materialRecept.qty)

    if (materialRecepts.value.length) {
        receipt.materialRecepts = materialRecepts.value
    } else {
        return toast.error(t('empty'))
    }

    receiptStore.pushReceipt(receipt)
        .then(() => {
            dialogStore.closeDialog()
            toast.success(t('successfullySaved'))
        })
        .catch(() => {
            toast.error(t('errorSave'))
            isLoading.value = false
        })
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

onMounted(() => {
    productStore.fetchProductsAll()
    materialStore.fetchMaterialsAll()
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