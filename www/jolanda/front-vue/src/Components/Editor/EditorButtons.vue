<script setup>
const props = defineProps({
    formId: {
        type: String,
        required: true,
    },
    disabled: Boolean,
    saveAndCloseOnly:{
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <div class="buttons flex items-center justify-end gap-2">
        <slot />
        <Button type="submit" variant="green" icon="save" data-action="save" :form="formId" :disabled="props.disabled" v-if="!saveAndCloseOnly"> Uložit </Button>
        <Button type="submit" variant="green" :outline="true" data-action="saveAndClose" :form="formId" :disabled="props.disabled"> Uložit a zavřít </Button>
    </div>
</template>
