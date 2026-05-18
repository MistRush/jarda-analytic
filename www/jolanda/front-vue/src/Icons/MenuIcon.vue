<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(24,24));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 24 24" fill="none" :style="{color: color}">
        <path d="M3 6H21V8H3V6Z" fill="currentColor"/>
        <path d="M3 11H21V13H3V11Z" fill="currentColor"/>
        <path d="M3 16H21V18H3V16Z" fill="currentColor"/>
    </svg>
</template>
