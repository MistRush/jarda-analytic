<script setup>
import {ref, watch} from "vue";
import DatePicker from "../../../../../Components/Inputs/DatePicker.vue";

const props = defineProps({
    modelValue: String,
    type: String,
})

const emit = defineEmits(['update:modelValue', 'keyup.enter']);

const value = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  value.value = newValue;
})

watch(() => value.value, (newValue) => {
  emit('update:modelValue', newValue);
})
</script>

<template>
  <div class="text-editor">
    <DatePicker
        v-model="value"
        :type="type"
    >
    </DatePicker>
  </div>
</template>