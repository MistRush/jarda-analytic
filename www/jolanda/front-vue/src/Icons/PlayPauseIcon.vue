<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(24,24));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 24 24" :style="{ color: color }">
        <path fill="currentColor" d="M3 5v14l8-7m2 7h3V5h-3m5 0v14h3V5"/>
    </svg>
</template>