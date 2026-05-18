<script setup>
import Tooltip from "@/Components/Other/Tooltip.vue";

const props = defineProps({
    help: String,
});
</script>

<template>
    <Tooltip v-if="help" :text="help" class="ml-2">
        <Icon icon="question-mark" class="w-[12px] opacity-30" />
    </Tooltip>
</template>
