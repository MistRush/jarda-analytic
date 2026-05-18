<script setup>
import { computed } from 'vue';

const props = defineProps({
    // Základní počet sloupců (pro nejmenší breakpoint)
    cols: {
        type: Number,
        default: 12,
        validator: value => value > 0 && value <= 12
    },
    // Breakpoint props
    sm: {
        type: Number,
        validator: value => value > 0 && value <= 12
    },
    md: {
        type: Number,
        validator: value => value > 0 && value <= 12
    },
    lg: {
        type: Number,
        validator: value => value > 0 && value <= 12
    },
    xl: {
        type: Number,
        validator: value => value > 0 && value <= 12
    },
    "2xl": {
        type: Number,
        validator: value => value > 0 && value <= 12
    },
    // Offset props
    offset: {
        type: Number,
        default: 0,
        validator: value => value >= 0 && value < 12
    },
    offsetSm: {
        type: Number,
        validator: value => value >= 0 && value < 12
    },
    offsetMd: {
        type: Number,
        validator: value => value >= 0 && value < 12
    },
    offsetLg: {
        type: Number,
        validator: value => value >= 0 && value < 12
    },
    offsetXl: {
        type: Number,
        validator: value => value >= 0 && value < 12
    },
    offset2xl: {
        type: Number,
        validator: value => value >= 0 && value < 12
    },

    styled: {
        type: Boolean,
        default: false
    }

});

// Mapování čísel na třídy pro span včetně všech breakpointů
const spanClasses = {
    1: {
        base: 'col-span-1',
        sm: 'sm:col-span-1',
        md: 'md:col-span-1',
        lg: 'lg:col-span-1',
        xl: 'xl:col-span-1',
        '2xl': '2xl:col-span-1'
    },
    2: {
        base: 'col-span-2',
        sm: 'sm:col-span-2',
        md: 'md:col-span-2',
        lg: 'lg:col-span-2',
        xl: 'xl:col-span-2',
        '2xl': '2xl:col-span-2'
    },
    3: {
        base: 'col-span-3',
        sm: 'sm:col-span-3',
        md: 'md:col-span-3',
        lg: 'lg:col-span-3',
        xl: 'xl:col-span-3',
        '2xl': '2xl:col-span-3'
    },
    4: {
        base: 'col-span-4',
        sm: 'sm:col-span-4',
        md: 'md:col-span-4',
        lg: 'lg:col-span-4',
        xl: 'xl:col-span-4',
        '2xl': '2xl:col-span-4'
    },
    5: {
        base: 'col-span-5',
        sm: 'sm:col-span-5',
        md: 'md:col-span-5',
        lg: 'lg:col-span-5',
        xl: 'xl:col-span-5',
        '2xl': '2xl:col-span-5'
    },
    6: {
        base: 'col-span-6',
        sm: 'sm:col-span-6',
        md: 'md:col-span-6',
        lg: 'lg:col-span-6',
        xl: 'xl:col-span-6',
        '2xl': '2xl:col-span-6'
    },
    7: {
        base: 'col-span-7',
        sm: 'sm:col-span-7',
        md: 'md:col-span-7',
        lg: 'lg:col-span-7',
        xl: 'xl:col-span-7',
        '2xl': '2xl:col-span-7'
    },
    8: {
        base: 'col-span-8',
        sm: 'sm:col-span-8',
        md: 'md:col-span-8',
        lg: 'lg:col-span-8',
        xl: 'xl:col-span-8',
        '2xl': '2xl:col-span-8'
    },
    9: {
        base: 'col-span-9',
        sm: 'sm:col-span-9',
        md: 'md:col-span-9',
        lg: 'lg:col-span-9',
        xl: 'xl:col-span-9',
        '2xl': '2xl:col-span-9'
    },
    10: {
        base: 'col-span-10',
        sm: 'sm:col-span-10',
        md: 'md:col-span-10',
        lg: 'lg:col-span-10',
        xl: 'xl:col-span-10',
        '2xl': '2xl:col-span-10'
    },
    11: {
        base: 'col-span-11',
        sm: 'sm:col-span-11',
        md: 'md:col-span-11',
        lg: 'lg:col-span-11',
        xl: 'xl:col-span-11',
        '2xl': '2xl:col-span-11'
    },
    12: {
        base: 'col-span-12',
        sm: 'sm:col-span-12',
        md: 'md:col-span-12',
        lg: 'lg:col-span-12',
        xl: 'xl:col-span-12',
        '2xl': '2xl:col-span-12'
    }
};

