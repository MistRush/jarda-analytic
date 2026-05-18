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
    padding: 10px 25px;
    font-size: 14px;
}
</style>