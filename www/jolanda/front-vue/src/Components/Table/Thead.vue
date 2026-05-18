<script setup>

</script>

<template>
    <thead class="text-xs text-gray-800 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
        <slot></slot>
    </thead>
</template>

<style scoped>
    thead{
        border-radius: 10px 10px 0px 0px;
        background: var(--color-white);
        height: 30px;
        width: 100%;
    }
</style>