export function mapCommonProperties(control, jsonData) {
    control.setPlaceholder(jsonData.placeholder)
        .setDisabled(jsonData.disabled)
        .setReadOnly(jsonData.readOnly)
        .setColumnSize(jsonData.columnSize)
        .setRenderLabel(jsonData.renderLabel)
        .setHelp(jsonData.helpHtml);

    // Přidání validátorů
    jsonData.validators.forEach(validator => {
        control.addRule(validator.v, validator.m, validator.p);
    });

    // Nastavení hodnoty (pokud existuje)
    if (jsonData.value !== undefined) {
        control.setValue(jsonData.value);
    }
}

export function mapParts(controlInstance, mappedControl) {
    // Nastavení labelPart
    if (mappedControl.labelPart) {
        controlInstance.getLabelPart().setAttributes(mappedControl.labelPart.attributes);
        controlInstance.getLabelPart().setText(mappedControl.labelPart.text || '');
        // if (mappedControl.labelPart.html) {
        //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
        // }
    }

    // Nastavení controlPart
    if (mappedControl.controlPart) {
        controlInstance.getControlPart().setTag(mappedControl.controlPart.tag);
        controlInstance.getControlPart().setAttributes(mappedControl.controlPart.attributes);
        // if (mappedControl.controlPart.html) {
        //     controlInstance.getControlPart().setHtml(mappedControl.controlPart.html);
        // }
    }

    if (mappedControl.elementPart) {
        controlInstance.getElement().setAttributes(mappedControl.elementPart.attributes);
        controlInstance.getElement().setText(mappedControl.elementPart.text || '');
        // if (mappedControl.labelPart.html) {
        //     controlInstance.getLabelPart().setHtml(mappedControl.labelPart.html);
        // }
    }
}

export const REQUIRED_PROPS = [
    'name',
    'label',
    'labelPart',
    'controlPart',
    'element',
    'placeholder',
    'required',
    'disabled',
    'readOnly',
    'columnSize',
    'validators',
    'helpHtml',
    'renderLabel',
    'componentType', // Používáme componentType pro rozhodování, jaký mapper použít
];
