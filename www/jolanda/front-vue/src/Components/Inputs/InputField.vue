<script setup>
import { ref, watch } from "vue";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    modelValue: String | Number, // Přijímá hodnotu použitou v v-model z rodičovské komponenty
    label: [String, Function],
    id: String,
    type: String,
    placeholder: String,
    required: {
        type: Boolean,
        default: undefined,
    },
    size: {
        type: String,
        default: "default", // možnosti jsou 'small', 'default', 'large'
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    showClear: {
        type: Boolean,
        default: false,
    },
    variant: {
        type: String,
        default: "default",
    },
    icon: {
        type: String,
    },
    iconColor: {
        type: String,
        default: "black",
    },
    inputRef: Object,
    name: String,
    error: String,
    step: String,
    dark: Boolean,
    loading: {
        type: Boolean,
        default: false,
    },
    help: String,
});

const emit = defineEmits(["update:modelValue", "set-input-ref", "blur", "change"]); // Pro aktualizaci hodnoty

const { emitFormBlur, emitFormInput, emitFormChange, error, inputId, name, required } = useForm(props);

const inputValue = ref(props.modelValue); // Inicializace s modelValue
const inputEl = ref(null); // Reference na input element (pro focus, blur, atd.

// Sleduje změny v props.modelValue pro aktualizaci inputValue, pokud se hodnota změní zvenčí
watch(
    () => props.modelValue,
    (newVal) => {
        console.log('changed');
        emitFormChange();
        inputValue.value = newVal;
    },
);

// Aktualizuje modelValue při změně hodnoty vstupu
const updateInput = (value) => {
    if (props.type === "currency") {
        if (value) {
            emit("update:modelValue", value * 100);
        } else {
            emit("update:modelValue", value);
        }

        emitFormInput();
    } else {
        emit("update:modelValue", value);
        emitFormInput();
    }
};

const onInput = (event) => {
    // if (!modelModifiers.value.lazy) {
    updateInput(event.target.value);
    // }
};

const onChange = (event) => {
    if (props.type === "currency") {
        if (event.target.value) {
            inputValue.value = event.target.value * 100;
            const value = event.target.value * 100;
            emit("change", value);
        } else {
            inputValue.value = event.target.value;
            emit("change", event.target.value);
        }
    } else {
        inputValue.value = event.target.value;
        const value = event.target.value;
        emit("change", value);
    }

    // if (modelModifiers.value.lazy) {
    //     updateInput(value)
    // }
    // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
    // if (modelModifiers.value.trim) {
    //     (event.target as HTMLInputElement).value = value.trim()
    // }
};

const onBlur = (event) => {
    emitFormBlur();
    emit("blur", event);
};

watch(
    () => inputEl.value,
    (newVal) => {
        emit("set-input-ref", newVal);
    },
);

defineExpose({
    inputEl,
});
</script>

<template>
    <div
        :class="{
            [props.variant]: true,
            'input-holder': true,
            ['size-' + props.size]: true,
            error: error,
            'dark-theme': dark,
        }"
        class="w-full"
    >
        <label
            v-if="typeof props.label !== 'undefined'"
            :for="inputId"
            @click="inputEl.focus()"
            :class="{
                'read-only': props.readonly,
            }"
        >
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            <span v-if="required" class="required">*</span>
            <Help v-if="help" :help="help" />
        </label>
        <div class="input-wrapper" :class="{ 'with-icon': props.icon, 'read-only': props.readonly }">
            <div class="before">
                <Icon v-if="props.icon" :icon="props.icon" class="icon w-[15px] text-dark dark:text-light"></Icon>
            </div>

            <input
                :type="type === 'currency' ? 'number' : type"
                :id="inputId"
                :placeholder="placeholder"
                :readonly="readonly"
                :value="type === 'currency' ? (inputValue ? inputValue / 100 : null) : inputValue"
                ref="inputEl"
                :name="name"
                @input="onInput"
                @blur="onBlur"
                @change="onChange"
                :step="step"
                class="vue-input border-1 border-outline dark:border-dark bg-white dark:bg-nav read-only:bg-outline/20 read-only:text-dark/70 dark:read-only:bg-nav/50 dark:read-only:text-white/70"
                :class="{
                    'dark:bg-light/20!': props.variant === 'fancy',
                    'hover:bg-outline/10 dark:hover:bg-nav/80': !props.readonly,
                }"
            />
            <div
                class="after flex items-center gap-2"
                :class="{
                    'right-[12px]': props.type !== 'number',
                    'right-[32px]': props.type === 'number',
                }"
            >
                <Icon icon="loading" v-if="loading" class="loading w-[9px] text-light" />
                <Icon
                    icon="close"
                    v-if="showClear && inputValue && !readonly"
                    @click="
                        inputValue = null;
                        updateInput(null);
                        inputEl.focus();
                    "
                    class="clear-icon w-[9px] text-light"
                />
            </div>
        </div>
        <ErrorMessage :error="error"></ErrorMessage>
    </div>
</template>

<style scoped>
.vue-input {
    border-radius: 0.462rem;
    padding: 0 0.769rem;
    min-height: 2.308rem;
    font-size: 0.923rem;
    font-weight: 400;
    line-height: 16px;
    width: 100%;
    box-sizing: border-box;

    &:focus {
        outline: none;
    }
}

.input-holder {
    display: flex;
    flex-direction: column;

    &.fancy {
        input {
            border-radius: 25px;
            background: #ecf2ff;
            border: none;
            padding-left: 20px;

            &:focus {
                box-shadow: 0 0 0 1px #ecf2ff;
            }
        }
    }

    .input-wrapper {
        position: relative;

        &.with-icon {
            .before {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 12px;
            }

            input {
                padding-left: 35px;
            }
        }

        .after {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }

    &.size-small {
        input {
            min-height: 1.846rem;
        }
    }

    &.size-large {
        input {
            min-height: 2.9rem;
            font-size: 1.1rem;
        }

        label {
            font-size: 1rem;
        }
    }

    &.size-large-xl {
        input {
            min-height: 3.5rem;
            font-size: 1.2rem;
        }

        label {
            font-size: 1.1rem;
        }
    }
}

.error {
    input {
        border: 1px solid var(--color-error);
    }
}
</style>
