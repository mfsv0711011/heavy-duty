<template>
    <div class="mt-8 flow-root p-5 border rounded-xl bg-white">
        <Disclosure as="section" aria-labelledby="filter-heading" class="flex flex-col justify-center border-gray-200 mb-5">
            <div class="relative">
                <div class="flex flex-col sm:flex-row justify-between gap-6">
                    <BaseSearchInput
                        v-model="filterProps.name"
                        :placeholder="$t('search')"
                        @input="searchByName"
                    />
                    <div class="flex gap-4">
                        <button @click="exportXLS">
                            <svg class="text-3xl active:scale-75 hover:scale-110 transition-all" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 48 48">
                                <rect width="16" height="9" x="28" y="15" fill="#21a366"></rect><path fill="#185c37" d="M44,24H12v16c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2V24z"></path><rect width="16" height="9" x="28" y="24" fill="#107c42"></rect><rect width="16" height="9" x="12" y="15" fill="#3fa071"></rect><path fill="#33c481" d="M42,6H28v9h16V8C44,6.895,43.105,6,42,6z"></path><path fill="#21a366" d="M14,6h14v9H12V8C12,6.895,12.895,6,14,6z"></path><path d="M22.319,13H12v24h10.319C24.352,37,26,35.352,26,33.319V16.681C26,14.648,24.352,13,22.319,13z" opacity=".05"></path><path d="M22.213,36H12V13.333h10.213c1.724,0,3.121,1.397,3.121,3.121v16.425	C25.333,34.603,23.936,36,22.213,36z" opacity=".07"></path><path d="M22.106,35H12V13.667h10.106c1.414,0,2.56,1.146,2.56,2.56V32.44C24.667,33.854,23.52,35,22.106,35z" opacity=".09"></path><linearGradient id="flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1" x1="4.725" x2="23.055" y1="14.725" y2="33.055" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"></stop><stop offset="1" stop-color="#0b6731"></stop></linearGradient><path fill="url(#flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1)" d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"></path><path fill="#fff" d="M9.807,19h2.386l1.936,3.754L16.175,19h2.229l-3.071,5l3.141,5h-2.351l-2.11-3.93L11.912,29H9.526	l3.193-5.018L9.807,19z"></path>
                            </svg>
                        </button>
                        <BaseButton class="h-fit w-fit" color="white" @click="clear">{{ $t('cleaning') }}</BaseButton>
                        <DisclosureButton class="group flex items-center font-medium text-gray-700">
                            <BaseButton
                                class="h-fit w-fit"
                                color="white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                </svg>
                                {{ $t('filter') }}
                            </BaseButton>
                        </DisclosureButton>
                    </div>
                </div>
            </div>
            <DisclosurePanel class="pt-8 pb-3">
                <div class="grid md:grid-cols-3 gap-5">
                    <BaseSelect
                        v-model="filterProps.currency"
                        :label="$t('currency')"
                        :options="currencyStore.getCurrencies.models"
                        @update:modelValue="searchByCurrency"
                    />
                    <BaseDatePicker
                        v-model="filterProps.periodFrom"
                        v-maska="dateMask"
                        :label="$t('periodFrom')"
                        :placeholder="$t('periodFrom')"
                        @update:model-value="updateDate"
                    />
                    <BaseDatePicker
                        v-model="filterProps.periodTo"
                        v-maska="dateMask"
                        :label="$t('periodTo')"
                        :placeholder="$t('periodTo')"
                        @update:model-value="updateDate"
                    />
                </div>
            </DisclosurePanel>
        </Disclosure>

        <div class="-mx-5 -my-2 overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle sm:px-5">
                <div
                    v-if="financeStore.getFinances.totalItems"
                    class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
                >
                    <table ref="financeTableRef" class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{{ $t('name') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ $t('sum') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ $t('currency') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ $t('date') }}</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only"></span>
                            </th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr
                                v-for="(finance, index) in financeStore.getFinances.models"
                                :key="finance.id"
                            >
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ (page - 1) * 20 + index + 1 }}</td>
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ finance.name }}</td>
                                <td :class="['whitespace-nowrap px-3 py-4 text-sm', finance.isIncome ? 'text-green-500' : 'text-red-500']">{{ formatCurrency(finance.sum) }}</td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ finance.currency.name }}</td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(finance.createdAt) + " " + formatTime(finance.createdAt) }}</td>
                                <td class="whitespace-nowrap py-4 pl-3 pr-4 flex justify-end gap-2 text-sm sm:pr-6">
                                    <button v-if="userStore.isAdmin" class="group" @click="editFinance(finance.id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-green-500 group-hover:text-green-600">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="text-center text-sm mt-2 text-gray-500">{{ $t('noInformation')}}</div>

                <div class="flex justify-end py-4">
                    <div class="flex gap-4">
                        <div class="text-right">
                            <div>{{ formatCurrency(financeStore.getFinances.totalUsd) }} <span class="text-xs">USD</span></div>
                            <div class="text-xs">
                                ( {{ formatCurrency(financeStore.getFinances.totalUsd * currencyRateStore.getCurrencyRate.usdToUzs) }}<span class="text-[8px]"> UZS</span> )
                            </div>
                        </div>
                        <div class="h-full w-px bg-gray-400"></div>
                        <div class="text-left">
                            <div>{{ formatCurrency(financeStore.getFinances.totalUzs) }} <span class="text-xs">UZS</span></div>
                            <div class="text-xs">
                                ( {{ formatCurrency(financeStore.getFinances.totalUzs / currencyRateStore.getCurrencyRate.usdToUzs) }}<span class="text-[8px]"> USD</span> )
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="totalPageCount > 1" class="px-5 pt-3 sticky left-0">
                <PaginationComponent v-model="page" :total-pages="totalPageCount"/>
            </div>
        </div>
    </div>
