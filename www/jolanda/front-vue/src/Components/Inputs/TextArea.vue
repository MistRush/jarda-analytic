<script setup>
import { ref, watch } from "vue";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    modelValue: String, // Hodnota použitá ve v-model z rodičovské komponenty
    label: [String, Function],
    id: String,
    placeholder: String,
    required: {
        type: Boolean,
        default: undefined,
    },
    size: {
        type: String,
        default: "default", // možnosti jsou 'small', 'default', 'large'
    },
    rows: {
        type: [Number, String],
        default: 4, // Defaultní počet řádků
    },
    resize: {
        type: String,
        default: "vertical",
    },
    name: String,
    error: String,
    help: String,
    spellcheck: Boolean,
    readonly: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue", "change"]); // Pro aktualizaci hodnoty

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const inputValue = ref(props.modelValue); // Inicializace s modelValue

const inputEl = ref(null); // Reference na input element (pro focus, blur, atd.

// Sleduje změny v props.modelValue pro aktualizaci inputValue, pokud se hodnota změní zvenčí
watch(
    () => props.modelValue,
    (newVal) => {
        inputValue.value = newVal;
    },
);

// Aktualizuje modelValue při změně hodnoty v textovém poli
const updateValue = (value) => {
    emit("update:modelValue", value);
    emit("change", value);
    emitFormChange();
};
</script>

<template>
    <div
        class="input-holder"
        :class="{
            ['size-' + props.size]: true,
            error: error,
        }"
    >
        <label v-if="label" :for="inputId" @click="inputEl.focus()">
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            <span v-if="required" class="required">*</span>
            <Help v-if="help" :help="help" />
        </label>
        <textarea ref="inputEl" :id="inputId" :name="name" :readonly="props.readonly" :placeholder="placeholder" :required="required" :rows="rows" :value="inputValue" @input="updateValue($event.target.value)" :spellcheck="props.spellcheck" class="border-1 border-outline dark:border-dark bg-white dark:bg-nav read-only:bg-outline/20 read-only:text-dark/70 dark:read-only:bg-nav/50 dark:read-only:text-white/70" :class="{ 'hover:bg-outline/10 dark:hover:bg-nav/80': !props.readonly }"> </textarea>
        <ErrorMessage :error="error"></ErrorMessage>
    </div>
</template>

<style scoped>
textarea {
    border-radius: 0.462rem;
    padding: 6px 10px;
    font-size: 0.923rem;
    font-weight: 400;
    resize: v-bind(resize);
    width: 100%;

    &:focus {
        outline: none;
    }
}

.input-holder {
    &.size-large {
        textarea {
            font-size: 16px;
        }
    }
}

.error {
    textarea {
        border-color: var(--color-error);
    }
}
</style>
