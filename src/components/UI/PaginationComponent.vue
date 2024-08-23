<template>
    <div v-if="totalPages > 1" class="flex items-center flex-wrap gap-4 justify-end border-t border-gray-200 bg-white pt-4 pb-2">
        <div class="flex items-center justify-end gap-1">
            <input type="text" @keydown.enter="changePage(inputValue)" v-model.number="inputValue" class="rounded-tl-md rounded-bl-md w-11 border-none ring-1 ring-inset ring-gray-300 focus-visible:ring-green-500 h-9">
            <button
                :class="['rounded-tr-md rounded-br-md bg-green-500 hover:bg-green-600 hover:text-gray-100 text-white relative z-10 inline-flex px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline border w-11 justify-center items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600']"
                @click="changePage(inputValue)"
            >
                GO
            </button>
        </div>
        <div class="flex w-fit sm:items-center sm:justify-end">
            <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <a
                        href="#"
                        class="group w-8 sm:w-fit relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        @click="changePage(currentPage - 1)"
                    >
                        <span class="sr-only">Previous</span>
                        <ChevronLeftIcon class="h-5 w-5 group-hover:text-green-600" aria-hidden="true" />
                    </a>
                    <a
                        v-for="pageNumber of visiblePages"
                        :key="pageNumber"
                        href="#"
                        :class="[currentPage == pageNumber ? 'bg-green-500 hover:bg-green-600 hover:text-gray-100 text-white' : 'hover:text-green-600', 'hover:bg-gray-50 text-gray-900 relative z-10 inline-flex px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline border w-7 sm:w-11 justify-center items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600']"
                        @click="changePage(pageNumber)"
                    >
                        {{ pageNumber }}
                    </a>

                    <a
                        href="#"
                        class="w-8 sm:w-fit group relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        @click="changePage(currentPage + 1)"
                    >
                        <span class="sr-only">Next</span>
                        <ChevronRightIcon class="h-5 w-5 group-hover:text-green-600" aria-hidden="true" />
                    </a>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import {computed, ref, watch} from "vue";

const props = defineProps({
    modelValue: {
        type: Number,
        default: 1
    },
    totalPages: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')
const currentPage = ref(1)

const visiblePages = computed(() => {
    if (props.totalPages <= 7) return Array.from({ length: props.totalPages }, (_, i) => i + 1);

    if (currentPage.value <= 3) return [1, 2, 3, 4, 5, '...', props.totalPages];
    if (currentPage.value >= props.totalPages - 3) return [1, '...', props.totalPages - 4, props.totalPages - 3, props.totalPages - 2, props.totalPages - 1, props.totalPages];

    return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', props.totalPages];
});

const changePage = page => {
    if (page >= 1 && page <= props.totalPages) {
        currentPage.value = page
        inputValue.value = null
    }

    emit('update:modelValue', currentPage.value)
}

watch(() => props.modelValue, () => {
    currentPage.value = props.modelValue
})
</script>
<style scoped>

</style>