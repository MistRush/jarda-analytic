<script setup>
import Select from "./Select.vue";

const props = defineProps({
    options: Array,
    modelValue: [String, Object, Array],
    placeholder: String,
    label: [String, Function],
    filterable: Boolean,
    url: String, // URL adresa pro načítání dat
    pageSize: {
        type: Number,
        default: 20, // Počet položek na stránku
    },
    required: {
        type: Boolean,
        default: undefined,
    },
    multiple: {
        type: Boolean,
        default: false, // Multiselect
    },
    returnObject: {
        type: Boolean,
        default: false, // Vracet objekt místo hodnoty
    },
    remoteName: {
        type: String,
        default: "Name",
    },
    textFromValue: {
        type: Boolean,
        default: false,
    },
    textProperty: {
        type: String,
        default: "text",
    },
    remoteIdentifier: {
        type: String,
        default: "ID",
    },
    remoteValueObject: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "default", // možnosti jsou 'small', 'default', 'large'
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    help: String,
});
</script>

<template>
    <Select v-bind="props"></Select>
</template>
