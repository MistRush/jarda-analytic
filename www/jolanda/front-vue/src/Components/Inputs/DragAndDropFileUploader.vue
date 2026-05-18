<script setup>
import DragAndDropFileInput from "@/Components/Inputs/DragAndDropFileInput.vue";
import { ref, watch } from "vue";
import { useAjax } from "@/Composables/useAjax.js";
import { useManager } from "@/Composables/useManager.js";
import Loader from "@/Components/Other/Loading/Loader.vue";
import { UseImage } from "@vueuse/components";

const props = defineProps({
    uploadUrl: { type: String, default: "/common/file/upload" },
    uploadAttributes: { type: [String, Object] },
    manager: [String, Object],
    parentID: { type: [String, Number], required: true },
    parentColumn: { type: [String], required: true },
    fileColumn: { type: [String], default: "File_ID" },
    path: { type: [String], required: true },
});

const emit = defineEmits(["change"]);
const { postForm } = useAjax();

/**
 * files = hodnota z DragAndDropFileInput (File nebo File[])
 * items = reaktivní wrapy pro UI + metadata (UploadedFileName, ID, Relation_ID)
 */
const files = ref([]);
const items = ref([]);

/** Pomocná funkce na stabilní klíč pro mapování */
const fileKey = (f) => `${f?.name}|${f?.size}|${f?.lastModified}`;

/** Kdykoliv se změní files (z inputu), zmapuj na wrapy a zachovej existující metadata */
watch(
    () => files.value,
    (newVal) => {
        const arr = Array.isArray(newVal) ? newVal : newVal ? [newVal] : [];
        const previous = new Map(items.value.map((it) => [fileKey(it.raw), it]));
        items.value = arr.map((f) => {
            const key = fileKey(f);
            return (
                previous.get(key) ?? {
                    key,
                    raw: f, // File
                    ID: null, // po uploadu
                    Relation_ID: null, // po vytvoření relace
                    UploadedFileName: null, // po uploadu
                }
            );
        });
        // když potřebuješ vědět „co přibylo / ubylo“, máš k dispozici previous vs. items.value
    },
    { immediate: true },
);

/** Upload – pracuj s items (wrappery), do FormData dávej item.raw (File) */
const uploadFile = async () => {
    const { getURLs } = useManager(props.manager);
    if (!items.value?.length) return;

    // 1) upload souborů, které ještě nemají ID
    const uploadQueue = items.value
        .filter((it) => !it.ID && it.raw)
        .map(async (it) => {
            const formData = new FormData();
            formData.append("uploadFile", it.raw);

            if (props.uploadAttributes) {
                if (typeof props.uploadAttributes === "string") {
                    formData.append("type", props.uploadAttributes);
                } else if (typeof props.uploadAttributes === "object") {
                    Object.entries(props.uploadAttributes).forEach(([k, v]) => {
                        formData.append(k, v);
                    });
                }
            }

            const { data } = await postForm(props.uploadUrl, formData);
            const match = data.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/);
            const jsonString = match ? match[1] : null;
            const parsed = JSON.parse(jsonString);

            const item = parsed.items[0];
            const identifier = parsed.identifier;

            it.ID = item[identifier];
            it.UploadedFileName = `${item["Name"]}.${item["Extension"]}`;
        });

    await Promise.all(uploadQueue);

    // 2) vytvořit relaci pro ty, co ještě nemají Relation_ID
    const relationQueue = items.value
        .filter((it) => it.ID && !it.Relation_ID)
        .map(async (it) => {
            const { data } = await postForm(
                getURLs().create,
                {
                    data: JSON.stringify({
                        [props.parentColumn]: props.parentID,
                        [props.fileColumn]: it.ID,
                    }),
                },
                null,
            );
            if (data.items?.length > 0) {
                it.Relation_ID = data.items[0]["ID"];
            }
        });

    await Promise.all(relationQueue);

    emit("change");
};

/** Když přijde změna z inputu, spusti upload (případně můžeš zdebouncovat) */
watch(
    () => files.value,
    () => uploadFile(),
);

const removeFile = async (it) => {
    const { getURLs } = useManager(props.manager);
    if (!it?.Relation_ID) return;

    await postForm(getURLs().delete, { data: JSON.stringify({ ID: it.Relation_ID }) }, null);

    // Lokálně odstranit položku z items (a tím i z UI)
    items.value = items.value.filter((x) => x !== it);

    // odstranit i z files (podle reference na File)
    files.value = files.value.filter((f) => f !== it.raw);

    emit("change");
};
</script>

<template>
    <DragAndDropFileInput v-model="files" :disabled="props.disabled" :multiple="true" :name="props.name" :error="props.error" @change="(val) => emit('change', val)" @blur="$emit('blur')">
        <template #multiplePreview="{ files }">
            <div class="flex gap-4 flex-wrap">
                <div v-for="(it, i) in items" :key="it.key || i" class="mb-2">
                    <div class="max-w-[120px] max-h-[120px] relative">
                        <div v-if="it.UploadedFileName" class="absolute rounded-full bg-dark z-1 p-1 hover:bg-medium cursor-pointer right-1 top-1" @click="removeFile(it)">
                            <Icon icon="close" class="w-[9px]" />
                        </div>
                        <UseImage v-if="it.UploadedFileName" :src="props.path + it.UploadedFileName" class="object-cover relative">
                            <template #loading>
                                <div><Loader size="8px" /></div>
                            </template>
                            <template #error>
                                <Icon icon="danger" class="w-[24px] text-error" />
                            </template>
                        </UseImage>
                        <div v-else>
                            <div><Loader size="8px" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DragAndDropFileInput>
</template>
