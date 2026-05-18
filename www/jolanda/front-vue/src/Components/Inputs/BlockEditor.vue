<script setup>
import Button from "./Button.vue";
import { markRaw, reactive, ref, watch, onMounted } from "vue";
import grapesjs from "grapesjs/dist/grapes.min.js";
import "grapesjs/dist/css/grapes.min.css";
import { useAlerts } from "@/Composables/useAlerts.js";
import { useTranslations } from "@/Composables/useTranslation.js";
import Modal from "@/Components/Modal/Modal.vue";
import { useForm } from "@/Components/Form/composables/useForm";
import Help from "@/Components/Other/Help.vue";
import { codeToHtml } from "shiki";

const props = defineProps({
    modelValue: String,
    id: String,
    name: String,
    required: {
        type: Boolean,
        default: undefined,
    },
    label: [String, Function],
    help: String,
});

const state = reactive({
    textValue: props.modelValue,
    fileManager: {
        show: false,
    },
    codeEditor: {
        show: false,
        html: null,
        css: null,
        highlightedHtmlCode: "",
        highlightedCssCode: "",
    },
});

const emit = defineEmits(["update:modelValue", "addBlocks", "change"]);

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const editor = ref(null);
const containerRef = ref(null);
const alerts = useAlerts();
const { translations } = useTranslations();

watch(
    () => props.modelValue,
    (newVal) => {
        state.textValue = newVal;
    },
);

const updateValue = (value) => {
    state.textValue = value;
    emit("update:modelValue", value);
    emit("change", value);
    emitFormChange();
};

