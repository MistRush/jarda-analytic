<script setup>



const props = defineProps({
    docs: Array,
});

const emit = defineEmits(['setCurrentDocument']);

</script>

<template>
    <div class="helpbar-list-item" v-for="doc in docs" :key="doc.id" @click="emit('setCurrentDocument', doc.id)">
        <div class="item-title">{{ doc.title }}</div>
        <div class="item-tags" :title="doc.title">
            <div class="tags-list">{{ doc.tags }}</div>
        </div>
        <hr />
    </div>
</template>

<style scoped>
    .helpbar-list-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 8px 5px;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        overflow: hidden;
        width: 100%;

        &:hover {
            background: rgba(0,0,0,0.1);
        }

        .item-title {
            flex-basis: 70%;
            font-weight: 600;
        }
        .item-tags {
            line-height: 0.93rem;
            flex-basis: 30%;
            opacity: 0.8;
            font-size: 9px;
            white-space: nowrap;
            max-width: 95% !important;
            padding-left: 1px;

            .tags-list {
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
</style>