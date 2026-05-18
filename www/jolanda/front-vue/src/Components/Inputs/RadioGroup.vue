<script setup>
import { useForm } from "@/Components/Form/composables/useForm";
import Radio from "@/Components/Inputs/Radio.vue";
import { computed, provide } from "vue";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    modelValue: [String, Number, Object, Boolean, null],
    name: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        default: () => [],
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
    direction: {
        type: String,
        default: "column",
    },
    help: String,
});

const emit = defineEmits(["update:modelValue", "change"]);

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

provide("radio-group", { name });

const onUpdate = (value) => {
    emit("update:modelValue", value);
    emit("change", value);
    emitFormChange();
};

const normalizeOption = (option) => {
    if (["string", "number", "boolean"].includes(typeof option)) {
        return {
            value: option,
            label: option,
        };
    }

    return {
        ...option,
        value: option[props.valueAttribute],
        label: option[props.optionAttribute],
    };
};

const normalizedOptions = computed(() => {
    return props.options.map((option) => normalizeOption(option));
});
</script>

<template>
    <div
        class="radio-group"
        :class="{
            error: error,
        }"
    >
        <fieldset
            :class="{
                [props.direction]: true,
            }"
        >
            <legend v-if="label">
                <component v-if="typeof label === 'function' && label" :is="label" />
                <template v-else>
                    {{ label }}
                </template>
                <span v-if="required" class="required">*</span>
                <Help v-if="help" :help="help" />
            </legend>
            <Radio v-for="option in normalizedOptions" :key="option.value" :name="name" :label="option.label" :model-value="modelValue" :value="option.value" @change="onUpdate"> </Radio>
        </fieldset>
        <ErrorMessage :error="error"></ErrorMessage>
    </div>
</template>

<style scoped>
legend {
    font-weight: 500;
    font-size: 0.923rem;
    line-height: var(--font-line-height);
    letter-spacing: 0px;
    margin-bottom: 4px;
    display: inline-block;
}

.error {
    legend {
        .required {
            color: red;
        }
    }
}

fieldset.inline {
    display: flex;
    gap: 20px;
    align-items: center;
}
</style>
