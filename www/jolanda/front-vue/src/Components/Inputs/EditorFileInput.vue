<script setup>
import FileInput from "./FileInput.vue";
import { ref, inject, onMounted, onUnmounted, watch } from "vue";
import { useAjax } from "@/Composables/useAjax.js";
import { useTranslations } from "@/Composables/useTranslation.js";
import GalleryItem from "@/Components/Gallery/GalleryItem.vue";
import Gallery from "@/Components/Gallery/Gallery.vue";
import { UseImage } from "@vueuse/components";
import Loader from "@/Components/Other/Loading/Loader.vue";

const props = defineProps({
    modelValue: [Number, String],
    label: [String, Function],
    name: {
        type: String,
        required: true,
    },
    uploadUrl: {
        type: String,
        default: "/common/file/upload",
    },
    fileName: String,
    folder: String,
    uploadAttributes: {
        type: [String, Object],
    },
    placeholder: String,
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
    preview: {
        type: Boolean,
    },
    path: {
        type: String,
    },
    accept: {
        type: String,
    },
    help: String,
});
const { postForm } = useAjax();
const { translations } = useTranslations();

const emit = defineEmits(["update:modelValue", "set-input-ref"]);
const registerFileInput = inject("registerFileInput", null);
const unregisterFileInput = inject("unregisterFileInput", null);

const file = ref(null);
const fileName = ref(props.fileName);
const oldId = ref(props.modelValue);

const uploadFile = async () => {
    if (!file.value) {
        return;
    }

    const formData = new FormData();
    formData.append("uploadFile", file.value);
    if (props.uploadAttributes) {
        if (typeof props.uploadAttributes === "string") {
            formData.append("type", props.uploadAttributes);
        } else if (typeof props.uploadAttributes === "object") {
            Object.entries(props.uploadAttributes).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }
    }

    let ID = null;

    await postForm(props.uploadUrl, formData).then(({ data }) => {
        const match = data.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/);
        const jsonString = match ? match[1] : null;
        const parsedData = JSON.parse(jsonString);

        const item = parsedData.items[0];
        const identifier = parsedData.identifier;

        ID = item[identifier];
        fileName.value = item.Name + "." + item.Extension;
        emit("update:modelValue", ID);
    });

    return ID;
};

onMounted(() => {
    if (registerFileInput) {
        registerFileInput(props.name, {
            uploadFile,
        });
    }
});

onUnmounted(() => {
    if (unregisterFileInput) {
        unregisterFileInput(props.name);
    }
});

watch(
    () => file.value,
    () => {
        if (file.value) {
            if (!props.modelValue) {
                // fileName.value = file.value?.name ?? null;
                emit("update:modelValue", "waiting-for-upload");
            } else if (props.modelValue === "waiting-for-upload") {
                // fileName.value = file.value?.name ?? null;
                emit("update:modelValue", "waiting-for-upload");
            } else if (props.modelValue) {
                emit("update:modelValue", "waiting-for-upload");
            }
        } else {
            if (oldId.value) {
                emit("update:modelValue", oldId.value);
            } else {
                emit("update:modelValue", null);
            }
        }
    },
);

watch(
    () => props.modelValue,
    () => {
        if (props.modelValue !== "waiting-for-upload") {
            oldId.value = props.modelValue;
        }
    },
);
</script>

<template>
    <div>
        <div class="flex gap-4 items-center">
            <Gallery v-if="props.preview && modelValue && modelValue !== 'waiting-for-upload'">
                <GalleryItem :href="props.path + fileName" width="auto" height="auto">
                    <div class="w-[100px] max-w-[100px] max-h-[100px] min-h-full relative flex items-center justify-center overflow-hidden">
                        <UseImage :src="props.path + fileName" class="w-full h-full object-cover relative">
                            <template #loading>
                                <div>
                                    <Loader size="8px" />
                                </div>
                            </template>

                            <template #error>
                                <Icon icon="danger" class="w-[24px] text-error" />
                            </template>
                        </UseImage>
                    </div>
                </GalleryItem>
            </Gallery>
            <FileInput class="grow" v-model="file" :name="props.name" :label="props.label" :placeholder="placeholder" :size="props.size" :readonly="props.readonly" :variant="variant" :accept="accept" :help="help" />
        </div>
        <div>
            <template v-if="modelValue && modelValue !== 'waiting-for-upload'">
                {{ translations.CURRENT_FILE }}: <a :href="'/common/file/download?ID=' + props.modelValue + (props.folder ? '&Folder=' + props.folder : '')" target="_blank" class="cursor-pointer hover:underline">{{ fileName ? fileName : translations.DOWNLOAD }}</a> -
                <a
                    href="javascript:;"
                    @click="
                        $emit('update:modelValue', null);
                        fileName = null;
                    "
                    class="cursor-pointer hover:underline text-red"
                >
                    {{ translations.REMOVE }}
                </a>
            </template>
        </div>
    </div>
</template>
