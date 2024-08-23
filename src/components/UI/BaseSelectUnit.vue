<template>
    <Listbox as="div" v-model="selected">
        <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900">{{label}}</ListboxLabel>
        <div class="relative mt-2">
            <ListboxButton v-if="selected" class="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600">
                <span class="block truncate">{{ $t(selected.name) }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
            </ListboxButton>

            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions v-if="options.length" class="absolute z-10 mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <ListboxOption
                        as="template"
                        v-for="option in options"
                        :key="option.id"
                        :value="option"
                        @click="changeSelectItem(option)"
                        v-slot="{ active, selected }"
                    >
                        <li :class="[active ? 'bg-green-500 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ $t(option.name) }}</span>

                            <span v-if="selected" :class="[active ? 'text-white' : 'text-green-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                        </li>
                    </ListboxOption>
                </ListboxOptions>
            </transition>
        </div>
        <p v-if="errorMessage" class="mt-2 text-sm text-red-500" id="email-error">{{errorMessage}}</p>
    </Listbox>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {useI18n} from "vue-i18n"

const props = defineProps({
    modelValue: {
        type: String
    },
    options: {
        type: Array,
        default: []
    },
    label: {
        type: String
    },
    errorMessage: String
})

const selected = ref({name: 'choose'})
const emit = defineEmits(['update:modelValue'])

const changeSelectItem = (option) => {
    emit('update:modelValue', option['@id'])
}
onMounted(() => {
    if (props.modelValue) {
        selected.value = props.options.find(option => option['@id'] === props.modelValue)
    }
})
watch(() => props.modelValue, () => {
    if (props.modelValue) {
        selected.value = props.options.find(option => option['@id'] === props.modelValue)
    } else {
        selected.value = {name: 'choose'}
    }
})
</script>

<style scoped>

</style>