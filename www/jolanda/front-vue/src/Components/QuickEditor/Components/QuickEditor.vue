<script setup>
import { getCurrentInstance, nextTick, onMounted, reactive, ref, watch } from "vue";
import QuickEditorMapper from "@/Components/QuickEditor/js/Mappers/QuickEditorMapper";
import QuickEditor from "@/Components/QuickEditor/js/QuickEditor";
import QuickEditorDef from "@/Components/QuickEditor/js/QuickEditorDef";
import FormGroupComponent from "@/Components/OldForm/Components/Controls/FormGroup.vue";
import Dialog from "@/Components/Dialog/js/Dialog";
import { useTranslations } from "@/Composables/useTranslation.js";

const props = defineProps({
    json: String,
    quickEditorDef: Object,
    onAfterInit: Function,
    forGrid: Object,
    entityID: [String, Number],

    //Def from slots
    title: String,
    url: String,
});

const { translations } = useTranslations();
const quickEditorDef = reactive({ def: !props.json ? props.quickEditorDef : QuickEditorMapper.map(props.json) });

const quickEditor = ref(null);

const initEditor = () => {
    if (!quickEditorDef.def) {
        return;
    }

    if (props.forGrid) {
        quickEditorDef.def.forGrid = props.forGrid;

        if (quickEditorDef.def.forGrid.editor && quickEditorDef.def.forGrid.editor.parentRows) {
            quickEditorDef.def.forGrid.editor.parentRows.forEach((row) => {
                quickEditorDef.def.setParent(row.column, row.id);
            });
        }
    }

    window[quickEditorDef.def.id] = new QuickEditor(quickEditorDef.def);
    quickEditor.value = window[quickEditorDef.def.id];
    quickEditor.value.dialog = quickEditorDef.def.dialog instanceof Dialog ? quickEditorDef.def.dialog : window[quickEditorDef.def.dialog];
    quickEditorDef.def.quickEditor = quickEditor;

    if (props.onAfterInit && typeof props.onAfterInit === "function") {
        props.onAfterInit(quickEditor.value);
    }
};

onMounted(async () => {
    if (!quickEditorDef.def) {
        if (typeof props.title !== "undefined") {
            quickEditorDef.def = await createDefFromSlots();
        }
    } else {
        await nextTick();
        initEditor();
    }
});

watch(
    () => props.quickEditorDef,
    async (newVal, oldVal) => {
        if (newVal && oldVal === null) {
            quickEditorDef.def = newVal;
        }
    },
);

watch(
    () => quickEditorDef.def,
    async (newVal, oldVal) => {
        if (!oldVal && newVal) {
            await nextTick();
            initEditor();
        }
    },
);

//Def from slots
const instance = getCurrentInstance();

const createDefFromSlots = async () => {
    const def = new QuickEditorDef(props.label, props.url);

    if (typeof props.entityID !== "undefined") {
        def.setEntityId(props.entityID);
    }

    processInputs(def);

    return def;
};

