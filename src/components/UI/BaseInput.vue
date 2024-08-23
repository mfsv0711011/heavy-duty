<template>
    <div>
        <label v-if="label" :for="id" class="block text-sm font-medium leading-6">{{label}}</label>
        <div :class="{'mt-2': label}">
            <input
                @input="$emit('update:modelValue', $event.target.value)"
                :value="modelValue"
                :autofocus="autoFocus"
                :id="id"
                :name="name"
                :type="type"
                :autocomplete="autocomplete"
                :placeholder="placeholder"
                class="block w-full rounded-md border-0 py-3 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:leading-6"
            />
        </div>
        <p v-if="errorMessage" class="mt-2 text-sm text-red-500" id="email-error">{{errorMessage}}</p>
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
    },
    modelValue: {
        type: [String, Number],
    },
    autoFocus: {
        type: Boolean,
        default: false
    },
    autocomplete: {
        type: String,
        default: 'false'
    },
    type: {
        type: String,
        default: 'text'
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
    }
})
</script>

<style scoped>

</style>