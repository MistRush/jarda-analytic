<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(3,16));

const { color } = useIcon(props);
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 15 15" fill="none" :style="{color: color}">
    <path d="M9.33448 2.20692C9.33448 2.27658 9.32973 2.34625 9.32182 2.4175L8.53806 9.29233C8.47632 9.82116 8.02982 10.2186 7.4994 10.2186C6.96898 10.2186 6.52248 9.82116 6.46073 9.29233L5.67698 2.4175C5.55348 1.32817 6.40373 0.375 7.4994 0.375C8.52382 0.375 9.33448 1.20783 9.33448 2.20692Z" fill="currentColor"/>
    <path d="M7.50016 14.6251C8.35186 14.6251 9.04231 13.9346 9.04231 13.0829C9.04231 12.2312 8.35186 11.5408 7.50016 11.5408C6.64845 11.5408 5.95801 12.2312 5.95801 13.0829C5.95801 13.9346 6.64845 14.6251 7.50016 14.6251Z" fill="currentColor"/>
  </svg>
</template>