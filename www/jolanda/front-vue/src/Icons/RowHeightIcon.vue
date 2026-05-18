<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(16,16));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" :width="props.width" :height="props.height" :style="{color: color}">
        <path d="m0 0h48v48h-48z" fill="currentColor" fill-opacity=".01"/>
        <path d="m48 0h-48v48h48z" fill="currentColor" fill-opacity=".01"/>
        <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" >
            <path d="m16 35-6 6-6-6"/>
            <path d="m16 13-6-6-6 6"/>
            <path d="m10 7v34"/>
            <path d="m44 9h-22"/>
            <path d="m36 19h-14"/>
            <path d="m44 29h-22"/>
            <path d="m36 39h-14"/>
        </g>
    </svg>
</template>