const processInputs = (def) => {
    const defaultSlot = instance?.slots?.default;

    if (defaultSlot) {
        // Vykreslení slotu jako VNode
        let renderedDefault = defaultSlot();

        if (renderedDefault && renderedDefault[0]?.key === "_default") {
            renderedDefault = renderedDefault[0].children;
        }

        renderedDefault.forEach((vnode) => {
            const attrs = vnode.props;
            let control = null;

            if (vnode.type === "SetColumns") {
                def.setColumns(attrs.columns || attrs.cols);
                return;
            }

            if (vnode.type === "Empty") {
                control = def.addEmpty(attrs.columnSize);
            } else if (vnode.type === "TextBox") {
                control = def.addTextBox(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "Password") {
                control = def.addPassword(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "NumericBox") {
                control = def.addNumericBox(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "DateTimeBox") {
                control = def.addDateTimeBox(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "TimeBox") {
                control = def.addTimeBox(attrs.data, attrs.label, attrs.type, attrs.required);
            } else if (vnode.type === "Editor") {
                control = def.addEditor(attrs.data, attrs.label);
            } else if (vnode.type === "TextArea") {
                control = def.addTextArea(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "DateBox") {
                control = def.addDateBox(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "ComboBoxStore") {
                control = def.addComboBoxStore(attrs.data, attrs.label, attrs.storeURL, attrs.storeField, attrs.required);
            } else if (vnode.type === "AjaxComboBoxStore") {
                control = def.addAjaxComboBoxStore(attrs.data, attrs.label, attrs.storeURL, attrs.storeField, attrs.depends, attrs.required);
            } else if (vnode.type === "Select") {
                control = def.addSelect(attrs.data, attrs.label, attrs.enumValues, attrs.required);
            } else if (vnode.type === "ComboBoxEnum") {
                control = def.addComboBoxEnum(attrs.data, attrs.label, attrs.enumValues, attrs.required, attrs.multi);
            } else if (vnode.type === "MultiSelect") {
                control = def.addMultiSelect(attrs.data, attrs.label, attrs.enumValues, attrs.required);
            } else if (vnode.type === "FileBox") {
                control = def.addFileBox(attrs.data, attrs.label, attrs.fileUploadUrl, attrs.preview, attrs.path);
            } else if (vnode.type === "MultiFileBox") {
                control = def.addMultiFileBox(attrs.data, attrs.label, attrs.fileUploadUrl, attrs.callback, attrs.options);
            } else if (vnode.type === "CheckBox") {
                control = def.addCheckBox(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "BoolRadioButton") {
                control = def.addBoolRadioButton(attrs.data, attrs.label, attrs.noneOption);
            } else if (vnode.type === "RadioButton") {
                control = def.addRadioButton(attrs.data, attrs.label, attrs.items, attrs.required);
            } else if (vnode.type === "CurrencyBox") {
                control = def.addCurrencyBox(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "FloatingPointBox") {
                control = def.addFloatingPointBox(attrs.data, attrs.label, attrs.required);
            } else if (vnode.type === "Hidden") {
                control = def.addHidden(attrs.data);
            } else if (vnode.type === "Html") {
                control = def.addHtml(attrs.html);
            } else if (vnode.type === "BlockEditor") {
                control = def.addBlockEditor(attrs.data);
            } else if (vnode.type === "DynamicBlockEditor") {
                control = def.addDynamicBlockEditor(attrs.data, attrs.defaultData, attrs.datas);
            } else if (vnode.type === "FormGroup") {
                //TODO
                control = def.addFormGroup(attrs.title);
            }

            if (control) {
                if (typeof attrs.value !== "undefined") {
                    if (typeof control.setValue === "function") {
                        control.setValue(attrs.value);
                    }
                }
                if (typeof attrs.accesskey !== "undefined") {
                    if (typeof control.setAccesskey === "function") {
                        control.setAccesskey(attrs.accesskey);
                    }
                }
                if (typeof attrs.placeholder !== "undefined") {
                    if (typeof control.setPlaceholder === "function") {
                        control.setPlaceholder(attrs.placeholder);
                    }
                }
                if (typeof attrs.required !== "undefined") {
                    if (typeof control.setRequired === "function") {
                        control.setRequired(attrs.required);
                    }
                }
                if (typeof attrs.renderLabel !== "undefined") {
                    if (typeof control.setRenderLabel === "function") {
                        control.setRenderLabel(attrs.renderLabel);
                    }
                }
                if (typeof attrs.rules !== "undefined") {
                    attrs.rules.forEach((rule) => {
                        if (typeof control.addRule === "function") {
                            control.addRule(rule.validator, rule.message, rule.params);
                        }
                    });
                }
                if (typeof attrs.columnSize !== "undefined") {
                    if (typeof control.setColumnSize === "function") {
                        control.setColumnSize(attrs.columnSize);
                    }
                }
                if (typeof attrs.help !== "undefined") {
                    if (typeof control.setHelp === "function") {
                        control.setHelp(attrs.help);
                    }
                }
                if (typeof attrs.disabled !== "undefined") {
                    if (typeof control.setDisabled === "function") {
                        control.setDisabled(attrs.disabled);
                    }
                }
                if (typeof attrs.readOnly !== "undefined") {
                    if (typeof control.setReadOnly === "function") {
                        control.setReadOnly(attrs.readOnly);
                    }
                }
            }
        });
    }
};

defineExpose({
    quickEditor,
});
</script>

<template>
    <form :id="quickEditorDef.def.getId()" v-if="quickEditorDef.def">
        <FormGroupComponent :form-group="quickEditorDef.def"></FormGroupComponent>
    </form>
    <button class="btn btn-success float-right" @click="quickEditor.confirm()" v-if="quickEditorDef.def">
        {{ translations.SAVE_CLOSE }}
    </button>
    <!--    <Dialog>-->
    <!--        <template #title>-->
    <!--            {{ quickEditor.getLabel() }}-->
    <!--        </template>-->
    <!--        <template #content>-->

    <!--        </template>-->
    <!--        <template #footer>-->

    <!--        </template>-->
    <!--    </Dialog>-->
</template>