const initGrapes = (reinit = false, reset = false) => {
    if (editor.value && !reinit) return;
    else {
        if (editor.value) {
            editor.value.destroy();
            editor.value = null;
        }
    }

    editor.value = grapesjs.init(
        markRaw({
            container: containerRef.value,
            storageManager: { type: "null" },
            fromElement: true,
            height: "600px",
            storeComponents: false,
            noticeOnUnload: false,

            canvas: {
                styles: ["https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css", "/front/css/libs.min.css", "/front/css/style.min.css"],
                scripts: ["https://code.jquery.com/jquery-3.3.1.slim.min.js", "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"],
            },
            assetManager: {
                custom: true,
            },
            /*assetManager: {
        assets: [
            'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
            // Pass an object with your properties
            {
                type: 'image',
                src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
                height: 350,
                width: 250,
                name: 'displayName'
            },
            {
                // As the 'image' is the base type of assets, omitting it will
                // be set as `image` by default
                src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
                height: 350,
                width: 250,
                name: 'displayName'
            },
        ],
    },*/
            customStyleManager: [
                {
                    name: "General",
                    buildProps: ["float", "display", "position", "top", "right", "left", "bottom"],
                    properties: [
                        {
                            name: "Alignment",
                            property: "float",
                            type: "radio",
                            defaults: "none",
                            list: [
                                { value: "none", className: "fa fa-times" },
                                { value: "left", className: "fa fa-align-left" },
                                { value: "right", className: "fa fa-align-right" },
                            ],
                        },
                        { property: "position", type: "select" },
                    ],
                },
                {
                    name: "Dimension",
                    open: false,
                    buildProps: ["width", "flex-width", "height", "max-width", "min-height", "margin", "padding"],
                    properties: [
                        {
                            id: "flex-width",
                            type: "integer",
                            name: "Width",
                            units: ["px", "%"],
                            property: "flex-basis",
                            toRequire: 1,
                        },
                        {
                            property: "margin",
                            properties: [
                                { name: "Top", property: "margin-top" },
                                { name: "Right", property: "margin-right" },
                                { name: "Bottom", property: "margin-bottom" },
                                { name: "Left", property: "margin-left" },
                            ],
                        },
                        {
                            property: "padding",
                            properties: [
                                { name: "Top", property: "padding-top" },
                                { name: "Right", property: "padding-right" },
                                { name: "Bottom", property: "padding-bottom" },
                                { name: "Left", property: "padding-left" },
                            ],
                        },
                    ],
                },
                {
                    name: "Typography",
                    open: false,
                    buildProps: ["font-family", "font-size", "font-weight", "letter-spacing", "color", "line-height", "text-align", "text-decoration", "text-shadow"],
                    properties: [
                        { name: "Font", property: "font-family" },
                        { name: "Weight", property: "font-weight" },
                        { name: "Font color", property: "color" },
                        {
                            property: "text-align",
                            type: "radio",
                            defaults: "left",
                            list: [
                                { value: "left", name: "Left", className: "fa fa-align-left" },
                                { value: "center", name: "Center", className: "fa fa-align-center" },
                                { value: "right", name: "Right", className: "fa fa-align-right" },
                                { value: "justify", name: "Justify", className: "fa fa-align-justify" },
                            ],
                        },
                        {
                            property: "text-decoration",
                            type: "radio",
                            defaults: "none",
                            list: [
                                { value: "none", name: "None", className: "fa fa-times" },
                                { value: "underline", name: "underline", className: "fa fa-underline" },
                                { value: "line-through", name: "Line-through", className: "fa fa-strikethrough" },
                            ],
                        },
                        {
                            property: "text-shadow",
                            properties: [
                                { name: "X position", property: "text-shadow-h" },
                                { name: "Y position", property: "text-shadow-v" },
                                { name: "Blur", property: "text-shadow-blur" },
                                { name: "Color", property: "text-shadow-color" },
                            ],
                        },
                    ],
                },
                {
                    name: "Decorations",
                    open: false,
                    buildProps: ["opacity", "border-radius", "border", "box-shadow", "background-bg"],
                    properties: [
                        {
                            type: "slider",
                            property: "opacity",
                            defaults: 1,
                            step: 0.01,
                            max: 1,
                            min: 0,
                        },
                        {
                            property: "border-radius",
                            properties: [
                                { name: "Top", property: "border-top-left-radius" },
                                { name: "Right", property: "border-top-right-radius" },
                                { name: "Bottom", property: "border-bottom-left-radius" },
                                { name: "Left", property: "border-bottom-right-radius" },
                            ],
                        },
                        {
                            property: "box-shadow",
                            properties: [
                                { name: "X position", property: "box-shadow-h" },
                                { name: "Y position", property: "box-shadow-v" },
                                { name: "Blur", property: "box-shadow-blur" },
                                { name: "Spread", property: "box-shadow-spread" },
                                { name: "Color", property: "box-shadow-color" },
                                { name: "Shadow type", property: "box-shadow-type" },
                            ],
                        },
                        {
                            id: "background-bg",
                            property: "background",
                            type: "bg",
                        },
                    ],
                },
                {
                    name: "Extra",
                    open: false,
                    buildProps: ["transition", "perspective", "transform"],
                    properties: [
                        {
                            property: "transition",
                            properties: [
                                { name: "Property", property: "transition-property" },
                                { name: "Duration", property: "transition-duration" },
                                { name: "Easing", property: "transition-timing-function" },
                            ],
                        },
                        {
                            property: "transform",
                            properties: [
                                { name: "Rotate X", property: "transform-rotate-x" },
                                { name: "Rotate Y", property: "transform-rotate-y" },
                                { name: "Rotate Z", property: "transform-rotate-z" },
                                { name: "Scale X", property: "transform-scale-x" },
                                { name: "Scale Y", property: "transform-scale-y" },
                                { name: "Scale Z", property: "transform-scale-z" },
                            ],
                        },
                    ],
                },
                {
                    name: "Flex",
                    open: false,
                    properties: [
                        {
                            name: "Flex Container",
                            property: "display",
                            type: "select",
                            defaults: "block",
                            list: [
                                { value: "block", name: "Disable" },
                                { value: "flex", name: "Enable" },
                            ],
                        },
                        {
                            name: "Flex Parent",
                            property: "label-parent-flex",
                            type: "integer",
                        },
                        {
                            name: "Direction",
                            property: "flex-direction",
                            type: "radio",
                            defaults: "row",
                            list: [
                                {
                                    value: "row",
                                    name: "Row",
                                    className: "icons-flex icon-dir-row",
                                    title: "Row",
                                },
                                {
                                    value: "row-reverse",
                                    name: "Row reverse",
                                    className: "icons-flex icon-dir-row-rev",
                                    title: "Row reverse",
                                },
                                {
                                    value: "column",
                                    name: "Column",
                                    title: "Column",
                                    className: "icons-flex icon-dir-col",
                                },
                                {
                                    value: "column-reverse",
                                    name: "Column reverse",
                                    title: "Column reverse",
                                    className: "icons-flex icon-dir-col-rev",
                                },
                            ],
                        },
                        {
                            name: "Justify",
                            property: "justify-content",
                            type: "radio",
                            defaults: "flex-start",
                            list: [
                                {
                                    value: "flex-start",
                                    className: "icons-flex icon-just-start",
                                    title: "Start",
                                },
                                {
                                    value: "flex-end",
                                    title: "End",
                                    className: "icons-flex icon-just-end",
                                },
                                {
                                    value: "space-between",
                                    title: "Space between",
                                    className: "icons-flex icon-just-sp-bet",
                                },
                                {
                                    value: "space-around",
                                    title: "Space around",
                                    className: "icons-flex icon-just-sp-ar",
                                },
                                {
                                    value: "center",
                                    title: "Center",
                                    className: "icons-flex icon-just-sp-cent",
                                },
                            ],
                        },
                        {
                            name: "Align",
                            property: "align-items",
                            type: "radio",
                            defaults: "center",
                            list: [
                                {
                                    value: "flex-start",
                                    title: "Start",
                                    className: "icons-flex icon-al-start",
                                },
                                {
                                    value: "flex-end",
                                    title: "End",
                                    className: "icons-flex icon-al-end",
                                },
                                {
                                    value: "stretch",
                                    title: "Stretch",
                                    className: "icons-flex icon-al-str",
                                },
                                {
                                    value: "center",
                                    title: "Center",
                                    className: "icons-flex icon-al-center",
                                },
                            ],
                        },
                        {
                            name: "Flex Children",
                            property: "label-parent-flex",
                            type: "integer",
                        },
                        {
                            name: "Order",
                            property: "order",
                            type: "integer",
                            defaults: 0,
                            min: 0,
                        },
                        {
                            name: "Flex",
                            property: "flex",
                            type: "composite",
                            properties: [
                                {
                                    name: "Grow",
                                    property: "flex-grow",
                                    type: "integer",
                                    defaults: 0,
                                    min: 0,
                                },
                                {
                                    name: "Shrink",
                                    property: "flex-shrink",
                                    type: "integer",
                                    defaults: 0,
                                    min: 0,
                                },
                                {
                                    name: "Basis",
                                    property: "flex-basis",
                                    type: "integer",
                                    units: ["px", "%", ""],
                                    unit: "",
                                    defaults: "auto",
                                },
                            ],
                        },
                        {
                            name: "Align",
                            property: "align-self",
                            type: "radio",
                            defaults: "auto",
                            list: [
                                {
                                    value: "auto",
                                    name: "Auto",
                                },
                                {
                                    value: "flex-start",
                                    title: "Start",
                                    className: "icons-flex icon-al-start",
                                },
                                {
                                    value: "flex-end",
                                    title: "End",
                                    className: "icons-flex icon-al-end",
                                },
                                {
                                    value: "stretch",
                                    title: "Stretch",
                                    className: "icons-flex icon-al-str",
                                },
                                {
                                    value: "center",
                                    title: "Center",
                                    className: "icons-flex icon-al-center",
                                },
                            ],
                        },
                    ],
                },
            ],
        }),
    );

    if (editor.value) {
        //TODO dynamic??
        // if (this.dynamic) {
        //     this.dynamicNamesSelect.$element.on("change", (e) => {
        //         let val = $(e.currentTarget).val();
        //         this.dataInputName = val;
        //         this.dataInput = this.form.getInputObject(val);
        //         this.$element.parent().attr("blockeditordata", val);
        //         this.loadDataFromDataInput();
        //     });
        // }

        editor.value.on("update", () => {
            updateValue(
                JSON.stringify({
                    html: getModifiedGrapesHTML(editor.value.storeData().html),
                    css: editor.value.storeData().css,
                }),
            );
        });

        if (reset) {
            editor.value.loadData({
                html: '<div class="editor-container container"></div>',
                css: "* { box-sizing: border-box; } body {margin: 0;}",
            });

            updateValue(
                JSON.stringify({
                    html: '<div class="editor-container container"></div>',
                    css: "* { box-sizing: border-box; } body {margin: 0;}",
                }),
            );
        }

        editor.value.on("load", () => {
            if (state.textValue) {
                loadDataFromDataInput();
            } else {
                editor.value.loadData({ html: '<div class="editor-container container"></div>' });
            }

            const iframe = editor.value.getEl().querySelector("iframe");
            if (!iframe || !iframe.contentWindow || !iframe.contentWindow.document) return;

            const doc = iframe.contentWindow.document;

            const style = doc.createElement("style");
            style.textContent = `
  .editor-container[data-gjs-type] {
    min-height: 100vh;
    padding-bottom: 30px;
  }
`;

            doc.head.appendChild(style);
        });

        addBlocks(editor.value);

        editor.value.Panels.addButton("options", [
            {
                id: "copy",
                className: "fa fa-copy icon-blank",
                command: (editor1, sender) => {
                    localStorage.setItem(
                        "grapesjs_copy",
                        JSON.stringify({
                            html: getModifiedGrapesHTML(editor1.storeData().html),
                            css: editor1.storeData().css,
                        }),
                    );

                    alerts.info(translations.COPY_TO_CLIPBOARD);
                },
                attributes: { title: translations.BLOCKEDITOR_CLIPBOARD_COPY },
            },
        ]);

        editor.value.Panels.addButton("options", [
            {
                id: "paste",
                className: "fa fa-paste icon-blank",
                command: function (editor1, sender) {
                    let data = localStorage.getItem("grapesjs_copy");

                    if (!data) {
                        alerts.error(translations.CLIPBOARD_IS_EMPTY);
                        return;
                    }

                    let isConfirm = confirm(translations.BLOCKEDITOR_PASTE_CONFIRM);

                    if (data && isConfirm) {
                        data = JSON.parse(data);
                        editor1.loadData(data);
                    }
                },
                attributes: { title: translations.BLOCKEDITOR_CLIPBOARD_PASTE },
            },
        ]);

        editor.value.Panels.addButton("options", [
            {
                id: "file-manager",
                className: "fa fa-folder-open",
                command: function (editor1, sender) {
                    state.fileManager.show = true;
                },
            },
        ]);

        editor.value.DomComponents.getWrapper().set({ droppable: false, selectable: false, hoverable: false });

        editor.value.DomComponents.addType("default", {
            model: {
                defaults: {
                    draggable: false, // lze je umistovat dovnitr jinych bloku?
                    removable: false, // muze byt odstranen?
                    droppable: false, // lze umistit dovnitr jiny blok?
                    selectable: false,
                    hoverable: false,
                },
            },
        });

        editor.value.DomComponents.addType("drop-inside", {
            //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
            isComponent: (el) => (typeof el.classList !== "undefined" ? Object.values(el.classList).includes("drop-inside") : false),
            model: {
                defaults: {
                    draggable: false, // lze je umistovat dovnitr jinych bloku?
                    removable: false, // muze byt odstranen?
                    droppable: true, // lze umistit dovnitr jiny blok?
                    selectable: false,
                    hoverable: false,
                },
            },
        });
        editor.value.DomComponents.addType("editor-container", {
            //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
            isComponent: (el) => (typeof el.classList !== "undefined" ? Object.values(el.classList).includes("editor-container") : false),
            model: {
                defaults: {
                    draggable: false, // lze je umistovat dovnitr jinych bloku?
                    removable: false, // muze byt odstranen?
                    droppable: true, // lze umistit dovnitr jiny blok?
                    selectable: true,
                    hoverable: true,
                },
            },
        });

        editor.value.DomComponents.addType("not-editable", {
            //Nastavuje pro které bloky platí přepínáč (momentálně musí obsahovat classu section-with-image)
            isComponent: (el) => (typeof el.classList !== "undefined" ? Object.values(el.classList).includes("not-editable") : false),
            model: {
                defaults: {
                    draggable: false, // lze je umistovat dovnitr jinych bloku?
                    removable: false, // muze byt odstranen?
                    droppable: false, // lze umistit dovnitr jiny blok?
                    selectable: false,
                    hoverable: false,
                    highlightable: false,
                },
            },
        });

        editor.value.on("run:core:open-layers", () => editor.value.Layers.setRoot(".editor-container"));

        editor.value.on("asset:custom", (props) => {
            closeFileManager();
            props.assets = [];

            if (props.open) {
                let iframe = document.createElement("iframe");
                iframe.setAttribute("width", "100%");
                iframe.setAttribute("height", "500px");
                iframe.setAttribute("id", props.name + "_filemanager");
                iframe.setAttribute("class", "_blockeditor_filemanager");
                iframe.setAttribute("src", "/admin/file-manager/dialog.php?type=1&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=/files/");
                iframe.onload = function () {
                    iframe.contentWindow.apply_any = (e) => {
                        console.log(e);
                        let asset = props.am.add(e);
                        props.select(asset);
                        props.close();
                    };
                };

                if (!document.getElementById(props.name + "_filemanager")) {
                    props.container.appendChild(iframe);
                }
            }
        });

        // pridani inline stylu pro link a zmenu barvy
        const rte = editor.value.RichTextEditor;
        rte.add("link", {
            icon: '<i class="fa fa-chain"></i>',
            attributes: { title: "Link" },
            // Example on it's easy to wrap a selected content
            result: (rte) => rte.insertHTML(`<a href="#">${rte.selection()}</a>`),
        });
        rte.add("text-color", {
            icon: `<select class="gjs-field">
                        <option>Bez barvy</option>
                        <option value="text-primary">Primární</option>
                        <option value="text-success">Pozitivní</option>
                        <option value="text-danger">Negativní</option>
                        <option value="text-warning">Varování</option>
                      </select>`,
            // Bind the 'result' on 'change' listener
            event: "change",
            result: (rte, action) => {
                var value = action.btn.firstChild.value;
                if (value != "Bez barvy") {
                    // value is a string
                    rte.insertHTML(`<span class="${value}">${rte.selection()}</span>`);
                } else {
                    rte.insertHTML(`${rte.selection()}`);
                }
            },
        });
    }

    initCodeEditor();
};

