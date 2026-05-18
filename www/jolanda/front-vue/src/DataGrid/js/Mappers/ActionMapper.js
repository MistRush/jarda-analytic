import Mapper from "../../../Components/js/Mapper";
import Action from "./../Action";

export default class ActionMapper extends Mapper {
    static REQUIRED_PROPS = [
        'headerButton',
        'contextButton',
        'rowButton',
        'visibility',
        'subactions',
        'id',
        'label',
        'onclick',
    ];

    static map(jsonData, parent) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance třídy Form
        const action = new Action(parent, jsonData.id, jsonData.label, jsonData.onclick, jsonData.visibility, jsonData.visible_update, jsonData.onclick);

        action.type = jsonData.type;
        action.subactions = jsonData.subactions;
        action.id = jsonData.id;
        action.label = jsonData.label;
        action.onclick = jsonData.onclick;

        const mappedControl = this.mapControlPart(jsonData);

        if (mappedControl.headerButton) {
            action.headerButton.setAttributes(mappedControl.headerButton.attributes);
            action.headerButton.setText(mappedControl.headerButton.text || '');
            action.headerButton.setHtml(mappedControl.headerButton.html);
            // if (mappedControl.labelPart.html) {
            //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
            // }
        }

        if (mappedControl.contextButton) {
            action.contextButton.setAttributes(mappedControl.contextButton.attributes);
            action.contextButton.setText(mappedControl.contextButton.text || '');
            action.contextButton.setHtml(mappedControl.contextButton.html);
            // if (mappedControl.labelPart.html) {
            //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
            // }
        }

        if (mappedControl.rowButton) {
            action.rowButton.setAttributes(mappedControl.rowButton.attributes);
            action.rowButton.setText(mappedControl.rowButton.text || '');
            action.rowButton.setHtml(mappedControl.rowButton.html);
            // if (mappedControl.labelPart.html) {
            //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
            // }
        }

        return action;
    }

    static mapControlPart(jsonData) {
        const { headerButton, contextButton, rowButton } = jsonData;

        return {
            headerButton: {
                tag: headerButton.tag,
                attributes: headerButton.attributes, // Přenášíme atributy labelu (např. for, class)
                text: headerButton.text,             // Přenášíme text labelu
                html: headerButton.html              // Přenášíme celý HTML obsah labelu (pokud je třeba)
            },
            contextButton: {
                tag: contextButton.tag,
                attributes: contextButton.attributes, // Přenášíme atributy labelu (např. for, class)
                text: contextButton.text,             // Přenášíme text labelu
                html: contextButton.html              // Přenášíme celý HTML obsah labelu (pokud je třeba)
            },
            rowButton: {
                tag: rowButton.tag,
                attributes: rowButton.attributes, // Přenášíme atributy labelu (např. for, class)
                text: rowButton.text,             // Přenášíme text labelu
                html: rowButton.html              // Přenášíme celý HTML obsah labelu (pokud je třeba)
            },
        };
    }

}
