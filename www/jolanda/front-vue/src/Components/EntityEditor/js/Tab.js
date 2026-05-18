import Group from "@/Components/EntityEditor/js/Group";
import RelationSwitcher from "../../OldForm/js/Other/RelationSwitcher";
import {reactive} from "vue";

export default class Tab {
    editor = null;
    super = null;
    groups = [];
    title = null;
    defaultColumnSize = 12;
    hiddenOnCreate = false;
    id = null;

    constructor(title, parent = null, id = null) {
        this.title = title;
        this.editor = parent;
        this.id = id || this.generateUniqueId();
        this.super = this.editor ? this.editor.getSuper() : null;
    }

    generateUniqueId() {
        return 'tab_' + Math.random().toString(36).substring(7);
    }

    addGroup(title) {
        const group = reactive(new Group(title, this));
        group.setColumnSize(this.defaultColumnSize);
        this.groups.push(group);
        return reactive(group);
    }

    setColumns(columns) {
        if (columns > 12) {
            this.defaultColumnSize = 1;
        } else if (columns < 1) {
            this.defaultColumnSize = 12;
        } else {
            this.defaultColumnSize = 12 / columns;
        }
        return this;
    }

    getDefaultColumnSize() {
        return this.defaultColumnSize;
    }

    setDefaultColumnSize(defaultColumnSize) {
        if (defaultColumnSize > 12) {
            this.defaultColumnSize = 12;
        } else if (defaultColumnSize < 1) {
            this.defaultColumnSize = 1;
        } else {
            this.defaultColumnSize = defaultColumnSize;
        }
        return this;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
        return this;
    }

    getId() {
        return this.id;
    }

    setHiddenOnCreate(hiddenOnCreate = true) {
        this.hiddenOnCreate = hiddenOnCreate;
        return this;
    }

    isNotSimple() {
        if (this.editor && this.editor.getEntityId() != null) {
            return false;
        } else {
            if (this.hiddenOnCreate) {
                return true;
            }
            for (const group of this.getGroups()) {
                for (const control of group.getGroupControls()) {
                    if (!(control instanceof Grid && control.getDataSaveType() === Grid.SAVE_DATA_SERVERSIDE) &&
                        !(control instanceof RelationSwitcher) &&
                        !(control instanceof CategoryTree)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    getGroups() {
        return this.groups;
    }

    getSubGrids() {
        let subGrids = [];
        for (const group of this.groups) {
            subGrids = subGrids.concat(group.getSubGrids());
        }
        return subGrids;
    }

    getRelationSwitches() {
        let relationSwitches = [];
        for (const group of this.groups) {
            relationSwitches = relationSwitches.concat(group.getRelationSwitches());
        }
        return relationSwitches;
    }

    getCategoryTrees() {
        let categoryTrees = [];
        for (const group of this.groups) {
            categoryTrees = categoryTrees.concat(group.getCategoryTrees());
        }
        return categoryTrees;
    }
}