const initCodeEditor = () => {
    editor.value.on("load", () => {
        const body = editor.value.Canvas.getDocument().body;
        body.style.overflow = "auto";
    });

    editor.value.on("load", () => {
        editor.value.Panels.addButton("options", {
            id: "edit-code",
            className: "fa fa-code",
            command: "open-code-editor",
            attributes: { title: "Edit Source Code" },
        });

        editor.value.Commands.add("open-code-editor", {
            run(editor) {
                state.codeEditor.html = formatHTML(editor.getHtml());
                state.codeEditor.css = formatCSS(editor.getCss());
                highlightHtml();
                highlightCss();
                state.codeEditor.show = true;
            },
        });
    });
};

const getModifiedGrapesHTML = (html) => {
    html = html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>\<div( alignment\=\"text\-left\")?[a-zA-Z0-9"= ]*\>/g, "<br/><br/>");
    return html.replace(/\<\/div\>\<div\>\<br\/\>\<\/div\>/g, "<br/><br/></div>");
};

const loadDataFromDataInput = () => {
    if (state.textValue) {
        try {
            editor.value.loadData(JSON.parse(state.textValue));
        } catch {
            editor.value.loadData({ html: '<div class="editor-container container"></div>' });
        }
    } else {
        editor.value.loadData({ html: '<div class="editor-container container"></div>' });
    }
};

