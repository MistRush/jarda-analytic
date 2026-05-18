<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(15,15));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 17 17" fill="none" :style="color ? { color: color } : {}">
        <path d="M8.5 14.6087C8.04146 14.6087 7.66992 14.2372 7.66992 13.7786V3.22137C7.66992 2.76284 8.04146 2.3913 8.5 2.3913C8.95854 2.3913 9.33008 2.76284 9.33008 3.22137V13.7786C9.33008 14.2372 8.95854 14.6087 8.5 14.6087Z" fill="currentColor"/>
        <path d="M13.7785 9.33008H3.22119C2.76266 9.33008 2.39111 8.95854 2.39111 8.5C2.39111 8.04146 2.76266 7.66992 3.22119 7.66992H13.7785C14.237 7.66992 14.6085 8.04146 14.6085 8.5C14.6085 8.95854 14.237 9.33008 13.7785 9.33008Z" fill="currentColor"/>
    </svg>
</template>