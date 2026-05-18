import Mapper from "../../../../js/Mapper";
import FormGroup from "./../FormGroup";
import FormControlMapper from "./FormControlMapper";

export default class FormGroupMapper extends Mapper {
    static REQUIRED_PROPS = [
        'id',
        'element',
        'label',
        'defaultColumnSize',
        'formControls',
        'formGroups',
        'componentType',
    ];

    static map(jsonData, parent = null) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance FormGroup
        const formGroup = new FormGroup(parent, jsonData.label, jsonData.id);

        // Nastavení defaultColumnSize
        formGroup.setDefaultColumnSize(jsonData.defaultColumnSize);

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
