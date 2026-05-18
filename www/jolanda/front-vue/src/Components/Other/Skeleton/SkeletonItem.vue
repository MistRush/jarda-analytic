<script setup>
 const props = defineProps({
     width: {
         type: Number,
         default: 50,
     }
 })
</script>

<template>
    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 mb-4" :style="{width: width + 'px'}"></div>
</template>