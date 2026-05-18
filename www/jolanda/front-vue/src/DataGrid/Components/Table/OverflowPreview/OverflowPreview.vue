<script setup>
const props = defineProps({
    overflowPreview: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <Teleport to="#vue_teleport">
        <div class="overflow-preview bg-white dark:bg-dark-bg" v-show="overflowPreview.show" :style="{ top: overflowPreview.position.y + 'px', left: overflowPreview.position.x + 'px' }">
            <div v-if="typeof overflowPreview.content === 'string'" class="overflow-preview__content" v-html="overflowPreview.content"></div>
            <div v-else class="overflow-preview__content">
                <component :is="overflowPreview.content"></component>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.overflow-preview {
    position: absolute;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3411764706);
    z-index: 500;
    pointer-events: none;
    transform: translate(-50%, -50%);
    padding: 5px;
    font-size: 13px;
    max-width: 80vw;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
</style>
