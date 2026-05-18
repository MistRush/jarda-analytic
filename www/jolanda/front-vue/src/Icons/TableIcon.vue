<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(19,19));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 19 19" fill="none" :style="{color: color}">
        <rect width="19" height="19" rx="3" fill="currentColor"/>
        <rect x="8" y="4" width="3" height="2" rx="0.5" fill="white"/>
        <rect x="8" y="7" width="3" height="2" rx="0.5" fill="white"/>
        <rect x="8" y="10" width="3" height="2" rx="0.5" fill="white"/>
        <rect x="8" y="13" width="3" height="2" rx="0.5" fill="white"/>
        <rect x="12" y="13" width="3.5" height="2" rx="0.5" fill="white"/>
        <rect x="12" y="10" width="3.5" height="2" rx="0.5" fill="white"/>
        <rect x="12" y="7" width="3.5" height="2" rx="0.5" fill="white"/>
        <rect x="12" y="4" width="3.5" height="2" rx="0.5" fill="white"/>
        <rect x="3.5" y="7" width="3.5" height="2" rx="0.5" fill="white"/>
        <rect x="3.5" y="4" width="3.5" height="2" rx="0.5" fill="white"/>
        <rect x="3.5" y="10" width="3.5" height="2" rx="0.5" fill="white"/>
        <rect x="3.5" y="13" width="3.5" height="2" rx="0.5" fill="white"/>
    </svg>
</template>