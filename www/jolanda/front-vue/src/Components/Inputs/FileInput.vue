<script setup>
import { ref, watch } from "vue";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    modelValue: Object | Array, // Array pokud multiple
    label: [String, Function],
    id: String,
    placeholder: String,
    required: Boolean,
    multiple: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "default",
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    variant: {
        type: String,
        default: "default",
    },
    inputRef: Object,
    name: String,
    error: String,
    accept: {
        type: String,
    },
    help: String,
});

const emit = defineEmits(["update:modelValue", "set-input-ref"]);

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const inputElement = ref(null);
const selectedFileName = ref(props.placeholder);

watch(
    () => inputElement.value,
    (newValue) => {
        emit("set-input-ref", newValue);
    },
);

watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue.length === 0) onFileSelected();
    },
);

function onFileSelected(event = null) {
    if (event && event.target && event.target.files) {
        const files = event.target.files;

        if (!props.multiple && files.length > 0) {
            selectedFileName.value = files[0].name;
            emit("update:modelValue", files[0]);
        } else if (props.multiple && files.length > 0) {
            selectedFileName.value = Array.from(files)
                .map((file) => file.name)
                .join(", ");
            emit("update:modelValue", files);
        } else {
            selectedFileName.value = props.placeholder;
        }
    } else selectedFileName.value = props.placeholder;
    emitFormChange();
}
</script>

<template>
    <div :class="{ [variant]: true, 'input-holder': true, ['size-' + size]: true, error: error }">
        <div :for="inputId" class="file-input-label">
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            <span v-if="required" class="required">*</span>
            <Help v-if="help" :help="help" />
        </div>
        <div
            class="input-wrapper border-1 border-outline dark:border-dark bg-white dark:bg-nav"
            @click="inputElement.click()"
            :class="{
                'bg-outline/20 text-dark/70 dark:bg-nav/50 dark:text-white/70': props.readonly,
                'hover:bg-outline/10 dark:hover:bg-nav/80': !props.readonly,
            }"
        >
            <div class="icon-wrapper bg-outline dark:bg-outline/20"><Icon icon="file" class="w-[16px] dark:text-white" /></div>
            <input type="file" :id="inputId" :name="name" :required="required" :multiple="multiple" @change="onFileSelected" :readonly="readonly" ref="inputElement" :accept="accept" />
            <span>{{ selectedFileName }}</span>
        </div>
        <ErrorMessage :error="error"></ErrorMessage>
    </div>
</template>

<style scoped>
.input-holder {
    &.size-small {
        .input-wrapper {
            font-size: 12px;
            min-height: 24px;

            .icon-wrapper {
                height: 24px;
                width: 24px;
            }
        }
    }

    .input-wrapper {
        border-radius: 6px;
        min-height: 28px;
        font-size: 13px;
        font-weight: 400;
        line-height: 17px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        cursor: pointer;

        .icon-wrapper {
            height: 28px;
            width: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        span {
            padding: 0 8px;
        }

        input {
            display: none;
        }
    }
}

.error {
    .input-wrapper {
        border-color: var(--color-error);
    }
}

.required {
    color: var(--color-error);
}
</style>
