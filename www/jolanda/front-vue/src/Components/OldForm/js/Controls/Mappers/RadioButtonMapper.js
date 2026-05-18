import {mapCommonProperties, mapParts, REQUIRED_PROPS} from './CommonMapper';
import RadioButton from "./../RadioButton";
import Mapper from "../../../../js/Mapper";

export default class RadioButtonMapper {
    static REQUIRED_PROPS = [
        ...REQUIRED_PROPS,
        'items'
    ];

    static map(jsonData, mappedControl) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Validace povinných vlastností
        Mapper.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance TextInput
        const radioButton = new RadioButton(
            jsonData.super,  // Rodičovská instance
            jsonData.name,
            jsonData.label,
            jsonData.required,
        );

        radioButton.items = jsonData.items;

        // Mapování společných vlastností pomocí mapCommonProperties
        mapCommonProperties(radioButton, jsonData);

        mapParts(radioButton, mappedControl);

        return radioButton;
    }
}
