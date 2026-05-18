<script setup>
import { inject, onMounted, onUnmounted, ref, useId, watch, provide } from "vue";
import { ContextMenuItem } from "@/DataGrid/js/ContextMenu/ContextMenuItem";
import { ContextMenu } from "@/DataGrid/js/ContextMenu/ContextMenu";

const props = defineProps({
    visibility: {
        type: Object,
        default: {
            header: true,
            context: true,
            row: true,
        },
    },
    label: String,
    icon: String,
    headerClass: String,
});

const emit = defineEmits(["click"]);

const item = ref(null);

const dataGrid = inject("dataGrid", null);
const parent = inject("dataGrid-action-item", null);

const id = useId();

provide("dataGrid-action-item", item);

if (!item.value) {
    if (!dataGrid.contextMenu) {
        dataGrid.contextMenu = new ContextMenu();
    }

    item.value = new ContextMenuItem({
        visibility: props.visibility?.context ?? true,
        id: id,
        label: props.label,
        onClick: (type) => {
            emit("click", type);
        },
        customProps: {
            header: {
                icon: props.icon,
                visibility: props.visibility?.header ?? true,
                class: props.headerClass,
            },
            row: props.visibility?.row ?? true,
        },
    });

    if (parent?.value) {
        parent.value.subItems.push(item.value);
    } else {
        dataGrid.contextMenu.items.push(item.value);
    }
}

onMounted(() => {
    if (parent?.value) {
        const exists = parent.value.subItems.find((i) => i.id === item.value.id);

        if (!exists) {
            parent.value.subItems.push(item.value);
        }
    } else {
        const exists = dataGrid.contextMenu.items.find((i) => i.id === item.value.id);

        if (!exists) {
            dataGrid.contextMenu.items.push(item.value);
        }
    }
});

onUnmounted(() => {
    if (parent?.value) {
        parent.value.subItems = parent.value.subItems.filter((i) => i.id !== item.value.id);
    } else {
        dataGrid.contextMenu.items = dataGrid.contextMenu.items.filter((i) => i.id !== item.value.id);
    }
});

watch(
    () => props.visibility,
    (newVal) => {
        item.value.visibility = newVal.context ?? true;
        item.value.customProps.header.visibility = newVal.header ?? true;
        item.value.customProps.row = newVal.row ?? true;
    },
);

watch(
    () => props.headerClass,
    (newVal) => {
        item.value.customProps.header.class = newVal;
    },
);

watch(
    () => ({
        label: props.label,
    }),
    (newProps) => {
        Object.assign(item.value, newProps);
    },
);
</script>

<template>
    <slot></slot>
</template>
