<template>
    <div>
        <XButton class="absolute top-4 md:top-6 right-4 md:right-6" @click="cancelAddMaterial"/>
        <div class="font-semibold">
            {{ $t('createInvoice')}}
        </div>
        <div class="mt-6">
            <form class="flex flex-col gap-4 lg:gap-6">
                <BaseSelect
                    v-model="material"
                    :label="$t('material')"
                    :options="materialStore.getMaterialsAll.models"
                    :error-message="errors.material"
                />
                <div class="flex flex-col md:flex-row gap-4 lg:gap-6">
                    <BaseInput
                        v-model="provider"
                        :label="$t('provider')"
                        :error-message="errors.provider"
                        class="w-full"
                    />
                    <BaseInput
                        v-model="qty"
                        :label="$t('amount')"
                        v-mask="qtyMask"
                        :error-message="errors.qty"
                        class="w-full"
                    />
                </div>

                <div class="flex flex-col md:flex-row gap-4 lg:gap-6">
                    <!--Keyinchalik UI folder'ga tiqiladi-->
                    <fieldset class="w-full">
                        <legend class="text-sm font-medium leading-6">{{ $t('valueAddedTax') }}</legend>
                        <div class="mt-2 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                            <div v-for="tax in addedTax" :key="tax.id" class="flex items-center">
                                <input :id="tax.id" v-model="hasNds" :value="tax.withTax" name="notification-method" type="radio" :checked="tax.id === 1" class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600" />
                                <label :for="tax.id" class="ml-3 block whitespace-nowrap text-sm select-none font-medium leading-6 text-gray-900">{{ $t(tax.title) }}</label>
                            </div>
                        </div>
                    </fieldset>

                    <BaseInput
                        v-model="usdRate"
                        :label="'Dollar kursi'"
                        :error-message="errors.usdRate"
                        class="w-full"
                    />
                </div>

                <div class="flex flex-col md:flex-row gap-4 lg:gap-6">
                    <BaseInput
                        v-model="price"
                        :label="$t('price')"
                        v-mask="priceMask"
                        :error-message="errors.price"
                        class="w-full"
                    />
                    <BaseSelect
                        v-model="currency"
                        :label="$t('currency')"
                        :options="currencyStore.getCurrencies.models"
                        :error-message="errors.currency"
                        class="w-full"
                    />
                </div>

                <div class="flex flex-col gap-4 lg:gap-6">
                    <TransitionGroup name="inputList">
                        <div
                            v-for="(expense, index) in additionalExpensesList.length"
                            :key="index"
                            class="flex flex-col md:flex-row gap-4 lg:gap-6 items-end"
                        >
                            <BaseInput
                                :label="$t('additionalExpense') + ' ' + (index + 1)"
                                :placeholder="$t('amount')"
                                :model-value="formatCurrency(additionalExpensesList[index].sum)"
                                @input="updateSum($event, index)"
                                class="w-full"
                            />
                            <BaseSelect
                                v-model="additionalExpensesList[index].currency"
                                :options="currencyStore.getCurrencies.models"
                                class="w-full md:max-w-[120px]"
                            />
                            <BaseInput
                                :placeholder="$t('additionalInfo')"
                                v-model="additionalExpensesList[index].name"
                                class="w-full"
                            />
                        </div>
                    </TransitionGroup>
                </div>
                <div class="flex justify-end gap-4">
                    <button @click.prevent="" class="bg-red-500 hover:bg-red-600 p-3 text-white rounded-full">
                        <MinusIcon @click.prevent="removeAdditionalExpense" class="size-5 font-semibold"/>
                    </button>
                    <button @click.prevent="addAdditionalExpense" class="bg-green-500 hover:bg-green-600 p-3 text-white rounded-full">
                        <PlusIcon class="size-5 font-semibold"/>
                    </button>
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
                        @click="createMaterial"
                        color="green"
                        :is-loading="isLoading"
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
import BaseSelect from "@/components/UI/BaseSelect.vue";
import {PlusIcon, MinusIcon} from "@heroicons/vue/24/outline/index.js";
import {useI18n} from "vue-i18n";
import {object, string} from "yup";
import {useMaterialStore} from "@/stores/modules/material.js";
import {useToast} from "vue-toastification";
import {useCurrencyStore} from "@/stores/modules/currency.js";
import {onMounted, reactive, ref, watch} from "vue";
import {useMaterialInvoiceStore} from "@/stores/modules/materialInvoice.js";
import BaseDatePicker from "@/components/UI/BaseDatePicker.vue";
import {formatCurrency, formatDate} from "@/helpers/formatData.js";
import {getMask} from "@/helpers/maskCurrency.js";
import {useCurrencyRateStore} from "@/stores/modules/currencyRate.js";
import {vMaska} from "maska/vue";
import useMaska from "@/composable/useMaska.js";

