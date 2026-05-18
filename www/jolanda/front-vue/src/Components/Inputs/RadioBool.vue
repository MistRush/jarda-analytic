<script setup>
import RadioGroup from "@/Components/Inputs/RadioGroup.vue";
import { useTranslations } from "@/Composables/useTranslation.js";
import { computed } from "vue";

const props = defineProps({
    modelValue: {
        type: [Boolean, String, null],
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    optionAttribute: {
        type: String,
        default: "label",
    },
    valueAttribute: {
        type: String,
        default: "value",
    },
    label: [String, Function],
    required: Boolean,
    error: String,
    noneOption: Boolean,
    direction: {
        type: String,
        default: "column",
    },
    help: String,
});

const emit = defineEmits(["update:modelValue", "change"]);

const { translate } = useTranslations();

const options = computed(() => {
    const opt = [
        { label: translate("Ano"), value: true },
        { label: translate("Ne"), value: false },
    ];

    if (props.noneOption) {
        opt.push({ label: translate("Žádný"), value: null });
    }

    return opt;
});

const value = computed({
    get() {
        if (props.noneOption && props.modelValue === null) {
            return null;
        }

        if (props.modelValue == "1" || props.modelValue === true) {
            return true;
        } else {
            return false;
        }
    },
    set(val) {
        emit("update:modelValue", val);
        emit("change", val);
    },
});
</script>

<template>
    <RadioGroup v-bind="props" v-model="value" :options="options" />
</template>
