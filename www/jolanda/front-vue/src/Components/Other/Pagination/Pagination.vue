<script setup>
import { ref, watch, computed } from 'vue';
import Button from '@/Components/Inputs/Button.vue';

const props = defineProps({
    totalItems: {
        type: Number,
        required: true
    },
    itemsPerPage: {
        type: Number,
        required: true
    },
    currentPage: {
        type: Number,
        default: 1
    }
});

const emit = defineEmits(['update:currentPage']);

const currentPage = ref(props.currentPage);

const totalPages = computed(() => {
    return Math.ceil(props.totalItems / props.itemsPerPage);
});

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        emit('update:currentPage', currentPage.value);
    }
};

watch(() => props.currentPage, (newPage) => {
    if (newPage > 0 && newPage <= totalPages.value) {
        currentPage.value = newPage;
    }
});
</script>

<template>
    <div class="pagination">
        <Button
            v-if="currentPage > 1"
            @click="changePage(1)"
            variant="default"
            size="small"
            class="page-button"
        >
            1
        </Button>

        <div v-if="currentPage > 3" class="dots">...</div>

        <Button
            v-if="currentPage > 2"
            @click="changePage(currentPage - 1)"
            variant="default"
            size="small"
            class="page-button"
        >
            {{ currentPage - 1 }}
        </Button>

        <Button
            class="active page-button"
            variant="green"
            size="small"
        >
            {{ currentPage }}
        </Button>

        <Button
            v-if="currentPage < totalPages - 1"
            @click="changePage(currentPage + 1)"
            variant="default"
            size="small"
            class="page-button"
        >
            {{ currentPage + 1 }}
        </Button>

        <div v-if="currentPage < totalPages - 2" class="dots">...</div>

        <Button
            v-if="currentPage < totalPages"
            @click="changePage(totalPages)"
            variant="default"
            size="small"
            class="page-button"
        >
            {{ totalPages }}
        </Button>
    </div>
</template>

<style scoped>
.pagination {
    display: flex;
    gap: 2px;
    align-items: center;
}

.page-button{
    border-radius: 4px;
    padding: 8px 14px;
}

button.active {
    font-weight: bold;
}

.dots{
    padding: 0px 5px;
    color: #9d9ea1;
    min-height: 33px;
    display: flex;
    justify-items: end;
    line-height: 1;
    align-items: end;
}
</style>
