<script setup>
import { inject, onMounted, onUnmounted } from "vue";
import ContextMenuItem from "./ContextMenuItem.vue";

const props = defineProps({
    contextMenu: {
        type: Object,
        required: true,
    },
});

const theme = inject("__dataGrid_theme", null);

const handleClickAnywhere = () => {
    props.contextMenu.show(false);
};

onMounted(() => {
    document.addEventListener("click", handleClickAnywhere);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickAnywhere);
});
</script>

<template>
    <Teleport to="#vue_teleport">
        <div
            :class="{
                oldTheme: theme === 'old',
                newTheme: theme === 'new',
            }"
            class="dataTable-context"
            @click="handleClickAnywhere"
            :style="{ left: contextMenu.position.x + 'px', top: contextMenu.position.y + 'px' }"
        >
            <ul class="items">
                <ContextMenuItem v-for="(item, index) in contextMenu.items" :key="index" :item="item" />
            </ul>
        </div>
    </Teleport>
</template>

<style scoped>
.newTheme:not(li) {
    border-radius: var(--radius-lg);
    position: absolute;
    border: 1px solid var(--color-outline);
    width: 250px;
    background: var(--color-white);
    box-shadow: 0 10px 30px 3px rgba(5, 16, 55, 0.15);
    z-index: 555;
    padding: 5px;

    .items {
        list-style: none;
        margin: 0;
        font-size: 12px;
        padding: 0;
    }
}

.oldTheme:not(li) {
    position: absolute;
    border: 1px solid #b2b2b2;
    width: 250px;
    background: #f9f9f9;
    box-shadow: 3px 3px 2px rgba(140, 140, 140, 0.15);
    z-index: 555;

    .items {
        list-style: none;
        margin: 0;
        font-size: 17px;
        padding: 0;
    }
}
</style>

<style>
.dark-theme {
    .dataTable-context {
        &.newTheme:not(li) {
            background: var(--color-dark-bg);
            border-color: var(--color-font-700);
        }
    }
}
</style>
