import Mapper from "../../js/Mapper";
import Form from "./Form";
import FormGroupMapper from "./Controls/Mappers/FormGroupMapper";

export default class FormMapper extends Mapper {
    static REQUIRED_PROPS = [
        'id',
        'element',
        'formGroups',
        'buttons',
        'ajax'
    ];

    static map(jsonData) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance třídy Form
        const form = new Form();

        // Nastavení ID formuláře
        form.setId(jsonData.id);

        // Přidání formulářových skupin pomocí FormGroupMapper
        jsonData.formGroups.forEach(groupData => {
            const group = FormGroupMapper.map(groupData, form);
            form.formGroups.push(group); // Přidání namapované FormGroup
        });

        // Přidání tlačítek do formuláře
        jsonData.buttons.forEach(buttonData => {
            form.addButton(buttonData.label, buttonData.type, buttonData.classes);
        });

        // Nastavení AJAXu
        form.setAjax(jsonData.ajax);

        const mappedControl = this.mapControlPart(jsonData);
        if (mappedControl.element) {
            form.getElement().setAttributes(mappedControl.element.attributes);
            form.getElement().setText(mappedControl.element.text || '');
            // if (mappedControl.labelPart.html) {
            //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
            // }
        }

        return form;
    }

    static mapControlPart(jsonData) {
        const { element } = jsonData;

        return {
            elementPart: {
                tag: element.tag,
                attributes: element.attributes, // Přenášíme atributy controlu (např. type, class)
                // html: control.html              // Přenášíme HTML obsah controlu (pokud je třeba)
            },
        };
    }
}
