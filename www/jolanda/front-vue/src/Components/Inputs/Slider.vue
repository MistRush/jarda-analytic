<script setup>
import { ref, watch, computed } from "vue";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    modelValue: Number,
    label: [String, Function],
    id: String,
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 100,
    },
    step: Number,
    readonly: {
        type: Boolean,
        default: false,
    },
    name: String,
    error: String,
    help: String,
});

const emit = defineEmits(["update:modelValue", "change", "input"]);

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const inputValue = ref(props.modelValue ?? 0);
const thumbPosition = computed(() => {
    const range = props.max - props.min;
    return ((inputValue.value - props.min) / range) * 100;
});

watch(
    () => props.modelValue,
    (newVal) => {
        inputValue.value = newVal;
    },
);

function onChange() {
    emit("update:modelValue", parseInt(inputValue.value, 10));
    emit("change", parseInt(inputValue.value, 10));
    emitFormChange();
}

function onInput(event) {
    emit("input", parseInt(event.target.value, 10));
}
</script>

<template>
    <div
        class="slider-holder"
        :class="{
            error: error,
        }"
    >
        <label v-if="typeof props.label !== 'undefined'" :for="inputId">
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            <Help v-if="help" :help="help" />
        </label>
        <div class="slider-wrapper" :class="{ disabled: readonly }">
            <!--            <div>{{ min }}</div>-->
            <div class="slider-track">
                <input type="range" :id="inputId" :min="min" :max="max" :step="step" v-model="inputValue" :disabled="readonly" @change="onChange" @input="onInput" :name="name" />
                <!--                <div class="slider-thumb" :style="{ left: `calc(${thumbPosition}% - (${thumbPosition} * 0.02rem))` }">{{ inputValue }}</div>-->
            </div>
            <!--            <div>{{ max }}</div>-->
        </div>
        <ErrorMessage :error="error"></ErrorMessage>
    </div>
</template>

<style scoped>
.slider-holder {
    position: relative;
    width: 100%;
    height: 1.25rem;

    .slider-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: 1.25rem;
        padding: 0 0.25rem;

        &.disabled {
            .slider-track {
                input {
                    cursor: default;
                    background: linear-gradient(to right, #abd v-bind(thumbPosition + "%"), #cde v-bind(thumbPosition + "%"));

                    &::-webkit-slider-thumb {
                        background-color: #89b;
                    }

                    &::-moz-range-thumb {
                        background-color: #89b;
                    }

                    &::-webkit-slider-thumb:hover,
                    &::-moz-range-thumb:hover {
                        box-shadow: none;
                    }

                    &:active::-webkit-slider-thumb,
                    &:active::-moz-range-thumb {
                        box-shadow: none;
                    }

                    &:focus::-webkit-slider-thumb,
                    &:focus::-moz-range-thumb {
                        box-shadow: none;
                    }
                }
            }
        }

        .slider-track {
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;

            input {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                cursor: pointer;
                outline: none;
                border-radius: 0.154rem;
                height: 0.462rem;
                position: relative;
                background: linear-gradient(to right, var(--color-primary) v-bind(thumbPosition + "%"), var(--slider-bg) v-bind(thumbPosition + "%"));
            }

            .slider-thumb {
                position: absolute;
                pointer-events: none;
                width: 2rem;
                text-align: center;
                transform-origin: center;
                color: #fff;
                font-weight: 600;
                font-size: 12px;
            }
        }
    }
}
</style>
