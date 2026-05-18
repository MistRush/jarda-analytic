<script setup>
import ContextMenuItem from "./ContextMenuItem.vue";
import { inject } from "vue";

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});
const theme = inject("__dataGrid_theme", null);
</script>

<template>
    <ul
        class="dropdown"
        :class="{
            oldTheme: theme === 'old',
            newTheme: theme === 'new',
        }"
    >
        <ContextMenuItem v-for="(subItem, index) in items" :key="index" :item="subItem" />
    </ul>
</template>

<style scoped>
.newTheme {
    &:not(li) {
        border-radius: var(--radius-lg);
        display: none;
        position: absolute;
        top: -1px;
        left: 100%;
        width: 240px;
        border: 1px solid var(--color-outline);
        background: var(--color-white);
        box-shadow: 0 10px 30px 3px rgba(5, 16, 55, 0.15);
        padding: 5px;
        list-style: none;

        li {
            color: var(--color-font);
        }
    }
}

.oldTheme {
    &:not(li) {
        display: none;
        position: absolute;
        top: -1px;
        left: 100%;
        width: 200px;
        border: 1px solid #b2b2b2;
        background: #f9f9f9;
        box-shadow: 3px 3px 2px rgba(140, 140, 140, 0.15);
        padding: 0;
        list-style: none;
        li {
            color: #1c293b;
            &:hover {
                color: white;
            }
        }
    }
}
</style>

<style>
.dark-theme {
    .dataTable-context.newTheme {
        .dropdown:not(li) {
            background: var(--color-dark-bg);
            border-color: var(--color-font-700);
        }
    }
}
</style>
