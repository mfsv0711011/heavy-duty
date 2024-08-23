<template>
    <div>
        <LogoutDialog/>
        <DialogComponent/>
        <LoaderComponent/>
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-900/80" />
                </TransitionChild>

                <div class="fixed inset-0 flex">
                    <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </TransitionChild>
                            <!-- Sidebar component, swap this element with another sidebar if you like -->
                            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                <div class="flex h-16 shrink-0 items-center">
                                    <img class="h-8 w-auto" src="/assets/heavy_cmyk_color%202.svg" alt="Your Company" />
                                </div>
                                <nav class="flex flex-1 flex-col">
                                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" class="-mx-2 space-y-1">
                                                <li v-for="item in navigation" :key="item.name">
                                                    <router-link
                                                        @click="sidebarOpen = false"
                                                        v-if="!item.children"
                                                        :to="item.href"
                                                        :class="[item.name === route.name ? 'bg-gray-50 text-green-600' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                    >
                                                        <component :is="item.icon" :class="[item.current === route.name ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600', 'h-6 w-6 shrink-0']" aria-hidden="true" />
                                                        {{ $t(item.name) }}
                                                    </router-link>
                                                    <button
                                                        v-else
                                                        @click="toggleSubItems(item.name)"
                                                        :class="[item.name === route.name ? 'bg-gray-50 text-green-600' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600', 'group w-full flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                    >
                                                        <component :is="item.icon" :class="[item.name === route.name ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600', 'h-6 w-6 shrink-0']" aria-hidden="true" />
                                                        {{ $t(item.name) }}
                                                        <ChevronRightIcon :class="[selectedItem === item.name ? 'rotate-90' : 'text-gray-400 group-hover:text-green-600', 'size-5 ml-auto shrink-0 transition-all']"/>
                                                    </button>
                                                    <ul v-if="selectedItem === item.name" class="mt-1">
                                                        <li
                                                            v-for="subItem in item.children"
                                                            :key="subItem.name"
                                                            class="px-3"
                                                        >
                                                            <router-link
                                                                @click="sidebarOpen = false"
                                                                :to="subItem.href"
                                                                :class="[subItem.name === route.name ? 'bg-gray-50 text-green-600' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600', 'group flex gap-x-3 rounded-md py-2 pl-4 pr-2 text-sm leading-6']"
                                                            >
                                                                {{ $t(subItem.name) }}
                                                            </router-link>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li class="mt-auto">
                                            <button @click="() => { sidebarOpen = false; logoutStore.openLogoutDialog();}" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-green-600">
                                                <ArrowLeftStartOnRectangleIcon class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-green-600" aria-hidden="true" />
                                                {{ $t('exit') }}
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                <router-link to="/" class="flex h-16 w-fit shrink-0 items-center">
                    <img class="h-8 w-auto" src="/assets/heavy_cmyk_color%202.svg" alt="Your Company" />
                </router-link>
                <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" class="-mx-2 space-y-1">
                                <li v-for="item in navigation" :key="item.name">
                                    <router-link
                                        active-class="bg-gray-50 text-green-600"
                                        v-if="!item.children"
                                        :to="item.href"
                                        :class="[item.name === route.name ? 'bg-gray-50 text-green-600' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                    >
                                        <component :is="item.icon" :class="[item.name === route.name ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600', 'h-6 w-6 shrink-0']" aria-hidden="true" />
                                        {{ $t(item.name) }}
                                    </router-link>
                                    <button
                                        v-else
                                        @click="toggleSubItems(item.name)"
                                        :class="[item.name === route.name || item?.children?.some(child => child.name === route.name) ? 'bg-gray-50 text-green-600' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600', 'group w-full flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                    >
                                        <component :is="item.icon" :class="[item.name === route.name ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600', 'h-6 w-6 shrink-0']" aria-hidden="true" />
                                        {{ $t(item.name) }}
                                        <ChevronRightIcon :class="[selectedItem === item.name || item?.children?.some(child => child.name === route.name)? 'rotate-90' : 'text-gray-400 group-hover:text-green-600', 'size-5 ml-auto shrink-0 transition-all']"/>
                                    </button>
