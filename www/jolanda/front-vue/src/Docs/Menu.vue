<script setup>
import { provide } from "vue";
import MenuLink from "./MenuLink.vue";

const emit = defineEmits(["update:active"]);

const activeLink = (link) => {
    emit("update:active", link);
};

provide("activeLink", activeLink);
</script>

<template>
    <div>
        <div>
            <div class="font-bold">App</div>
            <div class="pl-4 mt-2">
                <MenuLink title="App" link="app/app" />
                <MenuLink title="Instalace" link="app/install" />
                <MenuLink title="Dokumentace" link="app/docs" />
                <MenuLink title="Helpbar" link="app/helpbar" />
                <MenuLink title="Page" link="app/page" />
                <MenuLink title="Tab" link="app/tab" />
                <MenuLink title="Layout" link="app/layout" />
                <MenuLink title="Translations" link="app/translations" />
                <MenuLink title="Ajax" link="app/ajax" />
                <MenuLink title="Error handler" link="app/errorhandler" />
                <MenuLink title="Alerts" link="app/alerts" />
                <MenuLink title="Manager" link="app/manager" />
                <MenuLink title="Styling" link="app/styling" />
                <MenuLink title="AppRouterLink" link="app/approuterlink" />
            </div>
        </div>
        <div>
            <div class="font-bold">DataGrid</div>
            <div class="pl-4 mt-2">
                <MenuLink title="DataGrid" link="datagrid/datagrid" />
                <MenuLink title="Column" link="datagrid/column" />
            </div>
        </div>
        <div>
            <div class="font-bold">Editor</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Editor" link="editor/editor" />
                <MenuLink title="EditorTab" link="editor/editortab" />
                <MenuLink title="EditorGroup" link="editor/editorgroup" />
            </div>
        </div>
        <div>
            <div class="font-bold">Form</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Form" link="components/form/form" />
            </div>
        </div>
        <div class="mt-4">
            <div class="font-bold">Inputy</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Button" link="components/inputs/button" />
                <MenuLink title="Checkbox" link="components/inputs/checkbox" />
                <MenuLink title="DatePicker" link="components/inputs/datepicker" />
                <MenuLink title="EditorFileInputDoc" link="components/inputs/editorfileinput" />
                <MenuLink title="InputField" link="components/inputs/inputfield" />
                <MenuLink title="Radio" link="components/inputs/radio" />
                <MenuLink title="RadioBool" link="components/inputs/radiobool" />
                <MenuLink title="RadioGroup" link="components/inputs/radiogroup" />
                <MenuLink title="Select" link="components/inputs/select" />
                <MenuLink title="Slider" link="components/inputs/slider" />
                <MenuLink title="Switch" link="components/inputs/switch" />
                <MenuLink title="TextArea" link="components/inputs/textarea" />
                <MenuLink title="TinyMCE" link="components/inputs/tinymce" />
                <MenuLink title="RelationSwitcher" link="components/inputs/relationswitcher" />
                <MenuLink title="BlockEditor" link="components/inputs/blockeditor" />
                <MenuLink title="DragAndDropFileUploader" link="components/inputs/draganddropfileuploader" />
            </div>
        </div>
        <div class="mt-4">
            <div class="font-bold">Komponenty</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Modal" link="components/modal/modal" />
                <MenuLink title="Tag" link="components/other/tag/tag" />
                <MenuLink title="HighlightText" link="components/other/highlighttext" />
                <MenuLink title="Accordion" link="components/other/accordion" />
                <MenuLink title="Tooltip" link="components/other/tooltip" />
                <MenuLink title="Pagination" link="components/other/pagination" />
                <MenuLink title="Copy" link="components/other/copy" />
                <MenuLink title="TreeView" link="components/other/treeview/treeview" />
                <MenuLink title="Skeleton" link="components/other/skeleton/skeleton" />
                <MenuLink title="EntityLog" link="components/other/entitylog" />
                <MenuLink title="AlertBox" link="components/other/alertbox" />
                <MenuLink title="InfoBlock" link="components/other/infoblock" />
                <MenuLink title="Tabs" link="components/other/tabs" />
            </div>
        </div>
        <div class="mt-4">
            <div class="font-bold">GridStack</div>
            <div class="pl-4 mt-2">
                <MenuLink title="GridStack" link="components/other/gridstack/gridstack" />
            </div>
        </div>
        <div class="mt-4">
            <div class="font-bold">Loading</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Loader" link="components/other/loading/loader" />
                <MenuLink title="LoadingLine" link="components/other/loading/loadingline" />
            </div>
        </div>
        <div class="mt-4">
            <div class="font-bold">Popover</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Popover" link="components/popover/popover" />
            </div>
        </div>
        <div class="mt-4">
            <div class="font-bold">Table</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Table" link="components/table/table" />
                <MenuLink title="Tbody" link="components/table/tbody" />
            </div>
        </div>

        <div class="mt-4">
            <div class="font-bold">Gallery</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Gallery" link="components/gallery/gallery" />
                <MenuLink title="GalleryItem" link="components/gallery/galleryitem" />
            </div>
        </div>

        <div class="mt-4">
            <div class="font-bold">Importer</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Importer" link="components/importer/importer" />
            </div>
        </div>

        <div class="mt-4">
            <div class="font-bold">Ikony</div>
            <div class="pl-4 mt-2">
                <MenuLink title="Seznam ikon" link="components/icons/icons" />
            </div>
        </div>
    </div>
</template>
