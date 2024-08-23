<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div class="text-xl lg:text-[1.5rem] font-semibold">{{ $t('products') }}</div>
            <div class="mt-4 md:mt-0 md:ml-4 flex flex-wrap gap-4 w-fit" v-if="userStore.isAdmin">
                <div>
                    <BaseButton @click="dialogStore.openDialog('addProduct')" color="green">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 fill-white stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ $t('addProduct')}}
                    </BaseButton>
                </div>
                <div>
                    <BaseButton @click="dialogStore.openDialog('addProductInvoice')" color="green">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 fill-white stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ $t('productInvoice')}}
                    </BaseButton>
                </div>
                <div>
                    <BaseButton @click="dialogStore.openDialog('addSalesInvoice')" color="green">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 fill-white stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ $t('salesInvoice')}}
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
        <ProductsList v-if="selectedTab.id === 1"/>
        <!--Tab content end-->

        <!--Tab content start-->
        <ProductInvoicesList v-if="selectedTab.id === 2" />
        <!--Tab content end-->

        <!--Tab content start-->
        <ProductExpensesList v-if="selectedTab.id === 3" />
        <!--Tab content end-->
    </div>
</template>

<script setup>
import BaseButton from "@/components/UI/BaseButton.vue";
import {onMounted, ref} from "vue";
import {useDialogStore} from "@/stores/dialog.js";
import {useProductStore} from "@/stores/modules/product.js";
import {useUnitStore} from "@/stores/modules/unit.js";
import {useReceiptStore} from "@/stores/modules/recept.js";
import InvoiceIcon from "@/icons/InvoiceIcon.vue";
import ProductsList from "@/components/lists/ProductsList.vue";
import ProductInvoicesList from "@/components/lists/ProductInvoicesList.vue";
import ProductExpensesList from "@/components/lists/ProductExpensesList.vue";
import ProductIcon from "@/icons/ProductIcon.vue";
import InvoiceSellIcon from "@/icons/InvoiceSellIcon.vue";
import {useLoaderStore} from "@/stores/loader.js";
import {useI18n} from "vue-i18n";
import {useToast} from "vue-toastification";
import {useUserStore} from "@/stores/modules/user.js";

const productStore = useProductStore()
const dialogStore = useDialogStore()
const unitStore = useUnitStore()
const receiptStore = useReceiptStore()
const userStore = useUserStore()
const loaderStore = useLoaderStore()
const toast = useToast()
const { t } = useI18n()

const tabs = [
    { id: 1, name: 'products', icon: ProductIcon },
    { id: 2, name: 'productInvoices', icon: InvoiceIcon },
    { id: 3, name: 'salesInvoices', icon: InvoiceSellIcon },
]

const selectedTab = ref(tabs[0])

onMounted(async() => {
    loaderStore.showLoader()
    try {
        await productStore.fetchProducts({page: 1})
        await unitStore.fetchUnits()
        await receiptStore.fetchReceipts({page: 1})
    } catch {
        toast.error(t('errorGet'))
    } finally {
        loaderStore.hideLoader()
    }
})
</script>

<style scoped>

</style>