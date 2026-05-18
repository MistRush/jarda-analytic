<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(3,16));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 3 16" fill="none" :style="{color: color}">
        <path d="M0.333659 10.2909C0.341945 10.8336 0.785231 11.2686 1.32795 11.2686C1.87066 11.2686 2.31395 10.8294 2.32223 10.2909L2.65366 1.35886C2.67438 1.01914 2.55009 0.687716 2.30981 0.430858C2.05295 0.157429 1.69666 0 1.32795 0C0.959232 0 0.602946 0.157429 0.346088 0.430858C0.105802 0.687716 -0.0184842 1.01914 0.00223007 1.35886L0.333659 10.2909Z" fill="currentColor"/>
        <path d="M1.32804 15.9085C2.06021 15.9085 2.65375 15.315 2.65375 14.5828C2.65375 13.8506 2.06021 13.2571 1.32804 13.2571C0.595863 13.2571 0.00231934 13.8506 0.00231934 14.5828C0.00231934 15.315 0.595863 15.9085 1.32804 15.9085Z" fill="currentColor"/>
    </svg>
</template>