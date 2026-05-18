<script setup>
const props = defineProps({

});


</script>

<template>
    <div class="grid-stack-item" gs-w="12" gs-h="auto" v-bind="$attrs">
        <div class="grid-stack-item-content">
            <div>
                <slot />
            </div>
        </div>
    </div>
</template>