import Mapper from "../../../js/Mapper";
import Group from "./../Group";
import GroupControlMapper from "./GroupControlMapper";

export default class GroupMapper extends Mapper {
    static REQUIRED_PROPS = [
        'id',
        'groupControls',
        'columnSize',
        'title',
        'attributes',
    ];

    static map(jsonData, tab) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance třídy Form
        const group = new Group(jsonData.title, tab);

        // Nastavení ID formuláře
        group.id = jsonData.id;
        group.columnSize = jsonData.columnSize;
        group.title = jsonData.title;
        group.attributes = jsonData.attributes;

        jsonData.groupControls.forEach(groupControlData => {
            const groupControl = GroupControlMapper.map(groupControlData, group.tab.editor);
            group.groupControls.push(groupControl);
        });

        return group;
    }

}
