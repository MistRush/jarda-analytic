<script setup>
    import { computed, onMounted, ref, watch } from "vue";
    import { useTranslations } from "@/Composables/useTranslation.js";
    import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";
    import { useAjax } from "@/Composables/useAjax.js";
    import { useGrid } from "@/DataGrid/js/useGrid.js";
    import DataGrid from "@/DataGrid/Components/DataGrid.vue";
    import Action from "@/DataGrid/Components/Action/Action.vue";
    import Checkbox from "@/Components/Inputs/Checkbox.vue";

    const props = defineProps({
        type: {
            type: String,
            required: true,
        },
        handleUrl: {
            type: String,
            default: () => window.location.href,
        },
        columns: {
            type: Array,
            default: () => [],
        },
        returnBlob: {
            type: Boolean,
            default: false,
        },
        hasHeaderDefault: {
            type: Boolean,
            default: true,
        },
        hasOutput: {
            type: Boolean,
            default: false,
        },
        initialSelectedFile: {
            type: String,
            default: null,
        },
    });

    const emit = defineEmits(["uploaded", "imported", "error", "selectionChange"]);

    const { translations } = useTranslations();
    const alertStore = useAlertStore();
    const { post, request } = useAjax();

    const localStorageKey = computed(() => `importSelected[${props.type}]`);
    const selectedFile = ref(null);
    const files = ref([]);
    const fileCount = ref(0);
    const uploaderVisible = ref(true);
    const selectedVisible = ref(false);
    const listVisible = ref(false);
    const hasHeader = ref(props.hasHeaderDefault);
    const selectedColumns = ref({});
    const outputFile = ref(null);
    const previewRows = ref([]);
    const previewStatus = ref("idle");
    const { grid } = useGrid(props.type + '_importer_grid');

    const previewColumnCount = computed(() => {
        if (previewRows.value[0] && Array.isArray(previewRows.value[0]))
            return previewRows.value[0].length;

        if (flatColumns.value.length)
            return flatColumns.value.length;

        return 0;
    });

    function loadSelectedFromStorage() {
        if (props.initialSelectedFile) {
            selectedFile.value = props.initialSelectedFile;
            return;
        }

        const stored = localStorage.getItem(localStorageKey.value);
        selectedFile.value = stored || null;
    }

    function persistSelectedToStorage() {
        if (selectedFile.value)
            localStorage.setItem(localStorageKey.value, selectedFile.value);
        else localStorage.removeItem(localStorageKey.value);
    }

    watch(() => selectedFile.value, () => {
        persistSelectedToStorage();
        emit("selectionChange", selectedFile.value);
    });

    async function callFunction(functionName, data = null, returnsBlob = false) {
        const basePayload = {
            function: functionName,
            fileName: selectedFile.value,
            type: props.type,
        };

        const payload = data ? { ...basePayload, ...data } : basePayload;
        const url = props.handleUrl || window.location.href;

        try {
            if (returnsBlob) {
                const { response } = await post(url, payload, {
                    responseType: "blob",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });
                return { blob: response.data, response };
            }

            const { data: responseData } = await post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            return responseData;
        } catch (err) {
            emit("error", err);
            throw err;
        }
    }

    async function uploadFile(ev) {
        const input = ev.currentTarget;
        const file = input && input.files ? input.files[0] : null;

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", props.type);

        try {
            const xhr = new XMLHttpRequest();

            const result = await new Promise((resolve, reject) => {
                xhr.addEventListener(
                    "load",
                    () => {
                        if (xhr.status !== 200) {
                            reject(new Error(`Upload failed with status ${xhr.status}`));
                            return;
                        }

                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    false
                );

                xhr.addEventListener(
                    "error",
                    () => {
                        reject(new Error("Upload error"));
                    },
                    false
                );

                xhr.addEventListener(
                    "abort",
                    () => {
                        reject(new Error("Upload aborted"));
                    },
                    false
                );

                xhr.open("POST", props.handleUrl || "");
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.send(formData);
            });

            selectedFile.value = result.filename;
            outputFile.value = null;
            showSelected();
            await refreshFileCount();
            emit("uploaded", result.filename);
        } catch (err) {
            alertStore.error(translations.ERROR ?? "Error", err.message ?? "");
            emit("error", err);
        } finally {
            if (input)
                input.value = "";
        }
    }

    function showUploader() {
        uploaderVisible.value = true;
        selectedVisible.value = false;
        listVisible.value = false;
    }

    function showSelected(event) {
        if(event)
            selectedFile.value = grid.value.getCurrentItem().fileName;

        uploaderVisible.value = false;
        selectedVisible.value = true;
        listVisible.value = false;
        loadPreview();
    }

    function showList() {
        uploaderVisible.value = false;
        selectedVisible.value = false;
        listVisible.value = true;
        refreshFiles();
    }

    function resetSelected() {
        selectedFile.value = null;
        outputFile.value = null;
        showUploader();
    }

    async function refreshFiles() {
        try {
            const data = await callFunction("getFiles");
            files.value = Array.isArray(data) ? data : [];
            fileCount.value = files.value.length;

            grid.value.setData(files.value);
        } catch (err) {
            emit("error", err);
        }
    }

    async function refreshFileCount() {
        try {
            const data = await callFunction("getFileCount");
            if (!isNaN(Number(data))) {
                fileCount.value = Number(data);
            }
        } catch (err) {
            emit("error", err);
        }
    }

    async function loadPreview() {
        previewStatus.value = "loading";
        try {
            const data = await callFunction("getPreviewData");
            previewRows.value = Array.isArray(data?.rows) ? data.rows : [];
            previewStatus.value = data?.status || (previewRows.value.length ? "ok" : "empty");
        } catch (err) {
            emit("error", err);
            previewRows.value = [];
            previewStatus.value = "error";
        }
    }

    function humanFileSize(bytes) {
        if (!bytes && bytes !== 0) return "-";
        const thresh = 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + " B";
        }
        const units = ["KB", "MB", "GB", "TB"];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);

        return bytes.toFixed(1) + " " + units[u];
    }

    async function downloadFile() {
        const item = grid.value.getCurrentItem(true);
        if (!item)
            return;

        const fileName = item.fileName;

        try {
            const { blob, response } = await callFunction(
                "downloadFile",
                { fileName },
                true
            );

            let filename = "";
            const disposition = response.headers.get("Content-Disposition");
            if (disposition && disposition.includes("attachment")) {
                const matches =
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                if (matches?.[1]) {
                    filename = matches[1].replace(/['"]/g, "");
                }
            }

            const url = window.URL || window.webkitURL;
            const downloadUrl = url.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = filename || fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            url.revokeObjectURL(downloadUrl);
        } catch (err) {
            emit("error", err);
        }
    }

    async function deleteFile() {
        const item = grid.value.getCurrentItem(true);
        if (!item)
            return;

        const fileName = item.fileName;

        try {
            await callFunction("deleteFile", { fileName });
            files.value = files.value.filter((f) => f.fileName !== fileName);
            fileCount.value = files.value.length;
            grid.value.setData(files.value);
            if (selectedFile.value === fileName) {
                resetSelected();
            }
        } catch (err) {
            emit("error", err);
        }
    }

    const flatColumns = computed(() => {
        const out = [];
        const walk = (items) => {
            for (const item of items) {
                if (item.children) {
                    walk(item.children);
                } else {
                    out.push(item);
                }
            }
        };
        walk(props.columns || []);
        return out;
    });

    function onColumnChange(index, value) {
        selectedColumns.value[index] = value || null;
    }

    async function submit(ev) {
        if (ev) ev.preventDefault();

        const selected = selectedColumns.value;
        const cols = flatColumns.value;
        const missingImportant = [];

        for (const col of cols) {
            if (!col.important) continue;
            const chosenIds = Object.values(selected).filter(Boolean);
            if (!chosenIds.includes(col.id)) {
                missingImportant.push(col.text ?? col.id);
            }
        }

        if (missingImportant.length) {
            alertStore.error(translations.MISSING_IMPORTANT, missingImportant.join(", "));
            return false;
        }

        const extraFormValues = {};
        if (ev && ev.target) {
            const formEl = ev.target;
            const fd = new FormData(formEl);
            for (const [key, value] of fd.entries()) {
                if (key === "HasHeader")
                    continue;
                extraFormValues[key] = value;
            }
        }

        const formData = {
            HasHeader: hasHeader.value,
            ...extraFormValues,
        };

        const payload = {
            columns: selected,
            form: formData,
        };

        try {
            if (props.returnBlob) {
                const { blob, response } = await callFunction(
                    "importFile",
                    payload,
                    true
                );

                let filename = "";
                const disposition = response.headers.get("Content-Disposition");
                if (disposition && disposition.includes("attachment")) {
                    const matches =
                        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                    if (matches?.[1]) {
                        filename = matches[1].replace(/['"]/g, "");
                    }
                }

                const url = window.URL || window.webkitURL;
                const downloadUrl = url.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = filename || "export.zip";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                url.revokeObjectURL(downloadUrl);
                emit("imported", { file: selectedFile.value, outputFile: null });
                return;
            }

            const data = await callFunction("importFile", payload, false);

            if (data.msg) {
                if(data.error) {
                    alertStore.error(data.msg, data.debug ?? "");
                } else {
                    alertStore.info(data.msg, data.debug ?? "");
                }

                if (data.trace && console?.table) {
                    // Debug info – keep parity with legacy behavior
                    console.log(data.debug ?? "-");
                    console.table(data.trace);
                }
            }

            if (!data.error && data.outputFile && props.hasOutput) {
                outputFile.value = data.outputFile;
            } else {
                outputFile.value = null;
            }

            emit("imported", { file: selectedFile.value, outputFile: data.outputFile });
        } catch (err) {
            alertStore.error(translations.ERROR, err.message ?? '');
            emit("error", err);
            return false;
        }
    }

    async function downloadOutputFile() {
        if (!outputFile.value) return;

        try {
            const { blob, response } = await callFunction(
                "downloadOutputFile",
                { fileName: outputFile.value },
                true
            );

            let filename = "";
            const disposition = response.headers.get("Content-Disposition");
            if (disposition && disposition.includes("attachment")) {
                const matches =
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                if (matches?.[1]) {
                    filename = matches[1].replace(/['"]/g, "");
                }
            }

            const url = window.URL || window.webkitURL;
            const downloadUrl = url.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = filename || "output.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            url.revokeObjectURL(downloadUrl);
        } catch (err) {
            emit("error", err);
        }
    }

    onMounted(() => {
        loadSelectedFromStorage();
        if (selectedFile.value)
            showSelected();
        else showUploader();
        refreshFileCount();
    });
</script>

<template>
    <div class="flex flex-col gap-4">
        <div v-show="uploaderVisible" class="flex items-center gap-2">
            <input
                type="file"
                class="border border-light-gray bg-light-gray rounded-lg w-[300px] h-10 px-2 py-2"
                title=" "
                accept="'csv,.xls,.xlsx"
                @change="uploadFile"
            />

            <Button @click="showList">
                <span class="mr-2">
                    {{ translations?.SELECT_FROM_HISTORY ?? "Select from history" }}
                </span>
                <span class="inline-flex items-center justify-center rounded-full bg-white px-2 py-1 text-xs font-semibold text-dark">
                    {{ fileCount }}
                </span>
            </Button>
        </div>

        <div
            v-show="listVisible"
            class="flex flex-col gap-2"
        >
            <Button @click="resetSelected" class="w-[200px]">
                {{ translations?.UPLOAD_FILE ?? 'Upload file' }}
            </Button>

            <DataGrid
                :data="files"
                :refresh="false"
                :filter="false"
                :columns-setting="false"
                :enabled-actions="{
                    add: false,
                    edit: false,
                    remove: false,
                }"
                :title="translations?.FILE_HISTORY ?? 'Files'"
                :id="type + '_importer_grid'"
                @row-dblclick="showSelected"
            >
                <template #columns>
                    <Column data="fileName" :label="translations?.FILE ?? 'File'" width="600" />
                    <Column data="fileSize" :label="translations?.SIZE ?? 'Size'" :format-function="humanFileSize" width="200" />
                    <Column data="createdDate" :label="translations?.DATE_CREATE ?? 'Created'" format="datetime" width="200" />
                    <Column data="modifiedDate" :label="translations?.DATE_MODIFIED ?? 'Modified'" format="datetime" width="200" />
                </template>
                <template #actions>
                    <Action
                        :label="translations.DOWNLOAD"
                        :visibility="{
                            header: false,
                            row: true,
                            context: true,
                        }"
                        icon="download"
                        @click="downloadFile"
                    />
                    <Action
                        :label="translations.REMOVE"
                        :visibility="{
                            header: false,
                            row: true,
                            context: true,
                        }"
                        icon="delete"
                        @click="deleteFile"
                    />
                </template>
            </DataGrid>
        </div>

        <div
            v-show="selectedVisible"
            class="flex flex-col gap-4"
        >
            <form class="flex flex-col gap-4" @submit="submit">
                <div class="flex items-center gap-4">
                    <Button @click="resetSelected" >
                        {{ translations?.CHANGE ?? "Change" }}
                    </Button>
                    <span class="text-sm font-semibold">
                        {{ selectedFile ?? "-" }}
                    </span>
                </div>

                <div class="flex flex-col gap-3 text-sm text-gray-700">
                    <Checkbox :label="translations?.CONTAINS_HEADER ?? 'File contains header row'" v-model="hasHeader" />
                    <slot name="form" />
                </div>

                <div class="w-full overflow-x-auto">
                    <table class="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th
                                    v-for="index in previewColumnCount || 1"
                                    :key="index"
                                    class="border-b border-light-gray bg-light-gray px-2 py-1 text-left font-semibold min-w-[200px]"
                                >
                                    <select
                                        class="block w-full px-1 py-0.5 focus:outline-none"
                                        :data-index="index - 1"
                                        :value="selectedColumns[index - 1]"
                                        @change="
                                            onColumnChange(
                                                String(index - 1),
                                                $event.target.value
                                            )
                                        "
                                    >
                                        <option value="">
                                            {{
                                                translations?.SELECT ?? "-"
                                            }}
                                        </option>
                                        <option
                                            v-for="col in flatColumns"
                                            :key="col.id"
                                            :value="col.id"
                                        >
                                            {{ col.text }}
                                            <span v-if="col.important"> *</span>
                                        </option>
                                    </select>
                                </th>
                            </tr>
                        </thead>

                        <tbody v-if="previewStatus === 'ok' && previewRows.length">
                            <tr
                                v-for="(row, rowIndex) in previewRows"
                                :key="rowIndex"
                                class="border-b border-light-gray"
                            >
                                <td
                                    v-for="(cell, colIndex) in row"
                                    :key="colIndex"
                                    class="px-2 py-1"
                                >
                                    <span :title="cell" class="line-clamp-1">
                                        {{ cell }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-2 flex items-center gap-3">
                    <Button type="submit" variant="green">
                        {{ translations?.IMPORT ?? "Import" }}
                    </Button>

                    <Button v-if="hasOutput && outputFile" @click="downloadOutputFile">
                        {{
                            translations?.DOWNLOAD_OUTPUT ??
                            "Download output"
                        }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>