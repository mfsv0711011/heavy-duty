<template>
    <div>
        <label v-if="label" :for="id" class="block text-sm font-medium leading-6">{{label}}</label>
        <div class="mt-2 relative">
            <input
                ref="input"
                @input="$emit('update:modelValue', $event.target.value)"
                :value="modelValue"
                :id="id"
                :name="name"
                :placeholder="label"
                class="block w-full rounded-md border-0 py-3  ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:leading-6"
            />
            <div class="absolute top-3 right-3 flex items-center cursor-pointer">
                <VDatePicker
                    timezone="+05"
                    v-model="date"
                    locale="ru"
                >
                    <template #default="{ togglePopover }">
                        <div
                            @click="togglePopover"
                        >
                            <svg class="fill-gray-400 stroke-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 9C2 7.114 2 6.172 2.586 5.586C3.172 5 4.114 5 6 5H18C19.886 5 20.828 5 21.414 5.586C22 6.172 22 7.114 22 9C22 9.471 22 9.707 21.854 9.854C21.707 10 21.47 10 21 10H3C2.529 10 2.293 10 2.146 9.854C2 9.707 2 9.47 2 9Z"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 18C2 19.886 2 20.828 2.586 21.414C3.172 22 4.114 22 6 22H18C19.886 22 20.828 22 21.414 21.414C22 20.828 22 19.886 22 18V13C22 12.529 22 12.293 21.854 12.146C21.707 12 21.47 12 21 12H3C2.529 12 2.293 12 2.146 12.146C2 12.293 2 12.53 2 13V18Z"/>
                                <path d="M7 3V6M17 3V6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </template>
                </VDatePicker>
            </div>
        </div>
        <p v-if="errorMessage" class="mt-2 text-sm text-red-500" id="email-error">{{errorMessage}}</p>
    </div>
</template>

<script setup>


import {ref, watch} from "vue";

defineProps({
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number]
    },
    id: {
        type: String,
    },
    name: {
        type: String,
    },
    errorMessage: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
    }
})

const emit = defineEmits(['update:modelValue'])

const date = ref(null)

const selectDate = (value) => {
    emit('update:modelValue', value)
}

watch(() => date.value, (value) => {
    emit('update:modelValue', new Intl.DateTimeFormat('ru-RU').format(value))
})
</script>

<style scoped>

</style>