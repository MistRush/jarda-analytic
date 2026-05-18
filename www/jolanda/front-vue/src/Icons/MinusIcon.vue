<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(14,2));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 14 2" fill="none" :style="{color: color}">
        <path d="M12.3633 1.84328H1.6367C1.17081 1.84328 0.793304 1.46578 0.793304 0.999889C0.793304 0.533998 1.17081 0.156494 1.6367 0.156494H12.3633C12.8292 0.156494 13.2067 0.533998 13.2067 0.999889C13.2067 1.46578 12.8292 1.84328 12.3633 1.84328Z" fill="currentColor"/>
    </svg>
</template>