<script setup>
import Menu from "./Menu.vue";
//APP
import AppDoc from "./App/AppDoc.vue";
import PageDoc from "./App/PageDoc.vue";
import TabDoc from "./App/TabDoc.vue";
import LayoutDoc from "./App/LayoutDoc.vue";
import TranslationsDoc from "./App/TranslationsDoc.vue";
import AjaxDoc from "./App/AjaxDoc.vue";
import AlertsDoc from "./App/AlertsDoc.vue";
import ManagerDoc from "./App/ManagerDoc.vue";
import StylingDoc from "./App/StylingDoc.vue";
import InstallDoc from "./App/InstallDoc.vue";
import DocsDoc from "./App/DocsDoc.vue";
import AppRouterLink from "./App/AppRouterLink.vue";
import HelpbarDoc from "@/Docs/App/HelpbarDoc.vue";

//FORM
import FormDoc from "./Components/Form/FormDoc.vue";
//INPUTS
import ButtonDoc from "./Components/Inputs/ButtonDoc.vue";
import CheckboxDoc from "./Components/Inputs/CheckboxDoc.vue";
import DatePickerDoc from "./Components/Inputs/DatePickerDoc.vue";
import EditorFileInputDoc from "./Components/Inputs/EditorFileInputDoc.vue";
import InputFieldDoc from "./Components/Inputs/InputFieldDoc.vue";
import RadioDoc from "./Components/Inputs/RadioDoc.vue";
import RadioBoolDoc from "./Components/Inputs/RadioBoolDoc.vue";
import RadioGroupDoc from "./Components/Inputs/RadioGroupDoc.vue";
import SelectDoc from "./Components/Inputs/SelectDoc.vue";
import SliderDoc from "./Components/Inputs/SliderDoc.vue";
import SwitchDoc from "./Components/Inputs/SwitchDoc.vue";
import TextAreaDoc from "./Components/Inputs/TextAreaDoc.vue";
import TinyMCEDoc from "./Components/Inputs/TinyMCEDoc.vue";
import RelationSwitcherDoc from "./Components/Inputs/RelationSwitcherDoc.vue";
import BlockEditorDoc from "./Components/Inputs/BlockEditorDoc.vue";
import DragAndDropFileUploaderDoc from "@/Docs/Components/Inputs/DragAndDropFileUploaderDoc.vue";
//MODAL
import ModalDoc from "./Components/Modal/ModalDoc.vue";
//OTHER
import TagDoc from "./Components/Other/Tag/TagDoc.vue";
import HightlightTextDoc from "./Components/Other/HighlightTextDoc.vue";
import AccordionDoc from "./Components/Other/AccordionDoc.vue";
import TooltipDoc from "./Components/Other/TooltipDoc.vue";
import PaginationDoc from "./Components/Other/PaginationDoc.vue";
import CopyDoc from "./Components/Other/CopyDoc.vue";
import TreeViewDoc from "./Components/Other/TreeView/TreeViewDoc.vue";
import SkeletonDoc from "./Components/Other/Skeleton/SkeletonDoc.vue";
import AlertBoxDoc from "./Components/Other/AlertBoxDoc.vue";
import InfoBlockDoc from "./Components/Other/InfoBlockDoc.vue";
import TabsDoc from "./Components/Other/TabsDoc.vue";
//GRIDSTACK
import GridStackDoc from "./Components/Other/GridStack/GridStackDoc.vue";
//LOADING
import LoaderDoc from "./Components/Other/Loading/LoaderDoc.vue";
import LoadingLineDoc from "./Components/Other/Loading/LoadingLineDoc.vue";
//POPOVER
import PopoverDoc from "./Components/Popover/PopoverDoc.vue";
//TABLE
import TableDoc from "./Components/Table/TableDoc.vue";
import TbodyDoc from "./Components/Table/TbodyDoc.vue";
//GALLERY
import GalleryDoc from "./Components/Gallery/GalleryDoc.vue";
import GalleryItemDoc from "./Components/Gallery/GalleryItemDoc.vue";
//ICONS
import IconsDoc from "./Components/Icons/IconsDoc.vue";
//DATAGRID
import DataGridDoc from "./DataGrid/DataGridDoc.vue";
import ColumnDoc from "./DataGrid/ColumnDoc.vue";
//EDITOR
import EditorDoc from "./Editor/EditorDoc.vue";
import EditorTabDoc from "./Editor/EditorTabDoc.vue";
import EditorGroupDoc from "./Editor/EditorGroupDoc.vue";
import { usePage } from "@/App/composables/usePage.js";
import { useApp } from "@/App/composables/useApp.js";
//IMPORTER
import ImporterDoc from "@/Docs/Components/Importer/ImporterDoc.vue";

const { query } = usePage();
const { layout } = useApp();
import { ref, provide, watch } from "vue";
import DocSearch from "@/Docs/DocSearch.vue";
import EntityLogDoc from "@/Docs/Components/Other/EntityLogDoc.vue";
import ErrorHandlerDoc from "@/Docs/App/ErrorHandlerDoc.vue";
import Importer from "@/Components/Importer/Importer.vue";

const active = ref(null);

provide("active", active);

