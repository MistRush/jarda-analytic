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
    gap: {
        type: [Number, String],
        default: 6
    }
});

// Mapování čísel na třídy pro grid včetně všech breakpointů
const gridColsClasses = {
    1: {
        base: 'grid-cols-1',
        sm: 'sm:grid-cols-1',
        md: 'md:grid-cols-1',
        lg: 'lg:grid-cols-1',
        xl: 'xl:grid-cols-1',
        '2xl': '2xl:grid-cols-1'
    },
    2: {
        base: 'grid-cols-2',
        sm: 'sm:grid-cols-2',
        md: 'md:grid-cols-2',
        lg: 'lg:grid-cols-2',
        xl: 'xl:grid-cols-2',
        '2xl': '2xl:grid-cols-2'
    },
    3: {
        base: 'grid-cols-3',
        sm: 'sm:grid-cols-3',
        md: 'md:grid-cols-3',
        lg: 'lg:grid-cols-3',
        xl: 'xl:grid-cols-3',
        '2xl': '2xl:grid-cols-3'
    },
    4: {
        base: 'grid-cols-4',
        sm: 'sm:grid-cols-4',
        md: 'md:grid-cols-4',
        lg: 'lg:grid-cols-4',
        xl: 'xl:grid-cols-4',
        '2xl': '2xl:grid-cols-4'
    },
    6: {
        base: 'grid-cols-6',
        sm: 'sm:grid-cols-6',
        md: 'md:grid-cols-6',
        lg: 'lg:grid-cols-6',
        xl: 'xl:grid-cols-6',
        '2xl': '2xl:grid-cols-6'
    },
    8: {
        base: 'grid-cols-8',
        sm: 'sm:grid-cols-8',
        md: 'md:grid-cols-8',
        lg: 'lg:grid-cols-8',
        xl: 'xl:grid-cols-8',
        '2xl': '2xl:grid-cols-8'
    },
    12: {
        base: 'grid-cols-12',
        sm: 'sm:grid-cols-12',
        md: 'md:grid-cols-12',
        lg: 'lg:grid-cols-12',
        xl: 'xl:grid-cols-12',
        '2xl': '2xl:grid-cols-12'
    }
};

// Mapování čísel na třídy pro gap včetně všech breakpointů
const gapClasses = {
    0: {
        base: 'gap-0',
        sm: 'sm:gap-0',
        md: 'md:gap-0',
        lg: 'lg:gap-0',
        xl: 'xl:gap-0',
        '2xl': '2xl:gap-0'
    },
    4: {
        base: 'gap-4',
        sm: 'sm:gap-4',
        md: 'md:gap-4',
        lg: 'lg:gap-4',
        xl: 'xl:gap-4',
        '2xl': '2xl:gap-4'
    },
    6: {
        base: 'gap-6',
        sm: 'sm:gap-6',
        md: 'md:gap-6',
        lg: 'lg:gap-6',
        xl: 'xl:gap-6',
        '2xl': '2xl:gap-6'
    },
    8: {
        base: 'gap-8',
        sm: 'sm:gap-8',
        md: 'md:gap-8',
        lg: 'lg:gap-8',
        xl: 'xl:gap-8',
        '2xl': '2xl:gap-8'
    }
};

// Vytvoříme třídy pro grid
const gridClasses = computed(() => {
    const classes = ['grid'];
    
    // Přidáme gap
    const gapClass = gapClasses[props.gap] || gapClasses[4];
    classes.push(gapClass.base);
    
    // Základní počet sloupců
    const colClass = gridColsClasses[props.cols] || gridColsClasses[12];
    classes.push(colClass.base);
    
    // Responzivní breakpointy
    if (props.sm && gridColsClasses[props.sm]) classes.push(gridColsClasses[props.sm].sm);
    if (props.md && gridColsClasses[props.md]) classes.push(gridColsClasses[props.md].md);
    if (props.lg && gridColsClasses[props.lg]) classes.push(gridColsClasses[props.lg].lg);
    if (props.xl && gridColsClasses[props.xl]) classes.push(gridColsClasses[props.xl].xl);
    if (props['2xl'] && gridColsClasses[props['2xl']]) classes.push(gridColsClasses[props['2xl']]['2xl']);
    
    return classes;
});
</script>

<template>
    <div :class="gridClasses">
        <slot></slot>
    </div>
</template>
