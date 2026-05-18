import Mapper from "../../../js/Mapper";
import Action from "./../Action";

export default class ActionMapper extends Mapper {
    static REQUIRED_PROPS = [
        'button',
        'subactions',
        'help_text',
        'id',
        'label',
        'icon',
        'visible_create',
        'visible_update',
        'onclick',
        'type',
    ];

    static map(jsonData, parent) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance třídy Form
        const action = new Action(parent, jsonData.id, jsonData.label, jsonData.icon, jsonData.visible_create, jsonData.visible_update, jsonData.onclick);

        action.type = jsonData.type;
        action.help_text = jsonData.help_text;
        action.id = jsonData.id;
        action.label = jsonData.label;
        action.icon = jsonData.icon;
        action.visible_create = jsonData.visible_create;
        action.visible_update = jsonData.visible_update;
        action.onclick = jsonData.onclick;
        action.type = jsonData.type;


        const mappedControl = this.mapControlPart(jsonData);

        if (mappedControl.button) {
            action.button.setAttributes(mappedControl.button.attributes);
            action.button.setText(mappedControl.button.text || '');
            // if (mappedControl.labelPart.html) {
            //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
            // }
        }

        jsonData.subactions.forEach(subactionData => {
           action.subactions.push(this.map(subactionData, action));
        });

        return action;
    }

    static mapControlPart(jsonData) {
        const { button } = jsonData;

        return {
            button: {
                tag: button.tag,
                attributes: button.attributes, // Přenášíme atributy labelu (např. for, class)
                text: button.text,             // Přenášíme text labelu
                // html: label.html              // Přenášíme celý HTML obsah labelu (pokud je třeba)
            },
        };
    }

}
