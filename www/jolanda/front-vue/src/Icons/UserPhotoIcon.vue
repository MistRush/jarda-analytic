<script setup>
import {ref} from 'vue';
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps({
    ...IconProps(40, 40),
    photoPath: {
        type: String,
        required: false,
    }
});

const imageError = ref(false)

const { color } = useIcon(props);
</script>

<template>
    <img v-if="photoPath && !imageError" :src="photoPath" :width="props.width" :height="props.height" alt="User image" @error="imageError=true">
    <svg v-else xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 40 40" fill="none" :style="{color: color}">
        <path d="M 20 0 C 8.972656 0 0 8.972656 0 20 C 0 31.027344 8.972656 40 20 40 C 31.027344 40 40 31.027344 40 20 C 40 8.972656 31.027344 0 20 0 Z M 20.128906 6.285156 C 24.234375 6.285156 27.566406 10.21875 27.566406 15.070312 C 27.566406 19.921875 24.234375 23.855469 20.128906 23.855469 C 16.019531 23.855469 12.691406 19.921875 12.691406 15.070312 C 12.691406 10.21875 16.019531 6.285156 20.128906 6.285156 Z M 20 37.570312 C 15.0625 37.570312 10.59375 35.523438 7.398438 32.234375 C 6.945312 31.765625 6.800781 31.078125 7.027344 30.46875 C 8.121094 27.558594 10.171875 25.117188 12.792969 23.515625 C 13.359375 23.171875 14.082031 23.238281 14.574219 23.683594 C 16.117188 25.074219 18.039062 25.90625 20.128906 25.90625 C 22.175781 25.90625 24.066406 25.105469 25.589844 23.761719 C 26.089844 23.324219 26.816406 23.265625 27.378906 23.621094 C 29.917969 25.21875 31.902344 27.621094 32.972656 30.46875 C 33.199219 31.078125 33.054688 31.765625 32.601562 32.234375 C 29.40625 35.523438 24.9375 37.570312 20 37.570312 Z M 20 37.570312"  fill="currentColor" />
    </svg>
</template>

<style scoped>
    img {
        max-width: v-bind(width + 'px');
        max-height: v-bind(height + 'px');
        border-radius: 50%;
        object-fit: cover;
    }
</style>