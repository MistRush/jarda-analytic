<script setup>
import { onMounted, ref, watch, computed, onUnmounted } from "vue";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import { useCookies } from "@/Composables/useCookies";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    modelValue: String,
    height: {
        type: Number,
        default: 300,
    },
    compact: {
        type: Boolean,
        default: false,
    },
    customActions: {
        type: Array,
        default: [],
    },
    forcedRootBlock: {
        type: String,
        default: 'p',
    },
    placeholder: String,
    name: String,
    error: String,
    id: String,
    required: {
        type: Boolean,
        default: undefined,
    },
    label: [String, Function],
    help: String,
});

const emit = defineEmits(["update:modelValue", "change", "ctrl-enter-shortcut-pressed"]); // Pro aktualizaci hodnoty
const cookies = useCookies();

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const content = ref(props.modelValue);
const defVal = ref(props.modelValue);

const customActionIds = computed(() => {
    if (props.customActions.length > 0) {
        return " " + props.customActions.map((action) => action.id).join(" ");
    } else return "";
});

const compactSettings = computed(() => {
    if (!props.compact) return {};

    return {
        menubar: false,
        toolbar: "bold italic alignleft aligncenter alignright alignjustify outdent indent numlist bullist link |" + customActionIds.value + " showHideButton",
        quickbars_selection_toolbar: "bold italic quicklink quickimage quicktable",
        elementpath: false,
    };
});

const updateValue = (value) => {
    content.value = value;
    emit("update:modelValue", value);
    emit("change", value);
    emitFormChange();
};

watch(
    () => props.modelValue,
    (newVal) => {
        content.value = newVal;
    },
);

onMounted(() => {
    tinymce.init({
        selector: "textarea[id=" + inputId.value + "]:not([aria-hidden])",
        language: lang,
        branding: false,
        height: props.height,
        image_advtab: true,
        relative_urls: false,
        remove_script_host: true,
        document_base_url: basePath,
        paste_data_images: true,
        convert_urls: true,
        placeholder: props.placeholder,
        skin: cookies.getCookie("color-mode") === "prefer-dark" ? "oxide-dark" : null,
        content_style: cookies.getCookie("color-mode") === "prefer-dark"
                ? `
    body {
      background: #1e1e1e;
      color: #fff;
      caret-color: #fff;
    }
    a { color: #8ab4f8; }
  `
                : null,
        plugins: "preview paste searchreplace autolink code visualblocks visualchars fullscreen image link media table charmap hr nonbreaking anchor toc insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons responsivefilemanager",
        toolbar: "undo redo | bold italic underline strikethrough | formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview | insertfile image media responsivefilemanager link anchor" + customActionIds,
        quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
        // toolbar_sticky: true,
        toolbar_mode: "sliding",
        external_filemanager_path: basePath + "/jolanda/front/filemanager/",
        // external_plugins: { "filemanager" : basePath + "/core/filemanager/plugin.min.js"},
        menu: {
            file: { title: "File", items: "newdocument restoredraft | preview | print " },
            edit: { title: "Edit", items: "undo redo | cut copy paste | selectall | searchreplace" },
            view: {
                title: "View",
                items: "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen",
            },
            insert: {
                title: "Insert",
                items: "image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime",
            },
            format: {
                title: "Format",
                items: "bold italic underline strikethrough superscript subscript codeformat | formats blockformats align | forecolor backcolor | removeformat",
            },
            tools: { title: "Tools", items: "spellchecker spellcheckerlanguage | code wordcount" },
            table: { title: "Table", items: "inserttable | cell row column | tableprops deletetable" },
        },
        filemanager_access_key: settings.filemanagerKey,
        filemanager_relative_url: basePath,
        forced_root_block: props.forcedRootBlock,
        setup: function (editor) {
            editor.ui.registry.addIcon('microphone', '<svg width="24" height="24"><path fill="currentColor" d="M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2t2.125.875T15 5v6q0 1.25-.875 2.125T12 14m-1 7v-3.075q-2.6-.35-4.3-2.325T5 11h2q0 2.075 1.463 3.538T12 16t3.538-1.463T17 11h2q0 2.625-1.7 4.6T13 17.925V21z" /></svg>');

            editor.on("keydown", function (event) {
                if (event.ctrlKey && event.key === "Enter") {
                    event.preventDefault();
                    emit("ctrl-enter-shortcut-pressed");
                }
            });

            editor.on("blur change cut copy keyup paste focus focusout", function (e) {
                editor.save();
                updateValue(editor.getContent());
            });

            watch(content, (value, oldValue) => {
                if (editor.getContent() !== value && oldValue !== value) {
                    editor.setContent(value ?? "");
                }
            });

            let initialContent = "";
            editor.on("init", function () {
                initialContent = editor.getContent();

                if (props.compact) {
                    const el = editor.editorContainer.querySelector(".tox-toolbar__group:first-child");
                    if (el.style.display === "none") el.style.display = "flex";
                    else el.style.display = "none";
                }
            });

            editor.on("blur", function () {
                let currentContent = editor.getContent();
                if (currentContent !== initialContent) {
                    editor.save();
                    initialContent = currentContent; // Aktualizace původního obsahu
                    emit("change", currentContent);
                    emitFormChange();
                }
            });

            if (props.compact) {
                editor.ui.registry.addButton("showHideButton", {
                    tooltip: "Show/hide",
                    icon: "preview",
                    onAction: function () {
                        const el = editor.editorContainer.querySelector(".tox-toolbar__group:first-child");
                        if (el.style.display === "none") el.style.display = "flex";
                        else el.style.display = "none";
                    },
                });
            }

            if (props.customActions.length > 0) {
                props.customActions.forEach((customAction) => {
                    editor.ui.registry.addButton(customAction.id, {
                        tooltip: customAction.tooltip,
                        icon: customAction.icon,
                        onAction: function () {
                            customAction.action();
                        },
                    });
                });
            }
        },
        ...compactSettings.value,
    });
});

