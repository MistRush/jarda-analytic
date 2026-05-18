<script setup>
import { IconProps, useIcon } from "@/Icons/useIcon.js";

const props = defineProps(IconProps());

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 23 25" fill="none" :style="{color: color}">
        <path d="M13.5546 17.8716H5.8984V14.356H13.5546C15.1701 14.356 16.4843 13.0417 16.4843 11.4263C16.4843 9.81087 15.1701 8.49661 13.5546 8.49661H6.91402V11.3494L0 6.7388L6.91402 2.12817V4.98099H13.5546C17.1086 4.98099 20 7.87235 20 11.4263C20 14.9802 17.1086 17.8716 13.5546 17.8716Z" fill="currentColor"/>
    </svg>
</template>