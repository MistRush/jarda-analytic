import {mapCommonProperties, mapParts, REQUIRED_PROPS} from './CommonMapper';
import TextInput from "./../TextInput";
import Mapper from "../../../../js/Mapper";

export default class TextInputMapper {
    static REQUIRED_PROPS = [
        ...REQUIRED_PROPS,
        'type'
    ];

    static map(jsonData, mappedControl) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Validace povinných vlastností
        Mapper.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance TextInput
        const textInput = new TextInput(
            jsonData.super,  // Rodičovská instance
            jsonData.name,
            jsonData.label,
            jsonData.required,
            jsonData.type    // Použití typu (např. 'text', 'email', 'number') pro input
        );

        // Mapování společných vlastností pomocí mapCommonProperties
        mapCommonProperties(textInput, jsonData);

        mapParts(textInput, mappedControl);

        return textInput;
    }
}
