<script setup>

</script>

<template>
    <div class="editor-subsection dark:bg-dark! border-1 border-outline dark:border-dark">
        <div v-if="$slots.title" class="header border-b border-outline dark:border-medium">
            <div>
                <h5 class="font-semibold text-[1.077rem]">
                    <slot name="title"></slot>
                </h5>
            </div>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.editor-subsection {
    margin-bottom: 1.5rem;
    border-radius: 6px;
    background: rgba(236, 242, 255, 0.5);
    display: flex;
    flex-direction: column;
}

.grid-stack-item-content {
    margin-bottom: 1.5rem;
}

.content {
    padding: 11px 15px;
    flex-grow: 1;
}

.header {
    padding: 11px 15px 11px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.editor-subsection.collapsible .header {
    cursor: pointer;
}
</style>