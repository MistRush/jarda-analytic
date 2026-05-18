<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps(IconProps(18,18));

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 19 19" fill="none" :style="{color: color}">
        <g clip-path="url(#clip0_2079_1153)">
            <path d="M10.3411 0C4.62592 0 0 4.62514 0 10.3411C0 10.6488 0.24945 10.8983 0.557161 10.8983H10.3411C10.6488 10.8983 10.8983 10.6488 10.8983 10.3411V0.557161C10.8983 0.24945 10.6488 0 10.3411 0Z" fill="currentColor"/>
            <path d="M6.37711 12.5092C6.27936 12.3307 6.09199 12.2197 5.88849 12.2197H2.59339C2.41604 12.2197 2.24924 12.3042 2.14429 12.4472C2.03931 12.5902 2.00873 12.7745 2.06183 12.9438C3.11125 16.2862 6.13812 18.7712 9.78394 19.0001V14.8238C8.35396 14.6464 7.0807 13.7937 6.37711 12.5092Z" fill="var(--color-icon-secondary)"/>
            <path d="M12.9436 2.06192C12.7745 2.00886 12.59 2.03947 12.447 2.14438C12.304 2.24936 12.2196 2.41613 12.2196 2.59352V5.88858C12.2196 6.09205 12.3306 6.27937 12.5091 6.37716C13.7935 7.08083 14.6462 8.35405 14.8236 9.78399H19C18.7705 6.13027 16.2782 3.10889 12.9436 2.06192Z" fill="var(--color-icon-secondary)"/>
            <path d="M14.8244 10.8982C14.5717 12.9447 12.9448 14.5715 10.8983 14.8243V18.9996C15.2458 18.7259 18.7256 15.2516 18.9996 10.8982H14.8244Z" fill="var(--color-icon-secondary)"/>
        </g>
        <defs>
            <clipPath id="clip0_2079_1153">
                <rect width="19" height="19" fill="white"/>
            </clipPath>
        </defs>
    </svg>
</template>