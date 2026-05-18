import { mapCommonProperties, REQUIRED_PROPS } from './CommonMapper';
import TextInputMapper from "./TextInputMapper";
import TextAreaMapper from "./TextAreaMapper";
import RadioButtonMapper from "./RadioButtonMapper";
import ComboBoxMapper from "./ComboBoxMapper";
import FileBoxMapper from "./FileBoxMapper";
import DateBoxMapper from "./DateBoxMapper";
import CheckboxMapper from "./CheckboxMapper";
import Mapper from "../../../../js/Mapper";
// Můžeš přidat další mappers zde

export default class FormControlMapper {
    static REQUIRED_PROPS = REQUIRED_PROPS;

    static map(jsonData) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Validace požadovaných vlastností
        Mapper.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Mapování běžných vlastností (labelPart a controlPart)
        const mappedControl = this.mapControlPart(jsonData);


        // Rozpoznání typu komponenty a použití správného mapperu
        switch (jsonData.componentType) {
            case 'TextInput':
                return TextInputMapper.map(jsonData, mappedControl);
            case 'TextArea':
                return TextAreaMapper.map(jsonData, mappedControl);
            case 'RadioButton':
                return RadioButtonMapper.map(jsonData, mappedControl);
            case 'ComboBox':
                return ComboBoxMapper.map(jsonData, mappedControl);
            case 'FileBox':
                return FileBoxMapper.map(jsonData, mappedControl);
            case 'DateBox':
                return DateBoxMapper.map(jsonData, mappedControl);
            case 'Checkbox':
                return CheckboxMapper.map(jsonData, mappedControl);

            //TODO BlockEditor

            default:
                throw new Error(`Unknown form control type: ${jsonData.componentType}`);
        }
    }

    static mapControlPart(jsonData) {
        const { labelPart, controlPart, element } = jsonData;

        return {
            labelPart: {
                tag: labelPart.tag,
                attributes: labelPart.attributes, // Přenášíme atributy labelu (např. for, class)
                text: labelPart.text,             // Přenášíme text labelu
                // html: label.html              // Přenášíme celý HTML obsah labelu (pokud je třeba)
            },
            controlPart: {
                tag: controlPart.tag,
                attributes: controlPart.attributes, // Přenášíme atributy controlu (např. type, class)
                text: controlPart.text,
                // html: control.html              // Přenášíme HTML obsah controlu (pokud je třeba)
            },
            elementPart: {
                tag: element.tag,
                attributes: element.attributes, // Přenášíme atributy controlu (např. type, class)
                text: element.text,
                // html: control.html              // Přenášíme HTML obsah controlu (pokud je třeba)
            }
        };
    }
}
