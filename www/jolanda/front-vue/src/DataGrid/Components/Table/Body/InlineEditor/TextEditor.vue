<script setup>
import { ref, watch } from "vue";
import InputField from "@/Components/Inputs/InputField.vue";

const props = defineProps({
    modelValue: String,
    number: Boolean,
});

const emit = defineEmits(["update:modelValue", "keyup.enter"]);

const value = ref(props.modelValue);

const updateValue = (event) => {
    emit("update:modelValue", value.value);
};

watch(
    () => value.value,
    (newVal) => {
        emit("update:modelValue", value.value);
    },
);

watch(
    () => props.modelValue,
    (newValue) => {
        value.value = newValue;
    },
);
</script>

<template>
    <div class="text-editor">
        <InputField v-model="value" :type="props.number ? 'number' : 'text'" />
    </div>
</template>
