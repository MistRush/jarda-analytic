<script setup>
import { inject, onMounted, onUnmounted, toRef, useId } from "vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: undefined,
    },
    name: {
        type: String,
        default: undefined,
    }
});

const id = props.name || useId();
const registerTab = inject("registerTab", null);
const unregisterTab = inject("unregisterTab", null);
const activeTab = inject("activeTab", null);

const reactiveTitle = toRef(props, "title");

onMounted(() => {
    if (registerTab) {
        registerTab(id, reactiveTitle, props.icon);
    }
});

onUnmounted(() => {
    if (unregisterTab) {
        unregisterTab(id);
    }
});
</script>

<template>
    <section :id="id" class="tab-content" v-show="activeTab === id">
        <slot />
    </section>
</template>

<style scoped>
.tab-content {
    height: 100%;
    width: 100%;
}
</style>