const formatHTML = (html) => {
    const indentChar = "  "; // Dvě mezery pro odsazení
    let indentLevel = 0;

    return html
        .replace(/>\s+</g, "><") // Odstranit mezery mezi tagy
        .split(/(<[^>]+>)/g) // Rozdělit podle HTML tagů
        .filter((part) => part.trim()) // Odstranit prázdné části
        .map((part) => {
            if (part.match(/^<\/\w/)) {
                // Uzavírací tag snižuje odsazení
                indentLevel = Math.max(indentLevel - 1, 0); // Zabránit záporným hodnotám
            }

            const formattedPart = `${indentChar.repeat(indentLevel)}${part}`;

            if (part.match(/^<\w[^>]*[^\/]>$/)) {
                // Otevírací tag zvyšuje odsazení, pokud není self-closing
                indentLevel++;
            }

            return formattedPart;
        })
        .join("\n"); // Spojit do čitelného formátu
};

const formatCSS = (css) => {
    const rules = css
        .split(/(?<=})/)
        .map((rule) => rule.trim())
        .filter((rule) => rule);

    return rules
        .map((rule) => {
            const [selector, properties] = rule.split(/{/);
            if (!properties) return "";

            const formattedProperties = properties
                .replace(/}/g, "")
                .split(";")
                .map((property) => property.trim())
                .filter((property) => property)
                .map((property) => `    ${property};`)
                .join("\n");

            return `${selector.trim()} {\n${formattedProperties}\n}`;
        })
        .join("\n\n");
};

