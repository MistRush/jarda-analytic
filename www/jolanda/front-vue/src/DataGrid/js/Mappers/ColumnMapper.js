import Mapper from "../../../Components/js/Mapper";
import Column from "./../Column";

export default class ColumnMapper extends Mapper {
    static REQUIRED_PROPS = [
        'format',
        'column',
        'label',
        'min_width',
        'format_function',
        'entity_values',
        'filter',
        'editable',
        'visible',
        'help_text',
        'editType',
        'editParams',
    ];

    static map(jsonData, parent) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance třídy Form
        const column = new Column(jsonData.format, jsonData.column, jsonData.label, jsonData.min_width, parent);

        column.format = jsonData.format;
        column.column = jsonData.column;
        column.label = jsonData.label;
        column.min_width = jsonData.min_width;
        column.format_function = jsonData.format_function;
        column.entity_values = jsonData.entity_values;
        column.filter = jsonData.filter;
        column.editable = jsonData.editable;
        column.visible = jsonData.visible;
        column.help_text = jsonData.help_text;
        column.editType = jsonData.editType;
        column.editParams = jsonData.editParams;

        return column;
    }
}