const materialStore = useMaterialStore()
const materialInvoiceStore = useMaterialInvoiceStore()
const dialogStore = useDialogStore()
const currencyStore = useCurrencyStore()
const currencyRateStore = useCurrencyRateStore()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)
const date = ref(formatDate(new Date()))
const time = ref()
const additionalExpensesList = ref([
    {sum: '', currency: '', name: ''},
])

const addAdditionalExpense = () => {
    additionalExpensesList.value.push({sum: '', currency: '', name: ''})
}

const removeAdditionalExpense = () => {
    if (additionalExpensesList.value.length > 1) {
        additionalExpensesList.value.pop();
    }
}

const addedTax = ref([
    { id: 1, title: 'nds', withTax: true },
    { id: 2, title: 'notNds', withTax: false },
])

const validationSchema = object({
    material: string().required(t('empty')),
    qty: string().required(t('empty')),
    price: string().required(t('empty')),
    currency: string().required(t('empty')),
    provider: string().required(t('empty')),
    usdRate: string().required(t('empty'))
})

const {handleSubmit, errors} = useForm({
    validationSchema,
    initialValues: {
        hasNds: true
    }
})

const {value: material} = useField('material')
const {value: qty} = useField('qty')
const {value: price} = useField('price')
const {value: currency} = useField('currency')
const {value: hasNds} = useField('hasNds')
const {value: provider} = useField('provider')
const {value: usdRate} = useField('usdRate')

const createMaterial = handleSubmit(materialInvoice => {
    isLoading.value = true
    materialInvoice.price = +materialInvoice.price.replaceAll(' ', '')
    materialInvoice.qty = +materialInvoice.qty.replaceAll(' ', '')
    materialInvoice.usdRate = +materialInvoice.usdRate
    materialInvoice.createdAt = `${date.value}T${time.value}`
    additionalExpensesList.value = additionalExpensesList.value.filter(additionalExpense => additionalExpense.sum && additionalExpense.currency)

    if (additionalExpensesList.value.length) {
        materialInvoice.additionalExpenses = additionalExpensesList.value
    }

    materialInvoiceStore.pushMaterialInvoice(materialInvoice)
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

const updateSum = (event, index) => {
    const filteredValue = event.target.value.replace(/[^0-9]/g, '');
    additionalExpensesList.value[index].sum = parseInt(filteredValue, 10) || 0;
};

const qtyMask = reactive({
    mask: '#',
    tokens: {
        '#': {
            pattern: /[0-9]/
        }
    }
})

const priceMask = reactive({
    mask: '#',
    tokens: {
        '#': {
            pattern: /[0-9]/
        }
    }
})

const {timeMask, dateMask} = useMaska()

watch(qty, (val) => {
    qtyMask.mask = getMask(val)
})

watch(price, (val) => {
    priceMask.mask = getMask(val)
})

onMounted(async () => {
    await materialStore.fetchMaterialsAll()
    const hours = new Date().getHours()
    const minutes = new Date().getMinutes()

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
    const formattedHours = hours < 10 ? '0' + hours : hours
    time.value = `${formattedHours}${formattedMinutes}`

    await currencyStore.fetchCurrencies({page: 1})
    await currencyRateStore.fetchCurrencyRate().then(() => {
        usdRate.value = currencyRateStore.getCurrencyRate.usdToUzs
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