const closeFileManager = () => {
    state.fileManager.show = false;
};

const closeCodeEditor = () => {
    state.codeEditor.show = false;
    state.codeEditor.html = null;
    state.codeEditor.css = null;
};

const saveEditorCode = () => {
    if (state.codeEditor.html && state.codeEditor.css) {
        editor.value.loadData({ html: state.codeEditor.html, css: state.codeEditor.css });
        closeCodeEditor();
    }
};

onMounted(() => {
    initGrapes();
});

//HTML/CSS EDITOR HIGHLIGHTER
const highlightHtml = async () => {
    state.codeEditor.highlightedHtmlCode = await codeToHtml(state.codeEditor.html, {
        lang: "html",
        themes: {
            light: "github-light-default",
            dark: "github-dark-default",
        },
    });
};

const highlightCss = async () => {
    state.codeEditor.highlightedCssCode = await codeToHtml(state.codeEditor.css, {
        lang: "css",
        themes: {
            light: "github-light-default",
            dark: "github-dark-default",
        },
    });
};

const addBlocks = (editor) => {
    emit("addBlocks", editor);
};

const syncHtmlScroll = () => {
    if (!inputHtmlRef.value || !highlightHtmlRef.value) return;
    highlightHtmlRef.value.scrollTop = inputHtmlRef.value.scrollTop;
    highlightHtmlRef.value.scrollLeft = inputHtmlRef.value.scrollLeft;
};

