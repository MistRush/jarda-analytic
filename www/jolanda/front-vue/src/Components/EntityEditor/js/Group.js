import FormGroup from "@/Components/OldForm/js/Controls/FormGroup";
import RelationSwitcher from "../../OldForm/js/Other/RelationSwitcher";
import SubGridDef from "@/DataGrid/js/SubGridDef";
import {reactive} from "vue";

export default class Group {
    tab = null;
    super = null;
    id = null;
    groupControls = [];
    columnSize = 12;
    title = null;
    attributes = { class: '' };

    constructor(title, parent) {
        this.title = title;
        this.tab = parent;
        this.super = this.tab.editor.getSuper();
    }

    getAttributes() {
        if (this.getId()) {
            this.attributes.id = this.getId();
        }
        return this.attributes;
    }

    getColumnSize() {
        return this.columnSize;
    }

    setColumnSize(size) {
        if (size > 12) {
            this.columnSize = 12;
        } else if (size < 1) {
            this.columnSize = 1;
        } else {
            this.columnSize = size;
        }
        return this;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
        return this;
    }

    setElementAttribute(attribute, value) {
        this.attributes[attribute] = value;
        return this;
    }

    addForm() {
        const formGroup = reactive(new FormGroup(this.tab.editor, this.title));
        this.groupControls.push(formGroup);
        return formGroup;
    }

    addGrid(id, title) {
        const grid = reactive(new SubGridDef(id, title, null));
        grid.setParentEditor(this.tab.editor);
        this.groupControls.push(grid);
        return grid;
    }

    addRelationSwitcher(title, sourceUrl, relationsUrl, parentColumn, childColumn, childNameColumn, params = null, groupByColumn = null, groupByNameColumn = null) {
        const relationSwitcher = reactive(new RelationSwitcher(this.tab.editor, title, sourceUrl, relationsUrl, parentColumn, childColumn, childNameColumn, params, groupByColumn, groupByNameColumn));
        this.groupControls.push(relationSwitcher);
        return relationSwitcher;
    }

    addCategoryTree(id, label, store, storeField, relationUrl, childColumn, parentColumn, selfReferencingColumn = 'Parent_ID') {
        const categoryTree = reactive(new CategoryTree(this.tab.editor, id, label, store, storeField, relationUrl, childColumn, parentColumn, selfReferencingColumn)); //TODO ??
        this.groupControls.push(categoryTree);
        return categoryTree;
    }

    addHtml(html = '') {
        //TODO
        const group = new HtmlElement('div', { class: 'form-group' });
        const content = new HtmlElement('div');
        content.setHtml(html);
        group.insert(null, content);
        this.groupControls.push(group);
        return content;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
        return this;
    }

    getGroupControls() {
        return this.groupControls;
    }

    getSubGrids() {
        return this.groupControls.filter(control => control instanceof SubGridDef);
    }

    getRelationSwitches() {
        return this.groupControls.filter(control => control instanceof RelationSwitcher);
    }

    getCategoryTrees() {
        return []; //TODO
        return this.groupControls.filter(control => control instanceof CategoryTree);
    }
}