<template>
    <div class="mt-8 flow-root p-5 border rounded-xl bg-white">
        <DeleteDialog @delete-action="deleteAction"/>
        <Disclosure as="section" aria-labelledby="filter-heading" class="flex flex-col justify-center border-gray-200 mb-5">
            <div class="relative">
                <div class="flex flex-col sm:flex-row justify-between gap-6">
                    <BaseSearchInput
                        v-model="filterProps.name"
                        :placeholder="$t('search')"
                        @input="searchByName"
                    />
                    <div class="flex gap-4">
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
            <DisclosurePanel class="py-8">
                <div class="grid md:grid-cols-3 gap-5">
                    <BaseSelectUnit
                        v-model="filterProps.unit"
                        :label="$t('unit')"
                        :options="unitStore.getUnits.models"
                        @update:modelValue="searchByUnit"
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
                    v-if="materialInvoiceStore.getMaterialInvoices.totalItems"
                    class="overflow-x-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="py-3.5 pl-4 whitespace-nowrap pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                            <th scope="col" class="py-3.5 pl-4 whitespace-nowrap pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{{ $t('name') }}</th>
                            <th scope="col" class="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-gray-900">{{ $t('amount') }}</th>
                            <th scope="col" class="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-gray-900">{{ $t('unit') }}</th>
                            <th scope="col" class="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-gray-900">{{ $t('price') }}</th>
                            <th scope="col" class="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-gray-900">{{ $t('currency') }}</th>
                            <th scope="col" class="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-gray-900">{{ $t('tax') }}</th>
                            <th scope="col" class="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-gray-900">{{ $t('additionalExpense') }}</th>
                            <th scope="col" class="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-gray-900">{{ $t('provider') }}</th>
                            <th scope="col" class="px-3 py-3.5 whitespace-nowrap text-left text-sm font-semibold text-gray-900">{{ $t('createdAt') }}</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only"></span>
                            </th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                        <tr
                            v-for="(materialInvoice, index) in materialInvoiceStore.getMaterialInvoices.models"
                            :key="materialInvoice.id"
                        >
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ (page - 1) * 20 + index + 1 }}</td>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ materialInvoice.material.name }}</td>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ materialInvoice.qty }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ $t(materialInvoice.material.unit.name) }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{formatCurrency(materialInvoice.price)}}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ materialInvoice.currency.name }}</td>
                            <td
                                :class="[materialInvoice.hasNds ? 'text-green-600' : 'text-gray-500', 'whitespace-nowrap px-3 py-4 text-sm ']"
                            >
                                {{ materialInvoice.hasNds ? t('nds') : t('notNds') }}
                                <span
                                    v-if="materialInvoice.hasNds"
                                >({{materialInvoice.ndsRate ? materialInvoice.ndsRate + '%' : materialInvoice.ndsRate}})</span>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <Menu as="div" class="relative inline-block text-left" v-if="materialInvoice.additionalExpenses.length">
                                    <div class="-mx-3">
                                        <MenuButton
                                            @click="showPopup(materialInvoice.additionalExpenses)"
                                            class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-3  py-2 text-sm text-gray-500 hover:bg-gray-50">
                                            {{ formatCurrency(materialInvoice.additionalExpenses[0].sum) }}
                                            {{ materialInvoice.additionalExpenses[0].currency.name }}
                                            {{ materialInvoice.additionalExpenses[0].name }}
                                            {{ materialInvoice.additionalExpenses.length > 1 ? '...' : '' }}
                                        </MenuButton>
                                    </div>

                                    <transition v-if="expenses.length" class="fixed outline-none w-screen sm:w-fit px-2 z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <menu-items>
                                            <div class="overflow-x-auto w-full rounded-lg sm:w-fit ring-1 ring-black ring-opacity-5 sm:rounded-lg  shadow-md">
                                                <table class="min-w-full rounded-lg overflow-hidden divide-y divide-gray-300">
                                                    <thead class="bg-[#71BC94]">
                                                    <tr>
                                                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                                                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{{ $t('price') }}</th>
                                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ $t('currency') }}</th>
                                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ $t('additionalInfo') }}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody class="divide-y divide-gray-200 bg-white">
                                                    <tr v-for="(expense, index) of expenses" :key="expense.id">
                                                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{{ index + 1 }}</td>
                                                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{{ formatCurrency(expense.sum) }}</td>
                                                        <td class="whitespace-nowrap px-3 py-4 text-sm">{{ expense.currency.name }}</td>
                                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ expense.name }}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </menu-items>
                                    </transition>
                                </Menu>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ materialInvoice.provider}}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(materialInvoice.createdAt) + " " + formatTime(materialInvoice.createdAt) }}</td>
                            <td class="whitespace-nowrap py-4 pl-3 pr-4 flex justify-end gap-2 text-sm sm:pr-6">
                                <button v-if="userStore.isAdmin" @click="editMaterialInvoice(materialInvoice.id)" class="group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-green-500 group-hover:text-green-600">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </button>
                                <button v-if="userStore.isAdmin" @click="() => deleteStore.openDialog('material_invoices', materialInvoice.id)" class="group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-red-500 group-hover:text-red-600">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="text-center text-sm my-2 text-gray-500">{{ $t('noInformation')}}</div>
            </div>
            <div class="px-5 pt-3 sticky left-0">
                <PaginationComponent v-model="page" :total-pages="totalPageCount"/>
            </div>
        </div>
    </div>
