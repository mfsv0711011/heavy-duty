<template>
    <div class="mt-8 flow-root p-5 border rounded-xl bg-white">
        <Disclosure as="section" aria-labelledby="filter-heading" class="flex flex-col justify-center border-gray-200 mb-5">
            <div class="relative">
                <div class="flex flex-col sm:flex-row justify-between gap-6">
                    <BaseSelect
                        v-model="filterProps.department"
                        :label="$t('department')"
                        :options="departments"
                        @update:modelValue="searchByDepartment"
                    />
                    <div class="flex items-center gap-4">
                        <BaseButton class="h-fit w-full sm:w-fit" color="white" @click="clear">{{ $t('cleaning') }}</BaseButton>
                        <DisclosureButton class="group flex w-full sm:w-fit items-center font-medium text-gray-700">
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
                        v-model="filterProps.type"
                        :label="$t('actionType')"
                        :options="actions"
                        @update:modelValue="searchByAction"
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

        <div class="-mx-5 -mt-2 overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle sm:px-5">
                <div
                    v-if="logStore.getLogs.totalItems"
                    class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm whitespace-nowrap font-semibold text-gray-900 sm:pl-6">{{ $t('email') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm whitespace-nowrap font-semibold text-gray-900">{{ $t('description') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm whitespace-nowrap font-semibold text-gray-900">{{ $t('department') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm whitespace-nowrap font-semibold text-gray-900">{{ $t('actionType') }}</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm whitespace-nowrap font-semibold text-gray-900">{{ $t('createdAt') }}</th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                        <tr
                            v-for="(log, index) in logStore.getLogs.models"
                            :key="log.id"
                        >
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ (page - 1) * 20 + index + 1 }}</td>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ log.user }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-if="log.type === 10 || log.type === 30">
                                <div v-if="log.department === 1">
                                    {{ `${log.name}: ${log.qty} ${log.unit} ${formatCurrency(log.sum)} ${log.currency} ${formatDateWithTime(log.inputtedAt)}` }}
                                </div>
                                <div v-if="log.department === 2">
                                    {{ `${log.name}: ${log.recept} ${log.qty} ${log.unit} ${formatDateWithTime(log.inputtedAt)}` }}
                                </div>
                                <div v-if="log.department === 3">
                                    {{ `${log.name}: ${log.qty} ${log.unit} ${formatCurrency(log.sum)} ${log.currency} ${formatDateWithTime(log.inputtedAt)}` }}
                                </div>
                                <div v-if="log.department === 4">
                                    {{ `${log.name}: ${log.recept} ${log.qty} ${log.unit}` }}
                                </div>
                                <div v-if="log.department === 5">
                                    {{`${log.isIncome ? $t('income') : $t('expense')}: ${log.name}: ${formatCurrency(log.sum)} ${log.currency} ${formatDateWithTime(log.inputtedAt)}` }}
                                </div>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-if="log.type === 20">
                                <div v-if="log.department === 1">
                                    <span>{{ log.name }}: </span>
                                    <span v-if="log.newName" class="text-red-500">{{ `${log.newName} ` }}</span>
                                    <span v-if="log.newQty">{{ log.qty }} {{ log.unit }} - <span class="text-red-500">{{ log.newQty }} {{ `${log.unit} ` }}</span></span>
                                    <span v-if="log.newSum">{{ formatCurrency(log.sum) }} - <span class="text-red-500">{{ `${formatCurrency(log.newSum)} ` }}</span></span>
                                    <span v-if="log.newCurrency">{{ log.currency }} - <span class="text-red-500">{{ `${log.newCurrency} ` }}</span></span>
                                    <span v-if="log.newInputtedAt">{{ formatDateWithTime(log.inputtedAt) }} - <span class="text-red-500">{{ formatDateWithTime(log.newInputtedAt) }}</span></span>
                                </div>
                                <div v-if="log.department === 2">
                                    <span>{{ log.name }}: </span>
                                    <span v-if="log.newName" class="text-red-500">{{ `${log.newName} ` }}</span>
                                    <span v-if="log.newRecept">{{ log.recept }} - <span class="text-red-500">{{ `${log.newRecept} ` }}</span></span>
                                    <span v-if="log.newQty">{{ log.qty }} {{ log.unit }} - <span class="text-red-500">{{ log.newQty }} {{ `${log.unit} ` }}</span></span>
                                    <span v-if="log.newInputtedAt">{{ formatDateWithTime(log.inputtedAt) }} - <span class="text-red-500">{{ formatDateWithTime(log.newInputtedAt) }}</span></span>
                                </div>
                                <div v-if="log.department === 3">
                                    <span>{{ log.name }}: </span>
                                    <span v-if="log.newName" class="text-red-500">{{ `${log.newName} ` }}</span>
                                    <span v-if="log.newQty">{{ log.qty }} {{ log.unit }} - <span class="text-red-500">{{ log.newQty }} {{ `${log.unit} ` }}</span></span>
                                    <span v-if="log.newSum">{{ formatCurrency(log.sum) }} - <span class="text-red-500">{{ `${formatCurrency(log.newSum)} ` }}</span></span>
                                    <span v-if="log.newCurrency">{{ log.currency }} - <span class="text-red-500">{{ `${log.newCurrency} ` }}</span></span>
                                    <span v-if="log.newInputtedAt">{{ formatDateWithTime(log.inputtedAt) }} - <span class="text-red-500">{{ formatDateWithTime(log.newInputtedAt) }}</span></span>
                                </div>
                                <div v-if="log.department === 4">
                                    <span>{{ log.name }}: </span>
                                    <span v-if="log.newName" class="text-red-500">{{ `${log.newName} ` }}</span>
                                    <span v-if="log.newRecept">{{ log.recept }} - <span class="text-red-500">{{ `${log.newRecept} ` }}</span></span>
                                    <span v-if="log.newQty">{{ log.qty }} {{ log.unit }} - <span class="text-red-500">{{ log.newQty }} {{ `${log.unit} ` }}</span></span>
                                </div>
                                <div v-if="log.department === 5">
                                    {{ log.isIncome ? $t('income') : $t('expense') }} <span>{{ log.name }}: </span>
                                    <span v-if="log.newName" class="text-red-500">{{ `${log.newName} ` }}</span>
                                    <span v-if="log.newSum">{{ formatCurrency(log.sum) }} - <span class="text-red-500">{{ `${formatCurrency(log.newSum)} ` }}</span></span>
                                    <span v-if="log.newCurrency">{{ log.currency }} - <span class="text-red-500">{{ `${log.newCurrency} ` }}</span></span>
                                    <span v-if="log.newInputtedAt">{{ formatDateWithTime(log.inputtedAt) }} - <span class="text-red-500">{{ formatDateWithTime(log.newInputtedAt) }}</span></span>
                                </div>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ showDepartment(log.department) }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <div v-if="log.type === 10">{{ $t('created') }}</div>
                                <div v-if="log.type === 20" class="text-green-500">{{ $t('updated') }}</div>
                                <div v-if="log.type === 30" class="text-red-500">{{ $t('deleted') }}</div>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDateWithTime(log.createdAt) }}</td>
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
import {computed, onMounted, reactive, ref, watch} from "vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseDatePicker from "@/components/UI/BaseDatePicker.vue";
import {useLoaderStore} from "@/stores/loader.js";
import {useLogStore} from "@/stores/modules/log.js";
import {useToast} from "vue-toastification";
import {formatCurrency, formatDateWithTime} from "@/helpers/formatData.js";
import BaseSelect from "@/components/UI/BaseSelect.vue";
import {useI18n} from "vue-i18n";
import PaginationComponent from "@/components/UI/PaginationComponent.vue";
import useMaska from "@/composable/useMaska.js";

