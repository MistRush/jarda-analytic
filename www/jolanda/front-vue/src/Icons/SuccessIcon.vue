<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(15,15));

const { color } = useIcon(props);
</script>

<template>
    <svg :width="props.width" :height="props.height" viewBox="0 0 8 6" fill="none" :style="{color: color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.09835 1.05774L3.07124 5.08474C2.95042 5.20555 2.79183 5.26636 2.63324 5.26636C2.47464 5.26636 2.31605 5.20555 2.19523 5.08474L0.181736 3.07124C-0.0605785 2.82904 -0.0605785 2.43743 0.181736 2.19523C0.423936 1.95292 0.815428 1.95292 1.05774 2.19523L2.63324 3.77073L6.22234 0.181736C6.46454 -0.0605785 6.85604 -0.0605785 7.09835 0.181736C7.34055 0.423936 7.34055 0.815428 7.09835 1.05774Z" fill="currentColor"/>
    </svg>
</template>