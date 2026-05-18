import {mapCommonProperties, mapParts, REQUIRED_PROPS} from './CommonMapper';
import FileBox from "./../FileBox";
import Mapper from "../../../../js/Mapper";

export default class RadioButtonMapper {
    static REQUIRED_PROPS = [
        ...REQUIRED_PROPS,
        'fileUploadUrl',
        'multi',
    ];

    static map(jsonData, mappedControl) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Validace povinných vlastností
        Mapper.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance TextInput
        const fileBox = new FileBox(
            jsonData.super,  // Rodičovská instance
            jsonData.name,
            jsonData.label,
            jsonData.fileUploadUrl,
            jsonData.multi,
        );

        // Mapování společných vlastností pomocí mapCommonProperties
        mapCommonProperties(fileBox, jsonData);

        mapParts(fileBox, mappedControl);

        return fileBox;
    }
}
