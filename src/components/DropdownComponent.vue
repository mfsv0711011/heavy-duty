<template>
    <Menu as="div" class="relative inline-block text-left">
        <div class="-mx-3">
            <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-3  py-2 text-sm text-gray-500 hover:bg-gray-50">
                {{truncateText(formatCurrency(expenses[0].sum) + ' ' + expenses[0].currency.name + ' ' + expenses[0].name, 18)}}
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute overflow-x-auto scrollbar right-0 z-[100] mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div
                    v-for="(expense, index) in expenses"
                    :key="index"
                    class="py-2 px-4">
                    <MenuItem>
                        <div class="block text-sm">{{ formatCurrency(expense.sum) + ' ' + expense.currency.name + ' ' + expense.name }}</div>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {formatCurrency} from "../helpers/formatData.js";
defineProps({
    expenses: {
        type: Array
    }
})

const truncateText = (text, length) => {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

</script>

<style scoped>
.scrollbar {
    scrollbar-width: thin;
}
</style>