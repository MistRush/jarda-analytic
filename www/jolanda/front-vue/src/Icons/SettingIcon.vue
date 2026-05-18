<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(19,19));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 19 19" fill="none" :style="{color: color}">
        <path d="M9.02498 16.15V11.4H10.45V13.0625H16.15V14.4875H10.45V16.15H9.02498ZM2.84998 14.4875V13.0625H7.59998V14.4875H2.84998ZM5.69998 11.875V10.2125H2.84998V8.78748H5.69998V7.12498H7.12498V11.875H5.69998ZM8.54998 10.2125V8.78748H16.15V10.2125H8.54998ZM11.4 7.59998V2.84998H12.825V4.51248H16.15V5.93748H12.825V7.59998H11.4ZM2.84998 5.93748V4.51248H10.45V5.93748H2.84998Z" fill="currentColor"/>
    </svg>
</template>