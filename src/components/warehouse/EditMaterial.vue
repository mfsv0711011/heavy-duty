<template>
    <div>
        <XButton class="absolute top-4 md:top-6 right-4 md:right-6" @click="cancelAddMaterial"/>
        <div class="font-semibold">
            {{ $t('changeMaterial')}}
        </div>
        <div class="mt-6">
            <form class="flex flex-col gap-4 lg:gap-6">
                <BaseInput
                    v-model="name"
                    :label="$t('name')"
                    :error-message="errors.name"
                />
                <BaseSelectUnit
                    v-model="unit"
                    :label="$t('unit')"
                    :options="unitStore.getUnits.models"
                    :error-message="errors.unit"
                />
                <BaseInput
                    v-model="delimit"
                    :label="$t('minimumAmount')"
                    v-mask="delimitMask"
                    :error-message="errors.delimit"
                />
                <div class="flex flex-col md:flex-row gap-4 lg:gap-6">
                    <BaseButton
                        @click="editMaterial"
                        color="green"
                        :is-loading="isLoading"
                    >{{ $t('save') }}</BaseButton>
                    <BaseButton
                        type="button"
                        @click="cancelAddMaterial"
                        class="md:order-first"
                        color="red"
                    >{{ $t('cancel') }}</BaseButton>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import {useDialogStore} from "@/stores/dialog.js";
import {Form, useField, useForm} from "vee-validate";
import BaseInput from "@/components/UI/BaseInput.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import XButton from "@/components/XButton.vue";
import {useUnitStore} from "@/stores/modules/unit.js";
import {useI18n} from "vue-i18n";
import {number, object, string} from "yup";
import {useMaterialStore} from "@/stores/modules/material.js";
import {useToast} from "vue-toastification";
import {onMounted, reactive, ref, watch} from "vue";
import BaseSelectUnit from "@/components/UI/BaseSelectUnit.vue";
import {getMask} from "@/helpers/maskCurrency.js";
import {formatCurrency} from "@/helpers/formatData.js";

const materialStore = useMaterialStore()
const dialogStore = useDialogStore()
const unitStore = useUnitStore()
const toast = useToast()
const { t } = useI18n()
const isLoading = ref(false)

const validationSchema = object({
    name: string().required(t('empty')).max(50, t('maxStrValue') + ' 50'),
    unit: string().required(t('empty')),
    delimit: number()
        .required(t('empty'))
        .min(0, t('minIntValue') + ' 0')
        .max(2147483647, t('maxIntValue') + ' 2 147 483 647')
        .typeError(t('empty'))
})

const {handleSubmit, errors} = useForm({
    validationSchema,
})

const {value: name} = useField('name')
const {value: unit} = useField('unit')
const {value: delimit} = useField('delimit')

const editMaterial = handleSubmit( async material => {
    const materialData = {
        id: materialStore.getMaterial.id
    }

    if (name.value !== materialStore.getMaterial.name) {
        await materialStore.fetchIsUniqueMaterial({name: material.name})

        if (materialStore.getIsUniqueMaterial) {
            materialData.name = material.name
        } else {
            toast.error(t('isUniqueMaterial'))
        }
    }

    if (unit.value !== materialStore.getMaterial.unit['@id']) {
        materialData.unit = material.unit
    }

    if (+delimit.value.replaceAll(' ', '') !== materialStore.getMaterial.delimit) {
        materialData.delimit = +material.delimit.replaceAll(' ', '')
    }

    if (Object.keys(materialData).length > 1) {
        isLoading.value = true
        materialStore.putMaterial(materialData)
            .then(() => {
                dialogStore.closeDialog()
                toast.success(t('successfullySaved'))
            })
            .catch(() => {
                toast.error(t('errorSave'))
                isLoading.value = false
            })
    }
})

const cancelAddMaterial = async () => {
    await dialogStore.closeDialog()
}

const delimitMask = reactive({
    mask: '#',
    tokens: {
        '#': {
            pattern: /[0-9]/
        }
    }
})

watch(delimit, (val) => {
    delimitMask.mask = getMask(val)
})

onMounted(() => {
    name.value = materialStore.getMaterial.name
    unit.value = materialStore.getMaterial.unit['@id']
    delimit.value = formatCurrency(materialStore.getMaterial.delimit)
})
</script>

<style scoped>

</style>