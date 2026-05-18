<script setup>
import { computed, ref } from "vue";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import Help from "@/Components/Other/Help.vue";

// Definice props pro ID, label a modelValue
const props = defineProps({
    id: String,
    label: {
        type: [String, Function],
    },
    modelValue: [Boolean, String, Number],
    inverted: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "default",
    },
    required: {
        type: Boolean,
        default: undefined,
    },
    name: String,
    error: String,
    checked: {
        type: Boolean,
        default: undefined,
    },
    help: String,
});

// Definice emit pro aktualizaci modelValue
const emit = defineEmits(["update:modelValue", "change"]);

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const inputEl = ref(null); // Reference na input element (pro focus, blur, atd.

const value = computed(() => {
    if (props.modelValue == "1" || props.modelValue === true) {
        return true;
    } else {
        return false;
    }
});

const getChecked = computed(() => {
    if (props.checked !== undefined) {
        return props.checked;
    }

    return props.inverted ? !value.value : value.value;
});

const onChange = (event) => {
    // const checked = event.target.checked;
    const checked = !value.value;
    emit("update:modelValue", props.inverted ? !checked : checked);
    emitFormChange();
    emit("change", props.inverted ? !checked : checked);
};
</script>

<template>
    <div>
        <div class="checkbox-wrapper">
            <input ref="inputEl" :id="inputId" type="checkbox" :checked="getChecked" @change="onChange" :name="name" class="bg-white dark:bg-nav border-1 border-outline dark:border-dark checked:border-primary dark:checked:border-dark" />
            <label :class="'size-' + size" :for="inputId" class="cursor-pointer">
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
.checkbox-wrapper {
    display: flex;
    align-items: center;

    input {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 1.231rem;
        height: 1.231rem;
        min-width: 1.231rem;
        min-height: 1.231rem;
        border-radius: 4px; /* Zaoblení okrajů */
        display: inline-block;
        position: relative;
        cursor: pointer;

        &:checked {
            background-color: var(--color-primary, #24c586) !important;

            &:after {
                content: "";
                display: block;
                width: 0.308rem;
                height: 0.615rem;
                border: solid #fff;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
                position: absolute;
                top: 15%;
                left: 35%;
            }
        }

        &:focus {
            outline: none;
        }
    }

    label {
        margin-left: 8px;
        margin-bottom: 0 !important;
    }
}
</style>
