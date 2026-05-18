<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";

const props = defineProps({
    modelValue: Array | Object,
    disabled: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    name: String,
    error: String,
});

const emit = defineEmits(["update:modelValue", "blur", "change"]);

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const files = ref(props.multiple ? [] : null);
const isDragging = ref(false);
const fileInput = ref(null);
const imagePreviews = ref([]);

function isImageFile(file) {
    return file && typeof file.type === "string" && file.type.startsWith("image/");
}

function rebuildPreviews(newFiles) {
    // clear previous object URLs
    imagePreviews.value.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
    });
    imagePreviews.value = [];

    if (!newFiles) return;

    const fileArray = props.multiple ? newFiles : [newFiles];
    imagePreviews.value = fileArray.map((file) =>
        isImageFile(file) ? URL.createObjectURL(file) : null,
    );
}

function handleDragOver() {
    isDragging.value = true;
}

function handleDragLeave() {
    isDragging.value = false;
}

function handleDrop(event) {
    isDragging.value = false;
    const droppedFiles = Array.from(event.dataTransfer.files);

    if (props.multiple) files.value = [...files.value, ...droppedFiles];
    else files.value = droppedFiles[0];

    emitFormChange();
    emit("change", files.value);
}

function handleFileSelect(event) {
    const selectedFiles = Array.from(event.target.files);

    if (props.multiple) files.value = [...files.value, ...selectedFiles];
    else files.value = selectedFiles[0];

    event.target.value = null;
    emitFormChange();
    emit("change", files.value);
}

function removeSelectedFile(index) {
    if (props.multiple) files.value.splice(index, 1);
    else files.value = null;

    emitFormChange();
    emit("change", files.value);
}

const onBlur = (event) => {
    emitFormBlur();
    emit("blur", event);
};

watch(
    () => props.modelValue,
    (newModelValue) => {
        if (JSON.stringify(newModelValue) !== JSON.stringify(files.value)) {
            if (props.multiple) files.value = [...newModelValue];
            else files.value = newModelValue;
        }
    },
);

watch(
    files,
    (newFiles) => {
        if (JSON.stringify(newFiles) !== JSON.stringify(props.modelValue)) {
            emit("update:modelValue", newFiles);
        }
        rebuildPreviews(newFiles);
    },
    { deep: true },
);

onBeforeUnmount(() => {
    rebuildPreviews(null);
});
</script>

<template>
    <div>
        <div class="drop-zone" :class="{ 'drop-zone-active': isDragging, disabled: disabled }" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop.prevent="handleDrop">
            <div v-if="multiple ? !files.length : !files">Přetáhněte nebo <span class="select-file" @click="fileInput.click()">vyberte soubor/y z počítače</span></div>

            <div v-else-if="multiple">
                <slot name="multiplePreview" :files="files">
                    <span
                        v-for="(file, index) in files"
                        :key="index"
                        class="selected-file inline-flex items-center gap-2"
                        @click="removeSelectedFile(index)"
                    >
                        <template v-if="isImageFile(file) && imagePreviews[index]">
                            <img
                                :src="imagePreviews[index]"
                                :alt="file.name"
                                class="h-[100px] w-[100px] object-scale-down rounded border border-gray-200"
                            />
                        </template>
                        <template v-else>
                            {{ file.name }}
                        </template>
                        <span v-if="index < files.length - 1">,</span>
                    </span>
                </slot>
            </div>
            <div v-else>
                <span class="selected-file inline-flex items-center gap-2" @click="removeSelectedFile()">
                    <template v-if="isImageFile(files) && imagePreviews[0]">
                        <img
                            :src="imagePreviews[0]"
                            :alt="files.name"
                            class="h-[100px] w-[100px] object-scale-down rounded border border-gray-200"
                        />
                    </template>
                    <template v-else>
                        {{ files.name }}
                    </template>
                </span>
            </div>
            <input type="file" multiple class="file-input" @change="handleFileSelect" ref="fileInput" :disabled="disabled" :name="name" @blur="onBlur" :id="inputId" />
        </div>
        <ErrorMessage :error="error"></ErrorMessage>
    </div>
</template>

<style scoped>
.drop-zone {
    border: 2px dashed #cde;
    border-radius: 0.5rem;
    padding: calc(0.5rem - 2px) 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;

    &.disabled {
        pointer-events: none;
        color: #cde;
    }

    &.drop-zone-active {
        background-color: #24c58644;
        border-color: #24c586;
    }

    .select-file {
        text-decoration: underline;
        cursor: pointer;
        font-weight: 600;
    }

    .selected-file {
        cursor: pointer;
        position: relative;

        &:hover {
            text-decoration: line-through;

            &:has(img):before {
                display: flex;
            }
        }

        &:before {
            content: "x";
            position: absolute;
            display: none;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            top: 0;
            right: 0;
            color: #fff;
            font-size: 3rem;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1;
        }
    }

    .file-input {
        display: none;
    }
}
</style>
