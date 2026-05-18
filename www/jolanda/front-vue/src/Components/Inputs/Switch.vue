<script setup>
import { useForm } from "@/Components/Form/composables/useForm";
import { computed } from "vue";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    id: String,
    label: [String, Function],
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
    help: String,
});

const emit = defineEmits(["update:modelValue", "change"]);

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const value = computed(() => {
    if (props.modelValue == "1" || props.modelValue === true) {
        return true;
    } else {
        return false;
    }
});

const getChecked = computed(() => {
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
    <div class="toggle-container">
        <!-- Skrytý checkbox pro udržení funkčnosti a přístupnosti -->
        <input :id="inputId" type="checkbox" :checked="getChecked" @change="onChange" :name="name" class="toggle-input" />
        <!-- Vizuální slider (track) s kuličkou (knob) -->
        <label class="toggle-slider bg-light dark:bg-nav" :for="inputId">
            <span class="toggle-knob bg-white dark:bg-medium border-1 border-outline dark:border-dark"></span>
        </label>
        <!-- Textový label -->
        <span class="toggle-text">
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            <span v-if="required" class="required">*</span>
            <Help v-if="help" :help="help" />
        </span>
    </div>
</template>

<style scoped>
.toggle-container {
    display: flex;
    align-items: center;
}

/* Skrytí checkboxu */
.toggle-input {
    display: none;
}

/* Styl slideru (track) */
.toggle-slider {
    position: relative;
    display: inline-block;
    width: 2.308rem;
    height: 1.231rem;
    border-radius: 0.615rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

/* Styl kuličky (knob) */
.toggle-knob {
    position: absolute;
    top: 0.154rem;
    left: 0.154rem;
    width: 0.923rem;
    height: 0.923rem;
    border-radius: 50%;
    transition: transform 0.2s;
}

/* Při aktivaci checkboxu změní slider barvu a posune kuličku */
.toggle-input:checked + .toggle-slider {
    background-color: var(--color-primary); /* Zelené pozadí při aktivaci */
}

.toggle-input:checked + .toggle-slider .toggle-knob {
    transform: translateX(calc(2.308rem - 0.923rem - (0.154rem * 2)));
}

/* Styl textového labelu */
.toggle-text {
    margin-left: 8px;
    margin-bottom: 0 !important;
}

.required {
    color: var(--color-error);
}
</style>
