export default class RelationSwitcher{
    settings = {};
    id;
    editor;

    constructor(editor, title, source_url, relations_url, parent_column, child_column, child_name_column, params = null, group_by_column = null, group_by_name_column = null) {
        this.id = 'rs_' + Math.random().toString(36).substring(2, 9);
        this.editor = editor;

        this.settings['relations_url'] = this.editor._bu + '/' + relations_url + '/data-list';
        this.settings['source_url'] = this.editor._bu + '/' + source_url + '/data-list';
        if(params !== null){
            const urlParams = [];
            for (const [k, v] of Object.entries(params)) {
                urlParams.push(`${k}=${v}`);
            }

            this.settings['source_url'] += '?' + urlParams.join('&');
        }
        this.settings['delete_url'] = this.editor._bu + '/' + relations_url + '/data-delete';
        this.settings['create_url'] = this.editor._bu + '/' + relations_url + '/data-create';
        this.settings['child_name_column'] = child_name_column;
        this.settings['parent_column'] = parent_column;
        this.settings['child_column'] = child_column;
        this.settings['title'] = title;
        if(group_by_column !== null){
            this.settings['group_by_column'] = group_by_column;
        }
        if(group_by_name_column !== null){
            this.settings['group_by_name_column'] = group_by_name_column;
        }
    }

    getSettings(){
        return JSON.stringify(this.settings);
    }

    getEditor(){
        return this.editor;
    }

    getId(){
        return this.id;
    }
}