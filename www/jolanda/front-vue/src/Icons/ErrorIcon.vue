<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(15,15));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 9 9" fill="none" :style="{color: color}">
        <g clip-path="url(#clip0_187_3370)">
            <path d="M8.76923 7.30173L1.71591 0.248411C1.4083 -0.0592035 0.909578 -0.0592035 0.602444 0.248411L0.230711 0.619567C-0.0769037 0.927278 -0.0769037 1.426 0.230711 1.73313L7.28403 8.78645C7.59174 9.09406 8.09046 9.09406 8.39759 8.78645L8.76875 8.41529C9.07694 8.10816 9.07694 7.60934 8.76923 7.30173Z" fill="white"/>
            <path d="M7.28403 0.2484L0.230711 7.30171C-0.0769037 7.60933 -0.0769037 8.10815 0.230711 8.41528L0.601867 8.78644C0.909578 9.09405 1.4083 9.09405 1.71543 8.78644L8.76923 1.7336C9.07694 1.42599 9.07694 0.927267 8.76923 0.620133L8.39807 0.248977C8.09046 -0.0592145 7.59174 -0.0592145 7.28403 0.2484Z" fill="white"/>
        </g>
        <defs>
            <clipPath id="clip0_187_3370">
                <rect width="9" height="9" fill="white"/>
            </clipPath>
        </defs>
    </svg>
</template>