<script setup>
    const props = defineProps({
        colspan: Number
    });
</script>

<template>
    <td :colspan="colspan" scope="row">
        <slot></slot>
    </td>
</template>

<style scoped>
    td{
        border-right: 1px dashed var(--color-outline);
        padding: 4px 6px;
        vertical-align: middle;
        height: 100%;
    }
</style>