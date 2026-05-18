import Grid from './Grid';

export default class SubGrid extends Grid{
    constructor(element_id, setting) {
        super(element_id, setting);
    }

    get params() {
        return {
            ...super.params,
            'parentElement': this.gridDef.getParentEntity(),
            'parentEditor': this.gridDef.parent_editor,
        }
    }

    /**
     * Přidání nového záznamu
     */
    add() {
        if(this.editorIsOpen){
            return;
        }

        if (this.params.actions.add && this.quickeditor !== '') {
            let parent_rows = [];
            if (this.hasParentGrid()) {
                let oneIsSelected = false;
                this.relations.forEach((relation) => {
                    if(window[relation.grid].getCurrentItem() != null){
                        oneIsSelected = true;
                        parent_rows.push({
                            column: relation.column,
                            id: window[relation.grid].getCurrentItem()[relation.child],
                        });
                    }
                });
                if(!oneIsSelected){
                    alerts.alert('Select parent', 'notice', 'Please select parent');
                    return;
                }
            }
            if (this.parentElement != null)
                parent_rows = this.parentElement;


            let dialog = new Dialog();

            let data = {
                'parent_column': this.params.parentElement,
                'parent_entity_id': window[this.params.parentEditor].entity_id,
                'dataSaveType': this.params.dataSaveType,
                'grid_id': this.id,
            };

            dialog.onAfterShow = () => {
                this.editorIsOpen = true;
            };

            dialog.showFromUrl(this.quickeditor, {
                'parent_column': this.params.parentElement,
                'parent_entity_id': window[this.params.parentEditor].entity_id,
                'dataSaveType': this.params.dataSaveType,
                'grid_id': this.id,
                'parent_rows': parent_rows,
                'parent_row': parent_rows.length === 1 ? parent_rows[0] : null,
                'create_default_values': JSON.stringify(this.createDefaultValues),
            }, true);

            dialog.onAfterClose = () => {
                this.editorIsOpen = false;
                this.refresh()
            };
        }
    }

    /**
     * Úprava záznamu
     */
    edit = () => {
        if(this.editorIsOpen){
            return;
        }

        if (this.params.actions.edit && this.quickeditor !== '') {
            if (this.getSelectedCount() > 1){
                alerts.alert(translations.SELECT_ONLY_ONE);
                return;
            } else if (this.getSelectedCount() === 0) {
                alerts.alert(translations.SELECT_ROW);
                return;
            }
            let dialog = new Dialog();
            let row = this.getCurrentItem();
            if (row.length) {
                row = row[0];
            }

            let parent_rows = [];
            if (this.hasParentGrid()) {
                let oneIsSelected = false;
                this.relations.forEach((relation) => {
                    if(window[relation.grid].getCurrentItem() != null){
                        oneIsSelected = true;
                        parent_rows.push({
                            column: relation.column,
                            id: window[relation.grid].getCurrentItem()[relation.child],
                        });
                    }
                });
                if(!oneIsSelected){
                    alerts.alert('Select parent', 'notice', 'Please select parent');
                    return;
                }
            }
            if (this.parentElement != null)
                parent_rows = this.parentElement;


            let params = {
                'parent_column': this.params.parentElement,
                'parent_entity_id': window[this.params.parentEditor].entity_id,
                'entity_id': row['ID'],
                'dataSaveType': this.params.dataSaveType,
                'grid_id': this.id,
                'parent_rows': parent_rows,
            };

            if(this.params.dataSaveType === 'local'){
                params['local_tmp_id'] = this.params.select === 'single' ? row['local_tmp_id'] : row[0]['local_tmp_id'];
            }

            dialog.onAfterShow = () => {
                this.editorIsOpen = true;
            };

            dialog.showFromUrl(this.quickeditor, params, true);

            dialog.onAfterClose = () => {
                this.editorIsOpen = false;
                this.refresh()
            };
        }
    }
}