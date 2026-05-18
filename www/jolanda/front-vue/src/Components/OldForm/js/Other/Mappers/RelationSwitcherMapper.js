import RelationSwitcher from "./../RelationSwitcher";
import Mapper from "../../../../js/Mapper";

export default class RelationSwitcherMapper {
    static REQUIRED_PROPS = [
        'componentType',
        'id',
        'settings'
    ];

    static map(jsonData, editor) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Validace povinných vlastností
        Mapper.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        const title = jsonData.settings.title;
        const source_url = jsonData.settings.source_url;
        const relations_url = jsonData.settings.relations_url;
        const parent_column = jsonData.settings.parent_column;
        const child_column = jsonData.settings.child_column;
        const child_name_column = jsonData.settings.child_name_column;
        const params = jsonData.settings.params ?? null;
        const group_by_column = jsonData.settings.group_by_column ?? null;
        const group_by_name_column = jsonData.settings.group_by_name_column ?? null;

        // Vytvoření instance TextInput
        const relationSwitcher = new RelationSwitcher(
            editor,
            title,
            source_url,
            relations_url,
            parent_column,
            child_column,
            child_name_column,
            params,
            group_by_column,
            group_by_name_column
        );

        relationSwitcher.settings = jsonData.settings;
        relationSwitcher.id = jsonData.id;

        return relationSwitcher;
    }
}
