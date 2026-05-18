import {mapCommonProperties, mapParts, REQUIRED_PROPS} from './CommonMapper';
import TextArea from "./../TextArea";
import Mapper from "../../../../js/Mapper";

export default class TextAreaMapper {
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
        const textArea = new TextArea(
            jsonData.super,  // Rodičovská instance
            jsonData.name,
            jsonData.label,
            jsonData.required,
        );

        // Mapování společných vlastností pomocí mapCommonProperties
        mapCommonProperties(textArea, jsonData);

        mapParts(textArea, mappedControl);

        return textArea;
    }
}
