<script setup>
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import { inject, useId } from "vue";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    id: String,
    value: {
        type: [String, Number, Object, Boolean],
        default: true,
    },
    modelValue: [String, Number, Object, Boolean],
    label: [String, Function],
    size: {
        type: String,
        default: "default",
    },
    name: String,
    error: String,
    required: {
        type: Boolean,
        default: undefined,
    },
    help: String,
});

const emit = defineEmits(["update:modelValue", "change"]);

const radioGroup = inject("radio-group", null);

const { emitFormChange, error, name, required } = radioGroup ?? useForm(props);

const inputId = props.id ?? useId();

const onChange = () => {
    emit("update:modelValue", props.value);
    emit("change", props.value);

    if (!radioGroup) {
        emitFormChange();
    }
};
</script>

<template>
    <div>
        <div class="radio-wrapper" :class="'size-' + size" @click="$refs.radioInput.click()">
            <input ref="radioInput" :id="inputId" type="radio" :value="value" :checked="modelValue === value" @change="onChange" :name="name" class="bg-white dark:bg-nav border-1 border-outline dark:border-dark checked:border-primary dark:checked:border-dark" />
            <label :class="'size-' + size" :for="inputId" v-if="props.label">
                <component v-if="typeof label === 'function' && label" :is="label" />
                <template v-else>
                    {{ label }}
                </template>
                <span v-if="required" class="required">*</span>
                <Help v-if="help" :help="help" />
            </label>
        </div>
        <ErrorMessage :error="error"></ErrorMessage>
    </div>
</template>

<style scoped>
input {
    width: 1.231rem;
    height: 1.231rem;
    min-width: 1.231rem;
    min-height: 1.231rem;
    color: var(--color-primary);
    cursor: pointer;

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    pointer-events: none;

    &:checked {
        &:after {
            content: "";
            display: block;
            width: 0.769rem;
            height: 0.769rem;
            border-radius: 50%;
            background-color: var(--color-primary);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}

.radio-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    cursor: pointer;

    &.size-small {
        margin-bottom: 0;
    }
}

label {
    margin-left: 8px;
    margin-bottom: 0px;
}
</style>
