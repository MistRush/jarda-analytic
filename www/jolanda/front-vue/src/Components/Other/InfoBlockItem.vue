<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        default: null
    },
    emptyText: {
        type: String,
        default: '-'
    },
    variant: {
        type: String,
        default: 'default', // default, warning, success, danger
        validator: (value) => ['default', 'warning', 'success', 'danger'].includes(value)
    }
});

const variantClasses = {
    default: 'text-base',
    warning: 'text-base text-warning',
    success: 'text-base text-green-600',
    danger: 'text-base text-red-600'
};
</script>

<template>
    <div>
        <label class="block text-gray-400 text-sm font-medium mb-1">{{ label }}</label>
        <div :class="variantClasses[variant]">
            <slot>{{ value || emptyText }}</slot>
        </div>
    </div>
</template>

<style scoped>
/* Žádné specifické styly potřeba */
</style>
