<script setup>
const props = defineProps({
    row: {
        type: Number
    }
})

const emit = defineEmits(['click']);
</script>

<template>
    <div class="relative dataGrid-row" @click="$emit('click', row)">
        <slot></slot>
    </div>
</template>

<style scoped>
    .dataGrid-row{
        font-size: 14px;
        font-weight: 400;
        height: 33px;

        &.odd{
            background: #f9fafc;
        }

        &.even{
            background: #eff2f9;
        }

        &:hover{
            background-color: rgba(102, 175, 97, .1) !important;
        }

        &.selected{
            background-color: rgba(36, 197, 134, .22);
        }
    }
</style>