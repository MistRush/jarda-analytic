<script setup>
import Checkbox from "./../../Inputs/Checkbox.vue";

const props = defineProps({
    items: Array,
    selected: Array,
});

const emit = defineEmits(["update-selected"]);

const toggleSelected = (item) => {
    const index = props.selected.indexOf(item.id);
    if (index > -1) {
        props.selected.splice(index, 1);
    } else {
        props.selected.push(item.id);
    }
    emit("update-selected", props.selected);
};

const isSelected = (id) => {
    return props.selected.includes(id);
};
</script>

<template>
    <ul>
        <li v-for="item in items" :key="item.id">
            <div class="item my-1.5" :class="{ 'no-subitem': !item.children?.length }">
                <a v-if="item.children?.length" @click="item.expanded = !item.expanded" :class="{ plus: !item.expanded, minus: item.expanded }" class="w-[12px]"> <Icon icon="arrow" class="w-[12px] text-medium dar:text-light" :direction="item.expanded ? 'bottom' : 'right'" /></a>
                <Checkbox :model-value="isSelected(item.id)" :label="item.text" @change="toggleSelected(item)"></Checkbox>
            </div>
            <div v-if="item.expanded" class="sub-items pt-1 pb-2">
                <TreeViewItem :items="item.children" :selected="selected" @update-selected="$emit('update-selected', selected)" />
            </div>
        </li>
    </ul>
</template>

<style scoped>
a {
    margin-right: 6px;

    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
}

.sub-items {
    padding-left: 16px;
}

ul {
    list-style: none;
    padding: 0;
}

.item {
    margin-bottom: 2px;
    display: flex;
    align-items: center;
}

.no-subitem {
    margin-left: 16px;
}
</style>
