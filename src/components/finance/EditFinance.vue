<template>
    <div>
        <XButton class="absolute top-4 md:top-6 right-4 md:right-6" @click="cancel"/>
        <div class="font-semibold">
            {{ isIncome ? $t('editFinanceIncome') : $t('editFinanceExpense') }}
        </div>
        <div class="mt-6">
            <form class="flex flex-col gap-4 lg:gap-6">
                <BaseInput
                    v-model="name"
                    :label="$t('name')"
                    :error-message="errors.name"
                />
                <div class="flex flex-col md:flex-row gap-4 lg:gap-6">
                    <BaseInput
                        v-model="sum"
                        :label="$t('sum')"
                        :error-message="errors.sum"
                        v-mask="sumMask"
                        class="w-full"
                    />
                    <BaseSelectUnit
                        v-model="currency"
                        :label="$t('currency')"
                        :options="currencyStore.getCurrencies.models"
                        :error-message="errors.currency"
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
                <div class="flex flex-col md:flex-row gap-4 lg:gap-6">
                    <BaseButton
                        @click="createFinance"
                        color="green"
                        :is-loading="isLoading"
                    >{{ $t('create') }}</BaseButton>
                    <BaseButton type="button" @click="cancel" class="md:order-first" color="red">{{ $t('cancel') }}</BaseButton>
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
import {useToast} from "vue-toastification";
import {onMounted, reactive, ref, watch} from "vue";
import BaseSelectUnit from "@/components/UI/BaseSelectUnit.vue";
import BaseDatePicker from "@/components/UI/BaseDatePicker.vue";
import {formatDate, formatTime} from "@/helpers/formatData.js";
import {useCurrencyStore} from "@/stores/modules/currency.js";
import {useFinanceStore} from "@/stores/modules/finance.js";
import {getMask} from "@/helpers/maskCurrency.js";
import useMaska from "@/composable/useMaska.js";

defineProps({
    isIncome: {
        type: Boolean,
        default: true
    }
})

const financeStore = useFinanceStore()
const dialogStore = useDialogStore()
const currencyStore = useCurrencyStore()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)
const date = ref(formatDate(new Date()))
const time = ref(formatTime(new Date()))

const validationSchema = object({
    name: string().required(t('empty')).max(50, t('maxStrValue') + ' 50'),
    sum: string().required(t('empty')),
    currency: string().required(t('empty'))
})

const {handleSubmit, errors} = useForm({
    validationSchema
})

const {value: name} = useField('name')
const {value: sum} = useField('sum')
const {value: currency} = useField('currency')

const createFinance = handleSubmit(finance => {
    const financeData = {
        id: financeStore.getFinance.id
    }

    if (name.value !== financeStore.getFinance.name) {
        financeData.name = finance.name
    }

    if (+sum.value.replaceAll(' ', '') !== financeStore.getFinance.sum) {
        financeData.sum = +finance.sum.replaceAll(' ', '')
    }

    if (currency.value !== financeStore.getFinance.currency['@id']) {
        financeData.currency = finance.currency
    }

    if (date.value !== formatDate(financeStore.getFinance.createdAt) || time.value !== formatTime(financeStore.getFinance.createdAt)) {
        financeData.createdAt = `${date.value}T${time.value}`
    }

    if (Object.keys(financeData).length > 1) {
        isLoading.value = true

        financeStore.editFinance(financeData)
            .then(() => {
                dialogStore.closeDialog()
                toast.success(t('successfullySaved'))
            })
            .catch(() => {
                toast.error(t('errorSave'))
                isLoading.value = false
            })
    }
})

const cancel = async () => {
    await dialogStore.closeDialog()
}

const sumMask = reactive({
    mask: '#',
    tokens: {
        '#': {
            pattern: /[0-9]/
        }
    }
})

const {timeMask, dateMask} = useMaska()

watch(sum, (val) => {
    sumMask.mask = getMask(val)
})

onMounted(() => {
    name.value = financeStore.getFinance.name
    sum.value = financeStore.getFinance.sum.toString()
    currency.value = financeStore.getFinance.currency['@id']
    date.value = formatDate(financeStore.getFinance.createdAt)
    time.value = formatTime(financeStore.getFinance.createdAt)
})
</script>

<style scoped>

</style>