</template>

<script setup>

import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems} from "@headlessui/vue";
import BaseSearchInput from "@/components/UI/BaseSearchInput.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import {useMaterialInvoiceStore} from "@/stores/modules/materialInvoice.js";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {formatCurrency, formatDate, formatTime} from "@/helpers/formatData.js";
import BaseDatePicker from "@/components/UI/BaseDatePicker.vue";
import {useUnitStore} from "@/stores/modules/unit.js";
import BaseSelectUnit from "@/components/UI/BaseSelectUnit.vue";
import {useI18n} from "vue-i18n";
import {useDialogStore} from "@/stores/dialog.js";
import PaginationComponent from "@/components/UI/PaginationComponent.vue";
import {useLoaderStore} from "@/stores/loader.js";
import {useToast} from "vue-toastification";
import {useMaterialStore} from "@/stores/modules/material.js";
import {useUserStore} from "@/stores/modules/user.js";
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";
import useMaska from "@/composable/useMaska.js";
import {useDeleteStore} from "@/stores/delete.js";

const materialStore = useMaterialStore()
const materialInvoiceStore = useMaterialInvoiceStore()
const unitStore = useUnitStore()
const dialogStore = useDialogStore()
const userStore = useUserStore()
const deleteStore = useDeleteStore()
const expenses = ref([])
const page = ref(1)
const totalPageCount = computed(() => Math.ceil(materialInvoiceStore.getMaterialInvoices.totalItems / 20))
const loaderStore = useLoaderStore()
const toast = useToast()
const { t } = useI18n()
const { dateMask } = useMaska()

const filterProps = reactive({
    page: 1,
    name: '',
    unit: '',
    periodFrom: '',
    periodTo: ''
})

const clear = () => {
    page.value = 1
    filterProps.name = filterProps.unit = filterProps.periodFrom = filterProps.periodTo = ''
    materialInvoiceStore.fetchMaterialInvoices(filterProps)
}

const searchByName = () => {
    page.value = 1
    materialInvoiceStore.fetchMaterialInvoices(filterProps)
}

const searchByUnit = (unitId) => {
    page.value = 1
    const parts = unitId.split('/');
    materialInvoiceStore.fetchMaterialInvoices({...filterProps, unit: parts[parts.length - 1]})
}

const updateDate = () => {
    page.value = 1
    materialInvoiceStore.fetchMaterialInvoices(filterProps)
}

const editMaterialInvoice = async (id) => {
    await materialInvoiceStore.fetchMaterialInvoice(id)
    await dialogStore.openDialog('editMaterialInvoice')
}

const deleteAction = () => {
    materialStore.fetchMaterials({page: 1})
    materialInvoiceStore.fetchMaterialInvoices({page: page.value})
}

const showPopup = (additionalExpenses) => {
    expenses.value = additionalExpenses
}

watch(() => page.value, () => {
    materialInvoiceStore.fetchMaterialInvoices({...filterProps, page: page.value})
})

watch(() => dialogStore.isOpenDialog, newVal => {
    if(!newVal) {
        materialStore.fetchMaterials({page: 1})
        materialInvoiceStore.fetchMaterialInvoices({page: page.value})
    }
})

onMounted(async () => {
    loaderStore.showLoader()
    try {
        await materialInvoiceStore.fetchMaterialInvoices(filterProps)
    } catch {
        toast.error(t('errorGet'))
    } finally {
        loaderStore.hideLoader()
    }
})
</script>

<style scoped></style>