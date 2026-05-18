class CategoryTree extends TreeView{
    /**
     *
     * @param element_id ID elementu
     * @param data JSON s daty
     * @param entity_id ID upravované entity
     * @param settings JSON s nastevím
     */
    constructor(element_id, data, entity_id, settings) {
        let customoptions = {
            'checkbox': {
                three_state: false
            }
        }
        super(element_id, data, true, customoptions);
        this.onBeforeChange = null;
        this.onAfterChange = null;
        this.entity_id = entity_id;
        this.settings = JSON.parse(settings);
        this.data = {};
        $(()=>{
            this.element.on('ready.jstree', () => {
                this.loadData();
            });
        })
    }

    /**
     * Načítá data z datové tabulky
     */
    loadData() {
        this.data = {};
        let data = {}
        data[this.settings.child_column] = this.entity_id;
        Helpers.ajax({
            url: this.settings['data_url'],
            data: data,
            success: (data) => {
                data = JSON.parse(data).items;
                this.tree.jstree(true).deselect_all();

                for (let i in data) {
                    this.data[data[i].ID] = data[i][this.settings.parent_column]
                    this.tree.jstree(true).select_node(data[i][this.settings.parent_column], true);
                }
            }
        })
    }

    /**
     * Binduje eventy
     */
    bindEvents() {
        this.element.on('changed.jstree', (event, action) => {
            if (!action.node)
                return;

            if (typeof this.onBeforeChange === 'function')
                this.onBeforeChange();
            let ID = action.node.id;
            let relation_ID = Object.keys(this.data).find(key => this.data[key] === ID);

            if (action.action === 'select_node') {
                let data = {};
                data[this.settings.child_column] = this.entity_id;
                data[this.settings.parent_column] = ID;
                Helpers.ajax({
                    url: this.settings['create_url'],
                    data: {data: JSON.stringify(data)},
                    success: (data) => {
                        data = JSON.parse(data);
                        data = data.items[0];
                        this.data[data.ID] = ID;
                        if (typeof this.onAfterChange === 'function')
                            this.onAfterChange();
                    }
                })
            } else if (action.action === 'deselect_node'){
                let data = {ID: relation_ID};
                Helpers.ajax({
                    url: this.settings['delete_url'],
                    data: {data: JSON.stringify(data)},
                    success: () => {
                        this.data[relation_ID] = undefined;
                        if (typeof this.onAfterChange === 'function')
                            this.onAfterChange();
                    }
                })
            }
        }).jstree();
    }
}