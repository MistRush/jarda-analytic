import GridMapper from "./GridMapper";

export default class SubGridMapper extends GridMapper {
    //TODO přenáše staticke nastavení
    static REQUIRED_PROPS = [
        ...GridMapper.REQUIRED_PROPS,
        'quick_editor',
        'parent_entity',
        'parent_editor',

    ];

    static map(jsonData, parent = null) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        const grid = GridMapper.map(jsonData, parent);

        grid.quick_editor = jsonData.quick_editor;
        grid.parent_entity = jsonData.parent_entity;
        grid.parent_editor = jsonData.parent_editor;

        return grid;
    }
}
