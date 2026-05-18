import Mapper from "../../../js/Mapper";
import FormMapper from "../../../OldForm/js/FormMapper";
import EntityEditorDef from "../EntityEditorDef";
import FormGroupMapper from "@/Components/OldForm/js/Controls/Mappers/FormGroupMapper";
import TabMapper from "@/Components/EntityEditor/js/Mappers/TabMapper";
import ActionMapper from "./ActionMapper";

export default class EntityEditorMapper extends Mapper {
    static REQUIRED_PROPS = [
        ...FormMapper.REQUIRED_PROPS,
        'tabs',
        'data_url',
        'entity_id',
        'back_url',
        'name',
        'entity_name_column',
        'parent_entities',
        'ajax',
        'enable_standalone',
        'actions',
        'readonly',
        'url_parameters',
        'sendOnEnterEnabled',
        'isShowedSaveButtons',
        'footerTab',
        'headerTab',
        'isEnabledNextPrevButtons',
        'isEnabledNextPrevCounter',
        'dataListAction',
        'dataUpdateAction',
        'dataCreateAction',
        '_bu',
        'customData',
        'dataSaveType',
        'local_tmp_id',
    ];

    static map(jsonData) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance třídy Form
        const entityEditor = new EntityEditorDef(jsonData.id, jsonData.name, jsonData.data_url, null);

        // Nastavení ID formuláře
        entityEditor.setId(jsonData.id);

        entityEditor.setAjax(jsonData.ajax);
        entityEditor.data_url = jsonData.data_url;
        entityEditor.entity_id = jsonData.entity_id;
        entityEditor.back_url = jsonData.back_url;
        entityEditor.entity_name_column = jsonData.entity_name_column;
        entityEditor.parent_entities = jsonData.parent_entities;
        entityEditor.enable_standalone = jsonData.enable_standalone;
        entityEditor.readonly = jsonData.readonly;
        entityEditor.url_parameters = jsonData.url_parameters;
        entityEditor.sendOnEnterEnabled = jsonData.sendOnEnterEnabled;
        entityEditor.isShowedSaveButtons = jsonData.isShowedSaveButtons;
        entityEditor.footerTab = jsonData.footerTab;
        entityEditor.headerTab = jsonData.headerTab;
        entityEditor.isEnabledNextPrevButtons = jsonData.isEnabledNextPrevButtons;
        entityEditor.isEnabledNextPrevCounter = jsonData.isEnabledNextPrevCounter;
        entityEditor.dataListAction = jsonData.dataListAction;
        entityEditor.dataUpdateAction = jsonData.dataUpdateAction;
        entityEditor.dataCreateAction = jsonData.dataCreateAction;
        entityEditor._bu = jsonData._bu;
        entityEditor.customData = jsonData.customData;
        entityEditor.dataSaveType = jsonData.dataSaveType;
        entityEditor.local_tmp_id = jsonData.local_tmp_id;

        // Přidání formulářových skupin pomocí FormGroupMapper
        jsonData.formGroups.forEach(groupData => {
            const group = FormGroupMapper.map(groupData, entityEditor);
            entityEditor.formGroups.push(group); // Přidání namapované FormGroup
        });

        jsonData.tabs.forEach(tabData => {
            const tab = TabMapper.map(tabData, entityEditor);
            entityEditor.tabs.push(tab); // Přidání namapované FormGroup
        });

        // Přidání tlačítek do formuláře
        jsonData.buttons.forEach(buttonData => {
            entityEditor.addButton(buttonData.label, buttonData.type, buttonData.classes);
        });

        // Actions
        jsonData.actions.forEach(actionData => {
           entityEditor.actions.push(ActionMapper.map(actionData, entityEditor));
        });

        const mappedControl = this.mapControlPart(jsonData);
        if (mappedControl.element) {
            entityEditor.getElement().setAttributes(mappedControl.element.attributes);
            entityEditor.getElement().setText(mappedControl.element.text || '');
            // if (mappedControl.labelPart.html) {
            //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
            // }
        }

        return entityEditor;
    }

    static mapControlPart(jsonData) {
        const { element } = jsonData;

        if(!element) {
            return {};
        }

        return {
            elementPart: {
                tag: element.tag,
                attributes: element.attributes, // Přenášíme atributy controlu (např. type, class)
                // html: control.html              // Přenášíme HTML obsah controlu (pokud je třeba)
            },
        };
    }
}
