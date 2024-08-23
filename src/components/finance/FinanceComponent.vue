<template>
    <div>
        <div class="flex flex-col md:flex-row sm:justify-between sm:items-start">
            <div class="flex flex-col gap-4">
                <div class="text-xl lg:text-[1.5rem] whitespace-nowrap font-semibold">{{ $t('finance') }}</div>
                <div class="flex flex-col gap-1 sm:gap-0 sm:flex-row sm:items-center bg-white text-sm py-2 px-3 rounded-md">
                    <div class="flex">
                      <CreditCardIcon class="mr-1.5 size-6 flex-shrink-0 text-gray-500" aria-hidden="true"/>
                      <p class="text-base sm:text-xl text-gray-500 mr-2">{{ $t('balance') }}: </p>
                    </div>
                    <div v-if="balanceStore.getBalance" class="flex gap-4 sm:ms-4 items-center">
                        <p :class="[balanceStore.getBalance.usd < 0 && 'text-red-600', 'font-semibold text-base sm:text-xl text-[#000004D]']">{{ formatCurrency(balanceStore.getBalance.usd) }} <span class="font-normal text-base">USD</span></p>
                        <span class="w-px h-4 bg-gray-500"></span>
                        <p :class="[balanceStore.getBalance.uzs < 0 && 'text-red-600', 'font-semibold text-base sm:text-xl text-[#000004D]']">{{ formatCurrency(balanceStore.getBalance.uzs) }} <span class="font-normal text-base">UZS</span></p>
                    </div>
                </div>
            </div>
            <div class="mt-4 md:mt-0 md:ml-4 flex justify-end flex-wrap gap-4 w-fit" v-if="userStore.isAdmin">
                <div>
                    <BaseButton @click="dialogStore.openDialog('addFinanceIncome')" color="green">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 fill-white stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ $t('addIncome') }}
                    </BaseButton>
                </div>
                <div>
                    <BaseButton @click="dialogStore.openDialog('addFinanceExpense')" color="green">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 fill-white stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ $t('addExpense') }}
                    </BaseButton>
                </div>
            </div>
        </div>

        <!--Tab menu start-->
        <div class="mt-6">
            <div class="sm:hidden">
                <label for="tabs" class="sr-only">Select a tab</label>
                <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
                <select @change="(event) => selectedTab = tabs[event.target.value]" id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <option
                        v-for="(tab, index) in tabs"
                        :key="tab.name"
                        :selected="selectedTab.id === tab.id"
                        :value="index"
                    >{{ $t(tab.name) }}</option>
                </select>
            </div>
            <div class="hidden sm:block">
                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            @click="selectedTab = tab"
                            :class="[selectedTab.id === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'group inline-flex items-center border-b-2 px-1 py-4 font-medium']"
                            :aria-current="selectedTab.id === tab.id ? 'page' : undefined"
                        >
                            <component
                                :is="tab.icon"
                                :class="[selectedTab.id === tab.id ? 'stroke-green-500' : 'stroke-gray-400 group-hover:stroke-gray-500', '-ml-0.5 mr-2 h-5 w-5']"
                                aria-hidden="true"
                            />
                            <span>{{ $t(tab.name) }}</span>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
        <!--Tab menu end-->

        <!--Tab content start-->
        <FinanceList :is-income="selectedTab.value" @edit:finance="editFinance"/>
        <!--Tab content end-->
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useDialogStore} from "@/stores/dialog.js";
import {CreditCardIcon, ArrowDownIcon, ArrowUpIcon} from '@heroicons/vue/24/outline'
import FinanceList from "@/components/lists/FinanceList.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import {useFinanceStore} from "@/stores/modules/finance.js";
import {useBalanceStore} from "@/stores/modules/balance.js";
import {formatCurrency} from "@/helpers/formatData.js";
import {useCurrencyStore} from "@/stores/modules/currency.js";
import {useLoaderStore} from "@/stores/loader.js";
import {useToast} from "vue-toastification";
import {useI18n} from "vue-i18n";
import {useUserStore} from "@/stores/modules/user.js";

const financeStore = useFinanceStore()
const balanceStore = useBalanceStore()
const dialogStore = useDialogStore()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const loaderStore = useLoaderStore()
const toast = useToast()
const { t } = useI18n()

const tabs = [
    { id: 1, name: 'income', value: true, icon: ArrowDownIcon },
    { id: 0, name: 'expense', value: false, icon: ArrowUpIcon },
]

const selectedTab = ref(tabs[0])

const editFinance = (page) => {
    financeStore.fetchFinances({page: page, isIncome: selectedTab.value.value})
    balanceStore.fetchBalance()
}

onMounted(async() => {
    loaderStore.showLoader()
    try {
        await financeStore.fetchFinances({page: 1, isIncome: selectedTab.value.value})
        await balanceStore.fetchBalance()
        await currencyStore.fetchCurrencies({page: 1})
    } catch {
        toast.error(t('errorGet'))
    } finally {
        loaderStore.hideLoader()
    }
})
</script>

<style scoped>

</style>