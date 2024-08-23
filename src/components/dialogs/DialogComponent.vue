<template>
    <TransitionRoot as="template" :show="dialogStore.isOpenDialog">
        <Dialog class="relative z-50" @close="dialogStore.closeDialog">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6">
                            <AddMaterial v-if="dialogStore.selectedComponent === 'addMaterial'"/>
                            <AddMaterialInvoice v-if="dialogStore.selectedComponent === 'addMaterialInvoice'"/>
                            <EditMaterial v-if="dialogStore.selectedComponent === 'editMaterial'"/>
                            <EditMaterialInvoice v-if="dialogStore.selectedComponent === 'editMaterialInvoice'"/>
                            <AddFinance
                                v-if="['addFinanceIncome', 'addFinanceExpense'].includes(dialogStore.selectedComponent)"
                                :isIncome="dialogStore.selectedComponent === 'addFinanceIncome'"
                            />
                            <EditFinance
                                v-if="['editFinanceIncome', 'editFinanceExpense'].includes(dialogStore.selectedComponent)"
                                :isIncome="dialogStore.selectedComponent === 'editFinanceIncome'"
                            />
                            <AddProduct v-if="dialogStore.selectedComponent === 'addProduct'"/>
                            <AddProductInvoice v-if="dialogStore.selectedComponent === 'addProductInvoice'"/>
                            <AddSalesInvoice v-if="dialogStore.selectedComponent === 'addSalesInvoice'"/>
                            <EditProduct v-if="dialogStore.selectedComponent === 'editProduct'"/>
                            <EditProductInvoice v-if="dialogStore.selectedComponent === 'editProductInvoice'"/>
                            <EditProductExpense v-if="dialogStore.selectedComponent === 'editProductExpense'"/>
                            <AddReceipt v-if="dialogStore.selectedComponent === 'addReceipt'"/>
                            <EditReceipt v-if="dialogStore.selectedComponent === 'editReceipt'"/>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>

import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from "@headlessui/vue";
import {useDialogStore} from "@/stores/dialog.js";
import AddMaterial from "@/components/warehouse/AddMaterial.vue";
import AddMaterialInvoice from "@/components/warehouse/AddMaterialInvoice.vue";
import AddFinance from "@/components/finance/AddFinance.vue";
import AddProduct from "@/components/warehouse/AddProduct.vue";
import AddProductInvoice from "@/components/warehouse/AddProductInvoice.vue";
import EditMaterial from "@/components/warehouse/EditMaterial.vue";
import EditMaterialInvoice from "@/components/warehouse/EditMaterialInvoice.vue";
import AddSalesInvoice from "@/components/warehouse/AddProductExpense.vue";
import EditProduct from "@/components/warehouse/EditProduct.vue";
import EditProductInvoice from "@/components/warehouse/EditProductInvoice.vue";
import EditProductExpense from "@/components/warehouse/EditProductExpense.vue";
import EditFinance from "@/components/finance/EditFinance.vue";
import EditReceipt from "@/components/warehouse/EditReceipt.vue";
import AddReceipt from "@/components/warehouse/AddReceipt.vue";

const dialogStore = useDialogStore()
</script>

<style scoped>

</style>