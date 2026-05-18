<script setup>
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import TbodyTr from "@/Components/Table/TbodyTr.vue";

const props = defineProps({
    draggable: {
        type: Boolean,
        required: false,
        default: false,
    },
    list: {
        type: Array,
        required: false,
        default: null,
    },
});

const emit = defineEmits(["onAfterDrag", "startDrag", "endDrag"]);

const list = ref(props.list);

watch(list, (value, oldValue) => {
    if (props.draggable) {
        emit("onAfterDrag", value, oldValue);
    }
});

watch(
    () => props.list,
    (value, oldValue) => {
        list.value = value;
    },
);
</script>

<template>
    <tbody v-if="!props.draggable && !props.list">
        <slot></slot>
    </tbody>
    <tbody v-else-if="!props.draggable && props.list">
        <template v-for="(element, index) in props.list" :key="index">
            <TbodyTr>
                <slot :element="element"></slot>
            </TbodyTr>
        </template>
    </tbody>
    <draggable v-else v-model="list" tag="tbody" item-key="Rank" @start="$emit('startDrag')" @end="$emit('endDrag')">
        <template #item="{ element, index }">
            <TbodyTr>
                <slot :element="element" :index="index"></slot>
            </TbodyTr>
        </template>
    </draggable>
</template>
