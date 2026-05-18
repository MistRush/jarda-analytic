import BasePart from "../../Components/OldForm/js/Controls/Parts/BasePart";
import {reactive} from "vue";

export default class Action {
    grid;
    headerButton;
    contextButton;
    rowButton;
    visibility;
    subactions = [];
    help_text;
    id;
    label;
    onclick;

    constructor(grid, id, label, onclick = null, visibility = [true, true, true]) {
        this.grid = grid;
        this.id = id;
        this.label = label;
        this.onclick = onclick;

        if(Array.isArray(visibility)) {
            this.visibility = {
                header: visibility[0],
                context: visibility[1],
                row: visibility[2]
            };
        }else if(typeof visibility === 'object') {
            this.visibility = visibility;
        }


        this.headerButton = reactive(new BasePart('button', {
            class: 'btn btn-dark',
            id: `${id}_header`,
            type: 'button',
            'data-toggle': 'bstooltip',
        }));
        if(typeof onclick === 'string'){
            this.headerButton.attributes.onclick = onclick;
        }

        this.headerButton.setText(label);

        this.contextButton = reactive(new BasePart('li', {
            id: `${id}_context`,
        }));
        if(typeof onclick === 'string'){
            this.contextButton.attributes.onclick = onclick;
        }
        this.contextButton.setText(label);


        this.rowButton = reactive(new BasePart('button', {
            class: 'btn btn-icon',
            id: `${id}_row`,
            title: label,
            type: 'button'
        }));

        if(typeof onclick === 'string'){
            const fn = onclick?.split('(')[0];
            const args = onclick?.match(/\((.*?)\)/)?.[1] || '';
            this.rowButton.attributes.onclick = `${grid.class}.callRow(this, ${fn}, [${args}])`;
        }else if (typeof onclick === 'function'){

        }



        this.rowButton.setHtml("<i class='ci ci-cog'></i>");
    }

    addSubAction(id, label, onclick) {
        this.subactions.push(reactive({ id: id, label: label, onclick: onclick }));
        return this;
    }

    setIcon(icon) {
        this.rowButton.setHtml(`<i class='ci ci-${icon}'></i>`);
        this.headerButton.setHtml(`<i class='ci ci-${icon} btn-ci'></i>` + this.headerButton.getText());
        return this;
    }

    getHeaderButton() {
        return this.headerButton;
    }

    getContextButton() {
        return this.contextButton;
    }

    getRowButton() {
        return this.rowButton;
    }

    getVisibility() {
        return this.visibility;
    }

    getHelp() {
        return this.help_text;
    }

    setHelp(help_text) {
        this.help_text = help_text;
        return this;
    }

    getId() {
        return this.id;
    }

    getLabel() {
        return this.label;
    }

    getOnclick() {
        return this.onclick;
    }


    getContextMenuItemSetting() {
        const data = {};

        if (this.visibility.context) {
            if (this.subactions.length === 0) {
                data.id = `${this.id}_context`;
                data.label = this.label;
                data.onClick = this.onclick;
            } else {
                data.id = `${this.id}_context`;
                data.label = this.label;
                data.onClick = this.onclick;
                data.subItems = this.subactions.map(subaction => ({
                    id: subaction.id,
                    label: subaction.label,
                    onClick: subaction.onclick
                }));
            }
        } else {
            return null;
        }

        return data;
    }

    renderRow(){
        if(!this.visibility.row || this.subactions.length){
            return '';
        }

        const attributes = Object.entries(this.rowButton.attributes)
            .filter(([_, value]) => value !== null && value !== undefined) // vynechá hodnoty null a undefined
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        const result = `<button ${attributes} onclick="${this.onclick}">${this.rowButton.getHtml()}</button>`;

        const doc = document.createElement('button');
        Object.entries(this.rowButton.attributes).forEach(([key, value]) => {
            doc.setAttribute(key, value);
        });
        doc.onclick = this.onclick;
        doc.innerHTML = this.rowButton.getHtml();

        return doc;
    }

}