const syncCssScroll = () => {
    if (!inputCssRef.value || !highlightCssRef.value) return;
    highlightCssRef.value.scrollTop = inputCssRef.value.scrollTop;
    highlightCssRef.value.scrollLeft = inputCssRef.value.scrollLeft;
};

const inputHtmlRef = ref(null);
const highlightHtmlRef = ref(null);

const inputCssRef = ref(null);
const highlightCssRef = ref(null);
</script>

<template>
    <div>
        <label v-if="typeof props.label !== 'undefined'" :for="inputId">
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            <span v-if="required" class="required">*</span>
            <Help v-if="help" :help="help" />
        </label>
        <div ref="containerRef" class="block-editor" style="width: 100%; height: 600px" :id="inputId" :name="name"></div>

        <!--        iframe.setAttribute("src", basePath + "/admin/file-manager/dialog.php?type=0&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=" + basePath + "/files/");-->
        <Modal :isVisible="true" v-if="state.fileManager.show" @close="closeFileManager">
            <template #body>
                <iframe width="100%" height="500px" :id="props.name + '_filemanager'" class="_blockeditor_filemanager" src="/admin/file-manager/dialog.php?type=0&lang=cs&akey=KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw&basePath=/files/"></iframe>
            </template>
        </Modal>
        <Modal :isVisible="true" v-if="state.codeEditor.show" @close="closeCodeEditor" closeButton>
            <template #header> Source Code Editor </template>
            <template #body>
                <div class="row">
                    <div class="col-12 md:col-7">
                        <div class="mb-2">HTML</div>
                        <div class="html-editor-wrapper">
                            <textarea ref="inputHtmlRef" @scroll="syncHtmlScroll" id="block-editor-code-editor-html" style="width: 100%" rows="15" v-model="state.codeEditor.html" @input="highlightHtml" :spellcheck="false" />
                            <pre ref="highlightHtmlRef" class="highlight-layer" v-html="state.codeEditor.highlightedHtmlCode" aria-hidden="true"></pre>
                        </div>
                    </div>
                    <div class="col-12 md:col-5">
                        <div class="mb-2">CSS</div>
                        <div class="css-editor-wrapper">
                            <textarea ref="inputCssRef" @scroll="syncCssScroll" id="block-editor-code-editor-css" style="width: 100%" rows="15" v-model="state.codeEditor.css" @input="highlightCss" :spellcheck="false" />
                            <pre ref="highlightCssRef" class="highlight-layer" v-html="state.codeEditor.highlightedCssCode" aria-hidden="true"></pre>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <Button @click="saveEditorCode" variant="primary">{{ translations.SAVE }}</Button>
            </template>
        </Modal>
    </div>
</template>

<style scoped>
.html-editor-wrapper,
.css-editor-wrapper {
    position: relative;
    width: 100%;
    max-width: 800px;
    height: 300px;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    background: #0d1117;
}

/* Zvýrazněná vrstva */
.highlight-layer {
    pointer-events: none;
    overflow: auto;
    color: white;
    border-radius: 4px;
    z-index: 0;
    background: transparent;
}

.highlight-layer,
#block-editor-code-editor-html,
#block-editor-code-editor-css {
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
}

.highlight-layer,
#block-editor-code-editor-html,
#block-editor-code-editor-css,
.highlight-layer * {
    inset: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    tab-size: 2;
    line-height: 1.5;
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
}

#block-editor-code-editor-html,
#block-editor-code-editor-css {
    resize: none;
    padding: 10px;
    background: transparent;
    color: transparent;
    caret-color: white;
    border: none;
    resize: none;
    outline: none;
    z-index: 1;
}

#block-editor-code-editor-html::selection,
#block-editor-code-editor-css::selection {
    background: rgba(255, 255, 255, 0.3);
}

:deep(.shiki .line) {
    background: transparent !important;
}

:deep(.shiki) {
    padding: 10px;
    background: transparent !important;
}
</style>
