<script setup>
    const props = defineProps({
        columns: {
            type: []
        }
    })
</script>

<template>
    <colgroup>
        <col v-for="(column, index) in props.columns" :style="{ width: column.width }" :key="index"/>
    </colgroup>
</template>