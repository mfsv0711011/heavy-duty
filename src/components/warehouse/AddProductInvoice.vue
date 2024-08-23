<template>
    <div>
        <XButton class="absolute top-4 md:top-6 right-4 md:right-6" @click="cancelAddProduct"/>
        <div class="font-semibold">
            {{ $t('productInvoice')}}
        </div>
        <div class="mt-6">
            <form class="flex flex-col gap-4 lg:gap-6">
                <BaseSelect
                    v-model="product"
                    :label="$t('products')"
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
                        @click="createProduct"
                        color="green"
                        :is-disable="isDisable"
                    >{{ $t('create') }}</BaseButton>
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
import {formatDate, formatTime} from "@/helpers/formatData.js";
import {getMask} from "@/helpers/maskCurrency.js";
import {useProductStore} from "@/stores/modules/product.js";
import {useProductInvoiceStore} from "@/stores/modules/productInvoice.js";
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
const isDisable = ref(false)
const date = ref(formatDate(new Date()))
const time = ref(formatTime(new Date()))

const validationSchema = object({
    product: string().required(t('empty')),
    qty: string().required(t('empty')),
    recept: string().required(t('empty')),
})

const {handleSubmit, errors} = useForm({
    validationSchema,
})

const {value: product} = useField('product')
const {value: qty} = useField('qty')
const {value: recept} = useField('recept')

const createProduct = handleSubmit(productInvoice => {
    isDisable.value = true
    productInvoice.qty = +productInvoice.qty.replaceAll(' ', '')
    productInvoice.createdAt = `${date.value}T${time.value}`
    const recept = receiptStore.getReceipts.models.find((recept) => recept['@id'] === productInvoice.recept)

    for (const materialRecept of recept.materialRecepts) {
        const materialExpense = (productInvoice.qty / recept.volume.qty) * materialRecept.qty

        if (materialExpense > materialRecept.material.qty) {
            isDisable.value = false
            return toast.error(t('notMaterials'))
        }
    }

    productInvoiceStore.pushProductInvoice(productInvoice)
        .then(() => {
            dialogStore.closeDialog()
            toast.success(t('successfullySaved'))
            notificationStore.fetchNotifications()
        })
        .catch(() => {
            toast.error(t('errorSave'))
            isLoading.value = false
        })
})

const cancelAddProduct = async () => {
    await dialogStore.closeDialog()
}

const {timeMask, dateMask} = useMaska()

onMounted(() => {
    productStore.fetchProductsAll()
})
</script>

<style scoped>

</style>