// Mapování čísel na třídy pro offset včetně všech breakpointů
const offsetClasses = {
    0: {
        base: 'col-start-1',
        sm: 'sm:col-start-1',
        md: 'md:col-start-1',
        lg: 'lg:col-start-1',
        xl: 'xl:col-start-1',
        '2xl': '2xl:col-start-1'
    },
    1: {
        base: 'col-start-2',
        sm: 'sm:col-start-2',
        md: 'md:col-start-2',
        lg: 'lg:col-start-2',
        xl: 'xl:col-start-2',
        '2xl': '2xl:col-start-2'
    },
    2: {
        base: 'col-start-3',
        sm: 'sm:col-start-3',
        md: 'md:col-start-3',
        lg: 'lg:col-start-3',
        xl: 'xl:col-start-3',
        '2xl': '2xl:col-start-3'
    },
    3: {
        base: 'col-start-4',
        sm: 'sm:col-start-4',
        md: 'md:col-start-4',
        lg: 'lg:col-start-4',
        xl: 'xl:col-start-4',
        '2xl': '2xl:col-start-4'
    },
    4: {
        base: 'col-start-5',
        sm: 'sm:col-start-5',
        md: 'md:col-start-5',
        lg: 'lg:col-start-5',
        xl: 'xl:col-start-5',
        '2xl': '2xl:col-start-5'
    },
    6: {
        base: 'col-start-7',
        sm: 'sm:col-start-7',
        md: 'md:col-start-7',
        lg: 'lg:col-start-7',
        xl: 'xl:col-start-7',
        '2xl': '2xl:col-start-7'
    },
    8: {
        base: 'col-start-9',
        sm: 'sm:col-start-9',
        md: 'md:col-start-9',
        lg: 'lg:col-start-9',
        xl: 'xl:col-start-9',
        '2xl': '2xl:col-start-9'
    },
    11: {
        base: 'col-start-12',
        sm: 'sm:col-start-12',
        md: 'md:col-start-12',
        lg: 'lg:col-start-12',
        xl: 'xl:col-start-12',
        '2xl': '2xl:col-start-12'
    }
};

// Vytvoříme třídy pro sloupec
const colClasses = computed(() => {
    const classes = [];
    
    // Základní počet sloupců
    const spanClass = spanClasses[props.cols] || spanClasses[12];
    classes.push(spanClass.base);
    
    // Responzivní breakpointy pro span
    if (props.sm && spanClasses[props.sm]) classes.push(spanClasses[props.sm].sm);
    if (props.md && spanClasses[props.md]) classes.push(spanClasses[props.md].md);
    if (props.lg && spanClasses[props.lg]) classes.push(spanClasses[props.lg].lg);
    if (props.xl && spanClasses[props.xl]) classes.push(spanClasses[props.xl].xl);
    if (props['2xl'] && spanClasses[props['2xl']]) classes.push(spanClasses[props['2xl']]['2xl']);
    
    // Offset
    if (props.offset && offsetClasses[props.offset]) classes.push(offsetClasses[props.offset].base);
    if (props.offsetSm && offsetClasses[props.offsetSm]) classes.push(offsetClasses[props.offsetSm].sm);
    if (props.offsetMd && offsetClasses[props.offsetMd]) classes.push(offsetClasses[props.offsetMd].md);
    if (props.offsetLg && offsetClasses[props.offsetLg]) classes.push(offsetClasses[props.offsetLg].lg);
    if (props.offsetXl && offsetClasses[props.offsetXl]) classes.push(offsetClasses[props.offsetXl].xl);
    if (props.offset2xl && offsetClasses[props.offset2xl]) classes.push(offsetClasses[props.offset2xl]['2xl']);

    if(props.styled){
        classes.push('styled p-4 bh-white dark:bg-dark rounded-[11px]');
    }
    
    return classes;
});
</script>

<template>
    <div :class="colClasses" class="col">
        <slot></slot>
    </div>
</template>

<style scoped>
.col {
    &.styled {
        box-shadow: 0px 0px 44px 0px rgba(14, 11, 48, 0.13);
    }
}
</style>
