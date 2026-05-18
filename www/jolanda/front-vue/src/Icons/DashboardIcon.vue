<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(18,18));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 18 18" fill="none" :style="{color: color}">
        <g clip-path="url(#clip0_2079_1031)">
            <path d="M16.4955 0H11.2628C10.4319 0 9.7583 0.673594 9.7583 1.50451V6.73721C9.7583 7.56813 10.4319 8.24172 11.2628 8.24172H16.4955C17.3264 8.24172 18 7.56813 18 6.73721V1.50451C18 0.673594 17.3264 0 16.4955 0Z" fill="var(--color-icon-secondary)"/>
            <path d="M6.73721 0H1.50451C0.673594 0 0 0.673594 0 1.50451V6.73721C0 7.56813 0.673594 8.24172 1.50451 8.24172H6.73721C7.56813 8.24172 8.24172 7.56813 8.24172 6.73721V1.50451C8.24172 0.673594 7.56813 0 6.73721 0Z" fill="currentColor"/>
            <path d="M16.4955 9.7583H11.2628C10.4319 9.7583 9.7583 10.4319 9.7583 11.2628V16.4955C9.7583 17.3264 10.4319 18 11.2628 18H16.4955C17.3264 18 18 17.3264 18 16.4955V11.2628C18 10.4319 17.3264 9.7583 16.4955 9.7583Z" fill="var(--color-icon-secondary)"/>
            <path d="M6.73721 9.7583H1.50451C0.673594 9.7583 0 10.4319 0 11.2628V16.4955C0 17.3264 0.673594 18 1.50451 18H6.73721C7.56813 18 8.24172 17.3264 8.24172 16.4955V11.2628C8.24172 10.4319 7.56813 9.7583 6.73721 9.7583Z" fill="var(--color-icon-secondary)"/>
        </g>
        <defs>
            <clipPath id="clip0_2079_1031">
                <rect width="18" height="18" fill="white"/>
            </clipPath>
        </defs>
    </svg>
</template>