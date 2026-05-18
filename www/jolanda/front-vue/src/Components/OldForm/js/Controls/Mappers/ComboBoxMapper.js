import {mapCommonProperties, mapParts, REQUIRED_PROPS} from './CommonMapper';
import ComboBox from "./../ComboBox";
import Mapper from "../../../../js/Mapper";

export default class ComboBoxMapper {
    static REQUIRED_PROPS = [
        ...REQUIRED_PROPS,
        'enumValues',
        'multi',
        'dynamicAddingOptions',
        'quickEditorUrl',
        'editable',
        'storeField',
        'ajax',
    ];

    static map(jsonData, mappedControl) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Validace povinných vlastností
        Mapper.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        //TODO tmp fix
        if(!jsonData.ajax && jsonData.ajax !== null){
            if(!(jsonData.storeField == null || (Array.isArray(jsonData.storeField) && jsonData.storeField.length === 0))){
                jsonData.storeField = null;
            }
        }

        // Vytvoření instance TextInput
        const comboBox = new ComboBox(
            jsonData.super,  // Rodičovská instance
            jsonData.name,
            jsonData.label,
            jsonData.required,
            jsonData.enumValues,
            jsonData.storeField,
            jsonData.multi,
            jsonData.ajax,
        );

        comboBox.dynamicAddingOptions = jsonData.dynamicAddingOptions;
        comboBox.quickEditorUrl = jsonData.quickEditorUrl;
        comboBox.editable = jsonData.editable;

        // Mapování společných vlastností pomocí mapCommonProperties
        mapCommonProperties(comboBox, jsonData);

        mapParts(comboBox, mappedControl);

        return comboBox;
    }
}
