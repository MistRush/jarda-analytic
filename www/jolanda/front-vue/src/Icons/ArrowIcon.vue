<script setup>
import {IconProps, useIcon} from './useIcon.js'

const props = defineProps({
    ...IconProps(16, 16),
    direction: {
        type: String,
        default: 'bottom',
    }
});

const rotation = {
    'right': 'rotate(180deg)',
    'bottom': 'rotate(-90deg)',
    'top': 'rotate(90deg)',
    'left': 'rotate(0deg)'
}

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 16 16" fill="none" style="transition: transform .3s" :style="{color: color, transform: rotation[direction]}">
        <path d="M10.3541 2.64628C10.4006 2.69271 10.4375 2.74786 10.4627 2.80856C10.4878 2.86926 10.5008 2.93432 10.5008 3.00003C10.5008 3.06573 10.4878 3.1308 10.4627 3.1915C10.4375 3.2522 10.4006 3.30734 10.3541 3.35378L5.70727 8.00003L10.3541 12.6463C10.448 12.7401 10.5007 12.8673 10.5007 13C10.5007 13.1327 10.448 13.26 10.3541 13.3538C10.2603 13.4476 10.1331 13.5003 10.0004 13.5003C9.86771 13.5003 9.74046 13.4476 9.64664 13.3538L4.64664 8.35378C4.60015 8.30734 4.56328 8.2522 4.53811 8.1915C4.51295 8.1308 4.5 8.06573 4.5 8.00003C4.5 7.93432 4.51295 7.86926 4.53811 7.80856C4.56328 7.74786 4.60015 7.69271 4.64664 7.64628L9.64664 2.64628C9.69308 2.59979 9.74822 2.56291 9.80892 2.53775C9.86962 2.51258 9.93469 2.49963 10.0004 2.49963C10.0661 2.49963 10.1312 2.51258 10.1919 2.53775C10.2526 2.56291 10.3077 2.59979 10.3541 2.64628Z" fill="currentColor"/>
    </svg>
</template>