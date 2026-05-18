<script setup>
// var loadTreeData = function(){
//     Helpers.ajax({
//         url: basePath + '/default/product/load-product-type-tree',
//         success: function (data) {
//             tree.data = JSON.parse(data);
//             tree.tree.jstree().settings.core.data = JSON.parse(data);
//             tree.tree.jstree('refresh');
//         }
//     })
// }

import { onMounted, ref } from "vue";
import TreeViewItem from "./TreeViewItem.vue";
import { useAjax } from "@/Composables/useAjax.js";

const props = defineProps({
    items: {
        type: Array,
        default: null,
    },
    dataUrl: {
        type: String,
        default: null,
    },
    modelValue: Boolean,
    label: {
        type: String,
    },
});

const emit = defineEmits(["update:modelValue", "change"]);

const items = ref(props.items);
const selected = ref(props.modelValue ?? []);

const loadTreeData = () => {
    if (!props.dataUrl) {
        return;
    }

    try {
        const ajax = useAjax();
        ajax.get(props.dataUrl, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            items.value = response.data;
        });
    } catch ({ error }) {}
};

onMounted(() => {
    if (props.dataUrl) {
        loadTreeData();
    }
});

const updateSelected = (newSelected) => {
    selected.value = newSelected;
    emit("update:modelValue", selected.value);
};
</script>

<template>
    <div>
        <div class="label">{{ props.label }}</div>
        <div class="items">
            <TreeViewItem :items="items" :selected="selected" @update-selected="updateSelected" />
        </div>
    </div>
</template>

<style scoped>
.label {
    font-size: 14px;
    font-weight: 600;
}

.items {
    max-height: 380px;
    overflow-y: auto;
}
</style>
