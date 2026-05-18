import Mapper from "../../../js/Mapper";
import FormGroupMapper from "@/Components/OldForm/js/Controls/Mappers/FormGroupMapper";
import RelationSwitcherMapper from "../../../OldForm/js/Other/Mappers/RelationSwitcherMapper";
import SubGridMapper from "../../../../DataGrid/js/Mappers/SubGridMapper";
import BasePart from "../../../OldForm/js/Controls/Parts/BasePart";

export default class GroupMapper extends Mapper {
    static REQUIRED_PROPS = [
        'componentType',
    ];

    static map(jsonData, editor) {
        if (typeof jsonData === 'string') {
            jsonData = JSON.parse(jsonData);
        }

        // Kontrola, zda máme všechny povinné vlastnosti
        this.validateRequiredProperties(jsonData, this.REQUIRED_PROPS);

        let groupControl = null;

        switch(jsonData.componentType) {
            case 'FormGroup':
                return FormGroupMapper.map(jsonData, editor);
            case 'RelationSwitcher':
                return RelationSwitcherMapper.map(jsonData, editor);
            case 'SubGrid':
                return SubGridMapper.map(jsonData, editor);
            case 'html':
                const basePart = new BasePart(jsonData.type, jsonData.attributes);
                basePart.setText(jsonData.text);
                basePart.setHtml(jsonData.html);
                return basePart;



            //TODO subgrid...
            default:
                throw new Error(`Unknown group control type: ${jsonData.componentType}`);
        }
    }

}