</template>

<script setup>

import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useFinanceStore} from "@/stores/modules/finance.js";
import BaseDatePicker from "@/components/UI/BaseDatePicker.vue";
import {formatCurrency, formatDate, formatDateWithTime, formatTime} from "@/helpers/formatData.js";
import {useCurrencyStore} from "@/stores/modules/currency.js";
import BaseSelect from "@/components/UI/BaseSelect.vue";
import PaginationComponent from "@/components/UI/PaginationComponent.vue";
import {useI18n} from "vue-i18n";
import {useDialogStore} from "@/stores/dialog.js";
import {useCurrencyRateStore} from "@/stores/modules/currencyRate.js";
import {useUserStore} from "@/stores/modules/user.js";
import {exportToExcel} from "@/helpers/exportToExcel.js";
import useMaska from "@/composable/useMaska.js";

const currencyStore = useCurrencyStore()
const currencyRateStore = useCurrencyRateStore()
const financeStore = useFinanceStore()
const dialogStore = useDialogStore()
const userStore = useUserStore()
const { t } = useI18n()
const financeTableRef = ref()
const { dateMask } = useMaska()

const emit = defineEmits(['edit:finance'])

const props = defineProps({
    isIncome: {
        type: Boolean,
        default: true
    }
})

const page = ref(1)
const totalPageCount = computed(() => Math.ceil(financeStore.getFinances.totalItems / 20))

const filterProps = reactive({
    page: 1,
    name: '',
    currency: '',
    periodFrom: '',
    periodTo: '',
    isIncome: true
})

const clear = () => {
    page.value = 1
    filterProps.name = filterProps.currency = filterProps.periodFrom = filterProps.periodTo = ''
    financeStore.fetchFinances(filterProps)
}

const searchByName = () => {
    page.value = 1
    financeStore.fetchFinances(filterProps)
}

const searchByCurrency = (currencyId) => {
    page.value = 1
    const parts = currencyId.split('/');
    financeStore.fetchFinances({...filterProps, currency: parts[parts.length - 1]})
}

const updateDate = () => {
    page.value = 1
    financeStore.fetchFinances(filterProps)
}
const editFinance = async financeId => {
    await financeStore.fetchFinance(financeId)

    if (props.isIncome) {
        await dialogStore.openDialog('editFinanceIncome')
    } else {
        await dialogStore.openDialog('editFinanceExpense')
    }
}

watch(() => props.isIncome, newVal => {
    filterProps.isIncome = newVal
    financeStore.fetchFinances(filterProps)
})

watch(() => page.value, () => {
    financeStore.fetchFinances({...filterProps, page: page.value})
})

watch(() => dialogStore.isOpenDialog, newVal => {
    if(!newVal) {
        emit('edit:finance', page.value)
    }
})

const exportXLS = () => {
    const filename = props.isIncome ? t('income') : t('expense')
    if (financeTableRef.value) {
        exportToExcel(filename, financeTableRef.value)
    }
}

onMounted(() => {
    currencyRateStore.fetchCurrencyRate()
})
</script>

<style scoped>

</style>