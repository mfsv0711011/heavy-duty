<template>
    <TransitionRoot as="template" :show="logoutStore.isLogoutDialogOpen">
        <Dialog class="relative z-50" @close="logoutStore.closeLogoutDialog">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div>
                                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon class="h-6 w-6 text-red-500" aria-hidden="true" />
                                </div>
                                <div class="mt-3 text-center sm:mt-5">
                                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">{{ $t('really')}}</DialogTitle>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <BaseButton
                                    type="button"
                                    color="red"
                                    :is-disable="logoutStore.isLoading"
                                    @click.self="logoutStore.logout"
                                    class="sm:col-start-2"
                                >{{ $t('yes') }}</BaseButton>
                                <BaseButton
                                    type="button"
                                    color="white"
                                    @click.self="logoutStore.closeLogoutDialog"
                                    ref="cancelButtonRef"
                                    class="mt-3 sm:col-start-1 sm:mt-0"
                                >{{ $t('no') }}</BaseButton>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import {useLogoutStore} from "@/stores/logout.js";
import BaseButton from "@/components/UI/BaseButton.vue";

const logoutStore = useLogoutStore()
</script>