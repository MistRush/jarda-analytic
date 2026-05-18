<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(18,18));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 21 21" fill="none" :style="{color: color}">
        <path d="M10.5005 0.525391C6.23746 0.525391 2.77246 3.99039 2.77246 8.25339C2.77246 14.8054 10.5005 20.4754 10.5005 20.4754C10.5005 20.4754 18.2285 14.8054 18.2285 8.25339C18.2285 3.99039 14.7635 0.525391 10.5005 0.525391ZM10.5005 11.6134C8.65246 11.6134 7.14046 10.1014 7.14046 8.25339C7.14046 6.40539 8.65246 4.89339 10.5005 4.89339C12.3485 4.89339 13.8605 6.40539 13.8605 8.25339C13.8605 10.1014 12.3485 11.6134 10.5005 11.6134Z" fill="currentColor"/>
    </svg>
</template>

