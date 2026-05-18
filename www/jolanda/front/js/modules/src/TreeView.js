class TreeView {
    constructor(element_id, data, checkbox = false, customoptions) {
        this.data = data;
        this.onChange = null;
        this.onPositionChange = null;
        this.element = $('#' + element_id);
        if (this.element.data('data') !== undefined)
            this.data = this.element.data('data')

        if (typeof this.data === 'string')
            this.data = JSON.parse(this.data);
        let plugins = ["wholerow", "dnd"];
        if (checkbox)
            plugins.push('checkbox');
        let options = {
            "plugins": plugins,
            'core': {
                'themes': {
                    'icons': false
                },
                "check_callback" : function (op, node, par, pos, more) {
                    if(more && more.dnd) {
                        return more.pos !== "i" && par.id == node.parent;
                    }
                    return true;
                },
                'data': this.data
            },
        };
        this.tree = this.element.jstree(Object.assign(options, customoptions));
        this.bindEvents();
    }

    bindEvents() {
        this.element.on('changed.jstree', (e, action) => {
            if(action.action === 'deselect_all' && action.selected.length === 0 && action.old_selection.length === 0){
                return;
            }
            if (typeof this.onChange === 'function')
                this.onChange();
        }).jstree();

        this.element.on('move_node.jstree', (e, data) => {
            if (typeof this.onPositionChange === 'function')
                this.onPositionChange(e, data);
        }).jstree();
    }

    getSelected() {
        return this.tree.jstree(true).get_selected();
    }
}