<!--                                    {{selectedItem}} | {{item.name}}-->
                                    <ul v-if="selectedItem === item.name || item?.children?.some(child => child.name === route.name)" class="mt-1 flex flex-col gap-1">
                                        <li
                                            v-for="subItem in item.children"
                                            :key="subItem.name"
                                            class="px-3"
                                        >
                                            <router-link
                                                @click="selectedItem = item.name"
                                                :to="subItem.href"
                                                :class="[subItem.name === route.name ? 'bg-gray-50 text-green-600' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600', 'group flex gap-x-3 rounded-md py-2 pl-4 pr-2 text-sm leading-6']"
                                            >
                                                {{ $t(subItem.name) }}
                                            </router-link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li class="mt-auto -mx-2">
                            <button @click="logoutStore.openLogoutDialog" class="group w-full flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-green-600">
                                <ArrowLeftStartOnRectangleIcon class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-green-600" aria-hidden="true" />
                                {{ $t('exit') }}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="lg:pl-72">
            <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
                    <span class="sr-only">Open sidebar</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>

                <!-- Separator -->
                <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

                <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <div class="flex items-center ml-auto gap-x-4 lg:gap-x-6">
                        <LanguageSelect/>

                        <Menu as="div" class="relative inline-block text-left">
                            <div>
                                <MenuButton class="text-gray-400 hover:text-gray-500 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold">
                                    <BellIcon class="h-6 w-6" aria-hidden="true" />
                                    <span
                                        v-if="notificationStore.getNotifications.models.length"
                                        class="absolute h-[18px] min-w-[18px] flex justify-center items-center rounded-full bg-red-600 top-0.5 left-5 text-xs text-white overflow-hidden line-clamp-1 text-start px-1"
                                    >
                                        {{ notificationStore.getNotifications.totalItems }}
                                    </span>
                                </MenuButton>
                            </div>

                            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                <MenuItems class="absolute right-0 z-10 mt-2 w-56 sm:w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <NotificationComponent/>
                                </MenuItems>
                            </transition>
                        </Menu>

                        <!-- Separator -->
                        <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                        <!-- Profile dropdown -->
                        <Menu as="div" class="relative">
                            <MenuButton class="-m-1.5 flex items-center p-1.5">
                                <span class="sr-only">Open user menu</span>
                                <UserAvatarFilled class="size-9" color="fill-gray-400"/>
                                <span class="hidden lg:flex lg:items-center"></span>
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                <MenuItems class="absolute text-sm sm:text-base text-nowrap right-0 z-10 mt-2 px-4 py-2 text-gray-900 w-fit sm:w-fit origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {{ userStore.getUser.email }}
                                </MenuItems>
                            </transition>
                        </Menu>
                    </div>
                </div>
            </div>
            <main class="p-4 lg:p-8 bg-gray-100 h-fit min-h-[calc(100vh_-_64px)]">
                <!-- Your content -->

                <router-view/>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    Dialog,
    DialogPanel, Disclosure, DisclosureButton, DisclosurePanel,
    Menu, MenuButton, MenuItem, MenuItems,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import {
    BanknotesIcon,
    Bars3Icon,
    BellIcon,
    CommandLineIcon,
    HomeIcon,
    ArrowLeftStartOnRectangleIcon,
    XMarkIcon,
    ChevronRightIcon
} from '@heroicons/vue/24/outline'
import LogoutDialog from "@/components/dialogs/LogoutDialog.vue";
import {useLogoutStore} from "@/stores/logout.js";
import {useRoute} from "vue-router";
import UserAvatarFilled from "@/icons/UserAvatarFilled.vue";
import LanguageSelect from "@/components/LanguageSelect.vue";
import DialogComponent from "@/components/dialogs/DialogComponent.vue";
import NotificationComponent from "@/components/NotificationComponent.vue";
import {useNotificationStore} from "@/stores/modules/notification.js";
import LoaderComponent from "@/components/LoaderComponent.vue";
import {useUserStore} from "../stores/modules/user.js";

const logoutStore = useLogoutStore()
const userStore = useUserStore()
const route = useRoute()

const navigation = [
    { name: 'finance', href: '/finance', icon: BanknotesIcon },
    {
        name: 'warehouse',
        icon: HomeIcon,
        children: [
            {
                name: 'materials',
                href: '/materials'
            },
            {
                name: 'products',
                href: '/products'
            },
            {
                name: 'receipts',
                href: '/receipts'
            },
        ]
    },
    { name: 'logs', href: '/logs', icon: CommandLineIcon },
]
const selectedItem = ref(false)

const toggleSubItems = (name) => {
    selectedItem.value ? selectedItem.value = null : selectedItem.value = name
}

const sidebarOpen = ref(false)
const notificationStore = useNotificationStore()
</script>

<style>
.rotate-90 {
    transform: rotate(90deg);
}
</style>