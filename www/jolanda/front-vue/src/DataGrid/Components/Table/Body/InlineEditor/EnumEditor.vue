<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import Select from "@/Components/Inputs/Select.vue";

const props = defineProps({
    modelValue: String,
    enumValues: Object,
});

const emit = defineEmits(["update:modelValue", "change", "close"]);

const value = ref(props.modelValue);

const onKeyDown = (e) => {
    if (e.key === 'Escape') {
        emit('close');
    }
}

onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
})

watch(
    () => props.modelValue,
    (newValue) => {
        value.value = newValue;
    },
);

watch(
    () => value.value,
    (newValue) => {
        emit("update:modelValue", newValue);
    },
);

const options = computed(() => {
    const opt = [];

    Object.entries(props.enumValues).forEach(([key, value]) => {
        opt.push({ value: key, text: value });
    });

    return opt;
});

// input = `<select name="${column.name}" data-id="${row.data()['ID']}">`;
// let values = column.select_values;
// for (let k in values) {
//     input += `<option value="${k}" ${value == k ? 'selected' : ''}>${values[k]}</option>`;
// }
// input += `</select>`;
</script>

<template>
    <div class="enum-editor">
        <Select v-model="value" :options="options" class="min-w-[150px]" @change="(val) => $emit('change', val)" />
    </div>
</template>
