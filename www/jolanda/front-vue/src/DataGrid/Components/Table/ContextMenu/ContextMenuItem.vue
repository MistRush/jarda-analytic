<script setup>
import { computed, inject } from "vue";
import ContextMenuSubMenu from "./ContextMenuSubMenu.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const dataGridState = inject("dataGridState", null);
const theme = inject("__dataGrid_theme", null);

const hasSubMenu = computed(() => {
    return props.item.subItems && props.item.subItems.length > 0;
});

const handleClick = (event) => {
    if (typeof props.item.onClick === "string") {
        eval(props.item.onClick);
    } else if (typeof props.item.onClick === "function") {
        props.item.onClick(dataGridState?.grid);
    }
};
</script>

<template>
    <li
        @click="handleClick"
        v-if="item.visibility"
        :class="{
            submenu: hasSubMenu,
            oldTheme: theme === 'old',
            newTheme: theme === 'new',
        }"
    >
        {{ item.label }}
        <ContextMenuSubMenu v-if="hasSubMenu" :items="item.subItems" />
    </li>
</template>

<style scoped>
.newTheme:not(.dropdown) {
    &.submenu {
        position: relative;

        &:after {
            position: absolute;
            content: "";
            top: 50%;
            transform: translateY(-50%);
            right: 10px;
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 5px solid #000;
        }
    }

    & {
        padding: 6px;
        padding-left: 10px;
        padding-right: 10px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        font-weight: 500;
        border-radius: var(--radius-sm);

        &:not(:first-of-type) {
            border-top: 1px solid var(--color-outline);
        }

        &:hover {
            background: color-mix(in srgb, var(--color-primary-200) 80%, transparent);
        }
    }

    &:hover :deep(.dropdown) {
        display: block;
    }
}

.oldTheme:not(.dropdown) {
    &.submenu {
        position: relative;

        &:after {
            position: absolute;
            content: "";
            top: 50%;
            transform: translateY(-50%);
            right: 10px;
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 5px solid #000;
        }
    }

    & {
        padding: 3px;
        padding-left: 10px;
        cursor: pointer;
        border-radius: 0;
        font-size: 12px;
        position: relative;

        &:not(:first-of-type) {
            border-top: 1px solid rgba(178, 178, 178, 0.7);
        }

        &:hover {
            color: white;
            background: #1ab156;
        }
    }

    &:hover :deep(.dropdown) {
        display: block;
    }
}
</style>

<style>
.dark-theme {
    .dataTable-context.newTheme {
        li {
            color: white !important;

            &:hover {
                background: color-mix(in srgb, var(--color-medium) 50%, transparent);
            }
        }

        li:not(:first-of-type) {
            border-top: 1px solid var(--color-dark) !important;

            &.submenu::after {
                border-left-color: white !important;
            }
        }
    }
}
</style>
