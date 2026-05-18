<script setup>
import { IconProps, useIcon } from "./useIcon.js";

const props = defineProps(IconProps(18, 18));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 18 18" fill="none" :style="{ color: color }">
        <path d="M6 13.5C6.82843 13.5 7.5 14.1716 7.5 15C7.5 15.8284 6.82843 16.5 6 16.5C5.17157 16.5 4.5 15.8284 4.5 15C4.5 14.1716 5.17157 13.5 6 13.5Z" fill="currentColor" />
        <path d="M6 7.5C6.82843 7.5 7.5 8.17157 7.5 9C7.5 9.82843 6.82843 10.5 6 10.5C5.17157 10.5 4.5 9.82843 4.5 9C4.5 8.17157 5.17157 7.5 6 7.5Z" fill="currentColor" />
        <path d="M6 1.5C6.82843 1.5 7.5 2.17157 7.5 3C7.5 3.82843 6.82843 4.5 6 4.5C5.17157 4.5 4.5 3.82843 4.5 3C4.5 2.17157 5.17157 1.5 6 1.5Z" fill="currentColor" />
        <path d="M12 13.5C12.8284 13.5 13.5 14.1716 13.5 15C13.5 15.8284 12.8284 16.5 12 16.5C11.1716 16.5 10.5 15.8284 10.5 15C10.5 14.1716 11.1716 13.5 12 13.5Z" fill="currentColor" />
        <path d="M12 7.5C12.8284 7.5 13.5 8.17157 13.5 9C13.5 9.82843 12.8284 10.5 12 10.5C11.1716 10.5 10.5 9.82843 10.5 9C10.5 8.17157 11.1716 7.5 12 7.5Z" fill="currentColor" />
        <path d="M12 1.5C12.8284 1.5 13.5 2.17157 13.5 3C13.5 3.82843 12.8284 4.5 12 4.5C11.1716 4.5 10.5 3.82843 10.5 3C10.5 2.17157 11.1716 1.5 12 1.5Z" fill="currentColor" />
    </svg>
</template>