onUnmounted(() => {
    tinymce.remove("textarea[id=" + inputId.value + "]:not([aria-hidden])");
});
</script>

<template>
    <div
        :class="{
            'compact-editor': compact,
            error: error,
        }"
    >
        <label v-if="typeof props.label !== 'undefined'" :for="inputId">
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            <span v-if="required" class="required">*</span>
            <Help v-if="help" :help="help" />
        </label>
        <textarea data-mce="true" :id="inputId" :value="defVal" :name="name"></textarea>
        <ErrorMessage :error="error"></ErrorMessage>
    </div>
</template>

<style scoped>
.compact-editor:deep(.tox-tinymce) {
    border: 1px solid #cde;
    border-radius: 0.5rem;
}

:deep(.tox-tinymce) {
    border: 1px solid #cde;
    border-radius: 6px;
}

.error:deep(.tox-tinymce) {
    border-color: var(--color-error);
}

.compact-editor:deep(.tox .tox-tbtn:hover),
.compact-editor:deep(.tox .tox-tbtn:active),
.compact-editor:deep(.tox .tox-tbtn:focus),
.compact-editor:deep(.tox .tox-tbtn--enabled) {
    background: #cde8;
}

.compact-editor:deep(.tox .tox-editor-container) {
    position: relative;
}

.compact-editor:deep(.tox .tox-editor-header) {
    position: absolute;
    right: 0.25rem;
    top: 0.25rem;
    border-radius: 0.375rem;
    overflow: hidden;
    border: 1px solid #cde;
    opacity: 0.5;

    &:hover {
        opacity: 1;
    }
}

.compact-editor:deep(.tox .tox-toolbar__primary) {
    background: none;
}

.compact-editor:deep(.tox:not([dir="rtl"]) .tox-toolbar__group:not(:last-of-type)) {
    border-right: 1px solid #cde;
}

.compact-editor:deep(.tox .tox-statusbar) {
    border-top: 0;
    height: 10px;
}

.compact-editor:deep(.tox .tox-statusbar__text-container) {
    display: none;
}

.compact-editor:deep(.tox .tox-statusbar__resize-handle svg) {
    fill: #abd;
}

html.dark-theme {
    .compact-editor:deep(.tox-tinymce) {
        border: 1px solid #152234;
    }

    .compact-editor:deep(.tox .tox-edit-area__iframe) {
        background-color: #0c1119;
    }

    .compact-editor:deep(.tox .tox-statusbar) {
        background-color: #0c1119;
    }
}
</style>
