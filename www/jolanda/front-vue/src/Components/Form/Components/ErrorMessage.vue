<script setup>
const props = defineProps({
    error: [String, Boolean],
});
</script>

<template>
    <p v-if="typeof error === 'string' && error" class="error">
        <!--                <slot v-if="$slots.error" name="error" v-bind="{ error, label, name, hint, description, help }" />-->
        <slot v-if="$slots.error" name="error" v-bind="{ error, label, name }" />
        <template v-else>
            {{ error }}
        </template>
    </p>
</template>

<style scoped>
    .error{
        color: #fff;
        background-color: red;
        padding: 1px 8px 1px 8px;
        font-size: 12px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
    }
</style>