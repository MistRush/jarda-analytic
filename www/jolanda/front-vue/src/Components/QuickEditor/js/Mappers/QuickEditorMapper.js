import FormGroupMapper from "@/Components/OldForm/js/Controls/Mappers/FormGroupMapper";
import FormControlMapper from "@/Components/OldForm/js/Controls/Mappers/FormControlMapper";
import QuickEditorDef from "@/Components/QuickEditor/js/QuickEditorDef";


export default class QuickEditorMapper extends FormGroupMapper {
    static REQUIRED_PROPS = [
        ...FormGroupMapper.REQUIRED_PROPS,
        'id',
        'data_url',
        'entity_id',
        'dialog',
        'custom_code',
        'send_on_enter',
        'dataListUrl',
        'dataUpdateUrl',
        'dataCreateUrl',
        '_bu',
        'customData',
        'dataSaveType',
        'forGrid',
        'local_tmp_id',
        'create_default_values'
    ];

    static map(jsonData, parent = null) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance FormGroup
        const formGroup = new QuickEditorDef(jsonData.label, jsonData.data_url, parent);

        // Nastavení defaultColumnSize
        formGroup.setDefaultColumnSize(jsonData.defaultColumnSize);
        formGroup.data_url = jsonData.data_url;
        formGroup.entity_id = jsonData.entity_id;
        formGroup.dialog = jsonData.dialog;
        formGroup.custom_code = jsonData.custom_code;
        formGroup.send_on_enter = jsonData.send_on_enter;
        formGroup.dataListUrl = jsonData.dataListUrl;
        formGroup.dataUpdateUrl = jsonData.dataUpdateUrl;
        formGroup.dataCreateUrl = jsonData.dataCreateUrl;
        formGroup._bu = jsonData._bu;
        formGroup.customData = jsonData.customData;
        formGroup.dataSaveType = jsonData.dataSaveType;
        formGroup.forGrid = jsonData.forGrid;
        formGroup.local_tmp_id = jsonData.local_tmp_id;
        formGroup.create_default_values = jsonData.create_default_values;

        // Mapování formControls pomocí FormControlMapper
        jsonData.formControls.forEach(controlData => {
            const control = FormControlMapper.map(controlData, parent);
            control.parentForm = formGroup.parent;
            formGroup.formControls.push(control);  // Přidání namapovaného FormControl
        });

        // Mapování vnořených formGroups
        jsonData.formGroups.forEach(groupData => {
            const nestedGroup = FormGroupMapper.map(groupData, formGroup);
            formGroup.formGroups.push(nestedGroup); // Přidání namapované FormGroup
        });

        const mappedControl = this.mapControlPart(jsonData);
        if (mappedControl.element) {
            formGroup.getElement().setAttributes(mappedControl.element.attributes);
            formGroup.getElement().setText(mappedControl.element.text || '');
            // if (mappedControl.labelPart.html) {
            //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
            // }
        }

        return formGroup;
    }

    static mapControlPart(jsonData) {
        const { element } = jsonData;

        return {
            elementPart: {
                tag: element.tag,
                attributes: element.attributes, // Přenášíme atributy controlu (např. type, class)
                // html: control.html              // Přenášíme HTML obsah controlu (pokud je třeba)
            }
        };
    }
}
