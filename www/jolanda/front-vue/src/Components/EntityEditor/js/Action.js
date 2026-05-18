import EntityEditorDef from "./EntityEditorDef";
import BasePart from "../../OldForm/js/Controls/Parts/BasePart";
import {reactive} from "vue";

export default class Action {
    parent;
    button;
    subactions = [];
    help_text;
    id;
    label;
    icon;
    visible_create;
    visible_update;
    onclick;
    type;

    constructor(parent, id, label, icon = null, visible_create = true, visible_update = true, onclick = null) {
        this.parent = parent;
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.visible_create = visible_create;
        this.visible_update = visible_update;
        this.onclick = onclick;

        const type = (this.parent instanceof EntityEditorDef) ? 'button' : 'div';
        this.type = type;

        this.button = reactive(new BasePart(type));
        this.button.content = this.label;
        this.button.setAttribute('id', this.id);
        this.button.setClass(type === 'button' ? ['btn', 'btn-dark'] : 'dropdown-item');
        this.button.setAttribute('data-create', visible_create ? 'true' : 'false');
        this.button.setAttribute('data-update', visible_update ? 'true' : 'false');
        this.button.setAttribute('onclick', onclick);
    }

    getButton(){
        return this.button;
    }

    addAction(id, label, icon = null, visible_create = true, visible_update = true, onclick = null){
        const subaction = reactive(new Action(this, id, label, icon, visible_create, visible_update, onclick));
        this.subactions.push(subaction);

        return subaction;
    }
}