import {mapCommonProperties, mapParts, REQUIRED_PROPS} from './CommonMapper';
import DateBox from "./../DateBox";
import Mapper from "../../../../js/Mapper";

export default class RadioButtonMapper {
    static REQUIRED_PROPS = [
        ...REQUIRED_PROPS,
        'dateType',
    ];

    static map(jsonData, mappedControl) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Validace povinných vlastností
        Mapper.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance TextInput
        const dateBox = new DateBox(
            jsonData.super,  // Rodičovská instance
            jsonData.name,
            jsonData.label,
            jsonData.required,
            jsonData.dateType,
        );

        // Mapování společných vlastností pomocí mapCommonProperties
        mapCommonProperties(dateBox, jsonData);

        mapParts(dateBox, mappedControl);

        return dateBox;
    }
}
