<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(15,15));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 9 9" fill="none" :style="{color: color}">
        <g clip-path="url(#clip0_187_6017)">
            <path d="M4.49991 6.78259C3.88656 6.78259 3.38757 7.28158 3.38757 7.89493C3.44349 9.36857 5.55656 9.36818 5.61225 7.89491C5.61225 7.28158 5.11325 6.78259 4.49991 6.78259Z" fill="currentColor"/>
            <path d="M5.61175 0.513662C5.05977 -0.171059 3.94044 -0.171394 3.38823 0.513698C3.11171 0.842894 2.99562 1.27449 3.06974 1.69781C3.29074 2.96054 3.60264 4.74273 3.74261 5.54312C3.89945 6.38561 5.1006 6.38535 5.25724 5.54316L5.93026 1.69781C6.00437 1.27451 5.88828 0.842894 5.61175 0.513662Z" fill="currentColor"/>
        </g>
        <defs>
            <clipPath id="clip0_187_6017">
                <rect width="9" height="9" fill="white"/>
            </clipPath>
        </defs>
    </svg>
</template>