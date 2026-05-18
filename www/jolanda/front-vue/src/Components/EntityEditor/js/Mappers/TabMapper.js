import Mapper from "../../../js/Mapper";
import Tab from "./../Tab";
import GroupMapper from "./GroupMapper";

export default class TabMapper extends Mapper {
    static REQUIRED_PROPS = [
        'groups',
        'title',
        'defaultColumnSize',
        'hiddenOnCreate',
        'id',
    ];

    static map(jsonData, entityEditor) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        // Vytvoření instance třídy Form
        const tab = new Tab(jsonData.title, entityEditor, jsonData.id);

        // Nastavení ID formuláře
        tab.id = jsonData.id;
        tab.title = jsonData.title;
        tab.defaultColumnSize = jsonData.defaultColumnSize;
        tab.hiddenOnCreate = jsonData.hiddenOnCreate;

        jsonData.groups.forEach(groupData => {
            const group = GroupMapper.map(groupData, tab);
            tab.groups.push(group); // Přidání namapované FormGroup
        });

        return tab;
    }
}