if (layout && query?.value?.hasOwnProperty("_nolayout")) {
    layout.state.hideLayout = true;
}

watch(active, () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>

<template>
    <div class="flex">
        <div class="w-[20%] p-4">
            <Menu v-model:active="active" />
        </div>
        <div class="w-[80%] min-w-0">
            <DocSearch @go-to="(path) => (active = path)" />

            <AppDoc v-if="active === 'app/app'" />
            <InstallDoc v-if="active === 'app/install'" />
            <DocsDoc v-if="active === 'app/docs'" />
            <PageDoc v-if="active === 'app/page'" />
            <TabDoc v-if="active === 'app/tab'" />
            <LayoutDoc v-if="active === 'app/layout'" />
            <TranslationsDoc v-if="active === 'app/translations'" />
            <AjaxDoc v-if="active === 'app/ajax'" />
            <AlertsDoc v-if="active === 'app/alerts'" />
            <ManagerDoc v-if="active === 'app/manager'" />
            <StylingDoc v-if="active === 'app/styling'" />
            <AppRouterLink v-if="active === 'app/approuterlink'" />
            <HelpbarDoc v-if="active === 'app/helpbar'"/>
            <ErrorHandlerDoc v-if="active === 'app/errorhandler'" />

            <!--  DATAGRID  -->
            <DataGridDoc v-if="active === 'datagrid/datagrid'" />
            <ColumnDoc v-if="active === 'datagrid/column'" />

            <!--  EDITOR  -->
            <EditorDoc v-if="active === 'editor/editor'" />
            <EditorTabDoc v-if="active === 'editor/editortab'" />
            <EditorGroupDoc v-if="active === 'editor/editorgroup'" />

            <!--  FORM  -->
            <FormDoc v-if="active === 'components/form/form'" />

            <!--  INPUTS  -->
            <ButtonDoc v-if="active === 'components/inputs/button'" />
            <CheckboxDoc v-if="active === 'components/inputs/checkbox'" />
            <DatePickerDoc v-if="active === 'components/inputs/datepicker'" />
            <EditorFileInputDoc v-if="active === 'components/inputs/editorfileinput'" />
            <InputFieldDoc v-if="active === 'components/inputs/inputfield'" />
            <RadioDoc v-if="active === 'components/inputs/radio'" />
            <RadioBoolDoc v-if="active === 'components/inputs/radiobool'" />
            <RadioGroupDoc v-if="active === 'components/inputs/radiogroup'" />
            <SelectDoc v-if="active === 'components/inputs/select'" />
            <SliderDoc v-if="active === 'components/inputs/slider'" />
            <SwitchDoc v-if="active === 'components/inputs/switch'" />
            <TextAreaDoc v-if="active === 'components/inputs/textarea'" />
            <TinyMCEDoc v-if="active === 'components/inputs/tinymce'" />
            <RelationSwitcherDoc v-if="active === 'components/inputs/relationswitcher'" />
            <BlockEditorDoc v-if="active === 'components/inputs/blockeditor'" />
            <DragAndDropFileUploaderDoc v-if="active === 'components/inputs/draganddropfileuploader'" />

            <!--  MODAL  -->
            <ModalDoc v-if="active === 'components/modal/modal'" />

            <!--  OTHER  -->
            <TagDoc v-if="active === 'components/other/tag/tag'" />
            <HightlightTextDoc v-if="active === 'components/other/highlighttext'" />
            <AccordionDoc v-if="active === 'components/other/accordion'" />
            <TooltipDoc v-if="active === 'components/other/tooltip'" />
            <PaginationDoc v-if="active === 'components/other/pagination'" />
            <CopyDoc v-if="active === 'components/other/copy'" />
            <SkeletonDoc v-if="active === 'components/other/skeleton/skeleton'" />
            <TreeViewDoc v-if="active === 'components/other/treeview/treeview'" />
            <EntityLogDoc v-if="active === 'components/other/entitylog'" />
            <AlertBoxDoc v-if="active === 'components/other/alertbox'" />
            <InfoBlockDoc v-if="active === 'components/other/infoblock'" />
            <TabsDoc v-if="active === 'components/other/tabs'" />

            <!--    GRIDSTACK    -->
            <GridStackDoc v-if="active === 'components/other/gridstack/gridstack'" />

            <!--    LOADING    -->
            <LoaderDoc v-if="active === 'components/other/loading/loader'" />
            <LoadingLineDoc v-if="active === 'components/other/loading/loadingline'" />

            <!--    POPOVER    -->
            <PopoverDoc v-if="active === 'components/popover/popover'" />

            <!--    TABLE    -->
            <TableDoc v-if="active === 'components/table/table'" />
            <TbodyDoc v-if="active === 'components/table/tbody'" />

            <!--    GALLERY    -->
            <GalleryDoc v-if="active === 'components/gallery/gallery'" />
            <GalleryItemDoc v-if="active === 'components/gallery/galleryitem'" />

            <!--    IMPORTER    -->
            <ImporterDoc v-if="active === 'components/importer/importer'" />

            <!--  ICONS  -->
            <IconsDoc v-if="active === 'components/icons/icons'" />
        </div>
    </div>
</template>
