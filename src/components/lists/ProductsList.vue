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
                    <BaseSelectUnit
                        v-model="filterProps.unit"
                        :label="$t('unit')"
                        :options="unitStore.getUnits.models"
                        @update:modelValue="searchByUnit"
                    />
                </div>
            </DisclosurePanel>
        </Disclosure>

        <div class="-mx-5 -my-2 overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle sm:px-5">
                <div
                    v-if="productStore.getProducts.totalItems"
                    class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{{ $t('name') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ $t('amount') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ $t('unit') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ $t('limit') }}</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only"></span>
                            </th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                        <tr
                            v-for="(product, index) in productStore.getProducts.models"
                            :key="product.id"
                        >
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ (page - 1) * 20 + index + 1 }}</td>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ product.name }}</td>
                            <td
                                class="whitespace-nowrap px-3 py-4 text-sm"
                                :class="product.qty < product.delimit ? 'text-red-500' : 'text-gray-500'"
                            >{{ product.qty }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ $t(product.unit.name) }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ product.delimit }}</td>
                            <td class="whitespace-nowrap py-4 pl-3 pr-4 flex justify-end gap-2 text-sm sm:pr-6">
                                <button v-if="userStore.isAdmin" @click="editProduct(product.id)" class="group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-green-500 group-hover:text-green-600">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
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
import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/vue";
import {computed, reactive, ref, watch} from "vue";
import {useUnitStore} from "@/stores/modules/unit.js";
import BaseSelectUnit from "@/components/UI/BaseSelectUnit.vue";
import BaseSearchInput from "@/components/UI/BaseSearchInput.vue";
import {useProductStore} from "@/stores/modules/product.js";
import BaseButton from "@/components/UI/BaseButton.vue";
import {useDialogStore} from "@/stores/dialog.js";
import PaginationComponent from "@/components/UI/PaginationComponent.vue";
import {useUserStore} from "@/stores/modules/user.js";

const productStore = useProductStore()
const unitStore = useUnitStore()
const userStore = useUserStore()
const dialogStore = useDialogStore()
const page = ref(1)
const totalPageCount = computed(() => Math.ceil(productStore.getProducts.totalItems / 20))

const filterProps = reactive({
    page: 1,
    name: '',
    unit: '',
})

const clear = () => {
    page.value = 1
    filterProps.name = filterProps.unit = ''
    productStore.fetchProducts(filterProps)
}

const searchByName = () => {
    page.value = 1
    productStore.fetchProducts(filterProps)
}

const searchByUnit = (unitId) => {
    page.value = 1
    const parts = unitId.split('/');
    productStore.fetchProducts({...filterProps, unit: parts[parts.length - 1]})
}

const editProduct = async (id) => {
    await productStore.fetchProduct(id)
    await dialogStore.openDialog('editProduct')
}

watch(() => page.value, () => {
    productStore.fetchProducts({...filterProps, page: page.value})
})

watch(() => dialogStore.isOpenDialog, newVal => {
    if(!newVal) {
        productStore.fetchProducts({page: page.value})
    }
})
</script>

<style scoped>

</style>