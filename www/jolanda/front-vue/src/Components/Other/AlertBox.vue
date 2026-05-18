<script setup>
import { computed } from 'vue';

const props = defineProps({
    variant: {
        type: String,
        default: 'info',
        validator: (value) => ['danger', 'success', 'warning', 'info'].includes(value)
    }
});

const variantClasses = {
    danger: {
        bg: 'bg-red-50',
        border: 'border-red-400',
        text: 'text-red-800',
        iconBg: 'bg-red-100'
    },
    success: {
        bg: 'bg-green-50',
        border: 'border-green-400',
        text: 'text-green-800',
        iconBg: 'bg-green-100'
    },
    neutral: {
        bg: 'bg-gray-50',
        border: 'border-gray-400',
        text: 'text-gray-800',
        iconBg: 'bg-gray-100'
    },
    warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-400',
        text: 'text-yellow-800',
        iconBg: 'bg-yellow-100'
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-400',
        text: 'text-blue-800',
        iconBg: 'bg-blue-100'
    }
};

const classes = computed(() => variantClasses[props.variant]);
</script>

<template>
    <div 
        :class="[
            classes.bg,
            'border-t-4',
            classes.border,
            'rounded-lg',
            classes.text,
            'px-4',
            'py-3',
            'shadow-md'
        ]"
        role="alert"
    >
        <div class="flex">
            <div class="py-1 mr-4" v-if="$slots.icon">
                <slot name="icon"></slot>
            </div>
            <div class="flex-1">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

