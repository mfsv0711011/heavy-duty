<template>
    <div>
        <div class="flex flex-col md:flex-row sm:justify-between sm:items-start">
            <div>
                <div class="text-xl lg:text-[1.5rem] whitespace-nowrap font-semibold">{{ $t('materials') }}</div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                    <ReceiptPercentIcon class="mr-1.5 size-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                    <span class="font-semibold">{{$t('VAT')}}</span>
                    <input
                        @focusin="() => isTaxEdit = true"
                        @focusout="() => isTaxEdit = false"
                        type="text"
                        v-model="addedTax"
                        v-mask="'###'"
                        class="bg-transparent w-6 py-0 px-0 ml-1.5 border-b border-transparent focus:border-gray-500 focus:ring-0 outline-none text-sm h-full border-0"
                        :class="[isTaxEdit ? 'text-center' : 'text-end']"
                        @change="changeNds"
                    >
                    <span v-if="!isTaxEdit" class="text-gray-600">%</span>
                    <button>
                        <CheckIcon v-if="isTaxEdit" class="ml-2 size-5 text-green-500"/>
                    </button>
                </div>
            </div>
            <div class="mt-4 md:mt-0 md:ml-4 flex flex-wrap gap-4 w-fit" v-if="userStore.isAdmin">
                <div>
                    <BaseButton @click="dialogStore.openDialog('addMaterial')" color="green">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 fill-white stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ $t('addMaterial')}}
                    </BaseButton>
                </div>
                <div>
                    <BaseButton @click="dialogStore.openDialog('addMaterialInvoice')" color="green">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 fill-white stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ $t('createInvoice')}}
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
        <MaterialsList v-if="selectedTab.id === 1"/>
        <!--Tab content end-->

        <!--Tab content start-->
        <MaterialInvoicesList v-if="selectedTab.id === 2" />
        <!--Tab content end-->
    </div>
</template>

<script setup>

import BaseButton from "@/components/UI/BaseButton.vue";
import {onMounted, ref} from "vue";
import {useDialogStore} from "@/stores/dialog.js";
import {useUnitStore} from "@/stores/modules/unit.js";
import MaterialIcon from "@/icons/MaterialIcon.vue";
import InvoiceIcon from "@/icons/InvoiceIcon.vue";
import MaterialInvoicesList from "@/components/lists/MaterialInvoicesList.vue";
import MaterialsList from "@/components/lists/MaterialsList.vue";
import {ReceiptPercentIcon, CheckIcon} from '@heroicons/vue/24/outline'
import {useUserStore} from "@/stores/modules/user.js";
import {useLoaderStore} from "@/stores/loader.js";
import {useToast} from "vue-toastification";
import {useMaterialStore} from "@/stores/modules/material.js";
import {useI18n} from "vue-i18n";

const materialStore = useMaterialStore()
const dialogStore = useDialogStore()
const unitStore = useUnitStore()
const userStore = useUserStore()
const loaderStore = useLoaderStore()
const toast = useToast()
const { t } = useI18n()

const tabs = [
    { id: 1, name: 'materials', icon: MaterialIcon },
    { id: 2, name: 'invoices', icon: InvoiceIcon },
]

const selectedTab = ref(tabs[0])
const isTaxEdit = ref(false)
const addedTax = ref('')

const changeNds = () => {
    userStore.changeUser({id: userStore.getUser.id, ndsRate: +addedTax.value})
}

onMounted(async() => {
    loaderStore.showLoader()
    try {
        await materialStore.fetchMaterials({page: 1})
        await unitStore.fetchUnits()
        await userStore.fetchAboutMe()
        addedTax.value = userStore.getUser.ndsRate
    } catch {
        toast.error(t('errorGet'))
    } finally {
        loaderStore.hideLoader()
    }
})
</script>

<style scoped>

</style>