const loaderStore = useLoaderStore()
const logStore = useLogStore()
const toast = useToast()
const { t } = useI18n()
const page = ref(1)
const totalPageCount = computed(() => Math.ceil(logStore.getLogs.totalItems / 20))
const { dateMask } = useMaska()

const filterProps = reactive({
    page: 1,
    department: '',
    type: '',
    periodFrom: '',
    periodTo: ''
})

const actions = computed(() => [
    {'@id': '10', name: t('created')},
    {'@id': '20', name: t('updated')},
    {'@id': '30', name: t('deleted')},
])

const departments = computed(() => [
    {'@id': '1', name: t('materials')},
    {'@id': '2', name: t('products')},
    {'@id': '3', name: t('sale')},
    {'@id': '4', name: t('receipts')},
    {'@id': '5', name: t('finance')}
])

const showDepartment = (number) => {
    let department

    switch (number) {
        case 1:
            department = t('materials')
            break
        case 2:
            department = t('products')
            break
        case 3:
            department = t('sale')
            break
        case 4:
            department = t('receipts')
            break
        case 5:
            department = t('finance')
            break
        default:
            department = ""
    }

    return department
}

const clear = () => {
    page.value = 1
    filterProps.department = filterProps.type = filterProps.periodFrom = filterProps.periodTo = ''
    logStore.fetchLogs(filterProps)
}

const searchByDepartment = () => {
    page.value = 1
    logStore.fetchLogs(filterProps)
}

const searchByAction = () => {
    page.value = 1
    logStore.fetchLogs(filterProps)
}

const updateDate = () => {
    page.value = 1
    logStore.fetchLogs(filterProps)
}

watch(() => page.value, () => {
    logStore.fetchLogs({...filterProps, page: page.value})
})

onMounted(async () => {
    loaderStore.showLoader()
    try {
        await logStore.fetchLogs(filterProps)
    } catch {
        toast.error(t('errorGet'))
    } finally {
        loaderStore.hideLoader()
    }
})
</script>

<style scoped>

</style>