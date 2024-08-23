<template>
    <div>
        <XButton class="absolute top-4 md:top-6 right-4 md:right-6" @click="cancelAddProduct"/>
        <div class="font-semibold">
            {{ $t('changeInvoice')}}
        </div>
        <div class="mt-6">
            <form class="flex flex-col gap-4 lg:gap-6">
                <BaseSelect
                    v-model="product"
                    :label="$t('product')"
                    :options="productStore.getProductsAll.models"
                    :error-message="errors.material"
                />
                <div class="flex flex-col md:flex-row gap-4 lg:gap-6">
                    <BaseSelect
                        v-model="recept"
                        :label="$t('receipts')"
                        :options="receiptStore.getReceipts.models"
                        :error-message="errors.recept"
                        class="w-full"
                    />
                    <BaseInput
                        v-model="qty"
                        :label="$t('amount')"
                        :error-message="errors.qty"
                        class="w-full"
                    />
                </div>

                <div class="flex flex-col sm:flex-row gap-4 lg:gap-6">
                    <BaseDatePicker
                        v-model="date"
                        :label="$t('date')"
                        v-maska="dateMask"
                    />
                    <BaseInput
                        v-model="time"
                        :label="$t('time')"
                        v-maska="timeMask"
                    />
                </div>

                <div class="flex flex-col md:flex-row gap-4 lg:gap-6 mt-6">
                    <BaseButton
                        @click="editProductInvoice"
                        color="green"
                        :is-loading="isLoading"
                    >{{ $t('save') }}</BaseButton>
                    <BaseButton type="button" @click="cancelAddProduct" class="md:order-first" color="red">{{ $t('cancel') }}</BaseButton>
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
import BaseSelect from "@/components/UI/BaseSelect.vue";

import {useI18n} from "vue-i18n";
import {object, string} from "yup";
import {useToast} from "vue-toastification";
import {onMounted, reactive, ref, watch} from "vue";
import BaseDatePicker from "@/components/UI/BaseDatePicker.vue";
import {formatCurrency, formatDate, formatTime} from "@/helpers/formatData.js";
import {getMask} from "@/helpers/maskCurrency.js";
import {useProductInvoiceStore} from "@/stores/modules/productInvoice.js";
import {useProductStore} from "@/stores/modules/product.js";
import {useReceiptStore} from "@/stores/modules/recept.js";
import {useNotificationStore} from "@/stores/modules/notification.js";
import useMaska from "@/composable/useMaska.js";

const productStore = useProductStore()
const productInvoiceStore = useProductInvoiceStore()
const notificationStore = useNotificationStore()
const dialogStore = useDialogStore()
const receiptStore = useReceiptStore()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)
const materialQty = ref(0)
const date = ref(formatDate(new Date()))
const time = ref(formatTime(new Date()))

const validationSchema = object({
    product: string().required(t('empty')),
    qty: string().required(t('empty')),
    recept: string().required(t('empty'))
})

const {handleSubmit, errors} = useForm({
    validationSchema
})

const {value: product} = useField('product')
const {value: qty} = useField('qty')
const {value: recept} = useField('recept')

const editProductInvoice = handleSubmit(productInvoice => {
    const invoice = productInvoiceStore.getProductInvoice

    const productInvoiceData = {
        id: invoice.id
    }

    if (product.value !== invoice.product['@id']) {
        productInvoiceData.product = productInvoice.product
    }

    if (+qty.value.replaceAll(' ', '') !== invoice.qty) {
        for (let i = 0; i < invoice.recept.materialRecepts.length; i++) {
            const materialExpense = (invoice.qty / invoice.recept.volume.qty) * invoice.recept.materialRecepts[i].qty
            materialQty.value = invoice.recept.materialRecepts[i].material.qty + materialExpense;

            if (recept.value === invoice.recept['@id']) {
                const newMaterialExpense = (+qty.value.replaceAll(' ', '') / invoice.recept.volume.qty) * invoice.recept.materialRecepts[i].qty

                if (newMaterialExpense > materialQty.value) {
                    return toast.error(t('notMaterials'))
                }
            }
        }

        productInvoiceData.qty = +productInvoice.qty.replaceAll(' ', '')
    }

    if (recept.value !== invoice.recept['@id']) {
        const recept = receiptStore.getReceipts.models.find((recept) => recept['@id'] === productInvoice.recept)

        for (let i = 0; i < recept.materialRecepts.length; i++) {
            const materialExpense = (invoice.qty / invoice.recept.volume.qty) * invoice.recept.materialRecepts[i].qty
            materialQty.value = invoice.recept.materialRecepts[i].material.qty + materialExpense;
            let newMaterialExpense = (invoice.qty / recept.volume.qty) * recept.materialRecepts[i].qty

            if (productInvoiceData.qty) {
                newMaterialExpense = (productInvoiceData.qty / recept.volume.qty) * recept.materialRecepts[i].qty
            }

            if (newMaterialExpense > materialQty.value) {
                return toast.error(t('notMaterials'))
            }
        }

        productInvoiceData.recept = productInvoice.recept
    }

    if (date.value !== formatDate(invoice.createdAt) || time.value !== formatTime(invoice.createdAt)) {
        productInvoiceData.createdAt = `${date.value}T${time.value}`
    }

    if (Object.keys(productInvoiceData).length > 1) {
        isLoading.value = true
        productInvoiceStore.putProductInvoice(productInvoiceData)
            .then(() => {
                dialogStore.closeDialog()
                toast.success(t('successfullySaved'))
                notificationStore.fetchNotifications()
            })
            .catch(() => {
                toast.error(t('errorSave'))
                isLoading.value = false
            })
    }
})

const cancelAddProduct = async () => {
    await dialogStore.closeDialog()
}

const {timeMask, dateMask} = useMaska()

onMounted(async () => {
    await productStore.fetchProductsAll()
    const invoice = productInvoiceStore.getProductInvoice

    product.value = invoice.product['@id']
    qty.value = formatCurrency(invoice.qty)
    recept.value = invoice.recept['@id']
    date.value = formatDate(invoice.createdAt)
    time.value = formatTime(invoice.createdAt)
})
</script>

<style scoped>

</style>