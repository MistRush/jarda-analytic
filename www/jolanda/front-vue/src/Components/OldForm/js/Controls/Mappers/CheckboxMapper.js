import {mapCommonProperties, mapParts, REQUIRED_PROPS} from './CommonMapper';
import Checkbox from "./../Checkbox";
import Mapper from "../../../../js/Mapper";

export default class RadioButtonMapper {
    static REQUIRED_PROPS = [
        ...REQUIRED_PROPS,
    ];

    static map(jsonData, mappedControl) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Validace povinných vlastností
        Mapper.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance TextInput
        const checkbox = new Checkbox(
            jsonData.super,  // Rodičovská instance
            jsonData.name,
            jsonData.label,
            jsonData.required,
        );

        // Mapování společných vlastností pomocí mapCommonProperties
        mapCommonProperties(checkbox, jsonData);

        mapParts(checkbox, mappedControl);

        return checkbox;
    }
}
