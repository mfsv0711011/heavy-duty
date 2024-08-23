<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div class="text-xl lg:text-[1.5rem] font-semibold">{{ $t('receipts') }}</div>
            <div class="mt-4 md:mt-0 md:ml-4 flex flex-wrap gap-4 w-fit">
                <div v-if="userStore.isAdmin">
                    <BaseButton @click="dialogStore.openDialog('addReceipt')" color="green">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 fill-white stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ $t('addReceipt')}}
                    </BaseButton>
                </div>
            </div>
        </div>

        <!--Tab content start-->
        <ReceiptsList/>
        <!--Tab content end-->
    </div>
</template>

<script setup>
import BaseButton from "@/components/UI/BaseButton.vue";
import ReceiptsList from "@/components/lists/ReceiptsList.vue";
import {useDialogStore} from "@/stores/dialog.js";
import {useUserStore} from "@/stores/modules/user.js";

const dialogStore = useDialogStore()
const userStore = useUserStore()
</script>

<style scoped>

</style>