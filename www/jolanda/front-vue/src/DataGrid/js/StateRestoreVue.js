export default class StateRestoreVue {
    constructor(grid) {
        this.initialized = false;
        this.grid = grid;
        this.selector = this.grid.id + '_staterestore';

        this.dialog = {
            element: document.getElementById(this.selector),
            buttonElement: document.getElementById(this.selector + '_button'),
            position: {
                top: 0,
                left: 0,
            },
            dialogShow: false,
        }

        this.renameDialog = {
            dialog: null,
        }

        this.addDialog = {
            dialog: null,
        }

        this.serverSideStates = [];


        this.userID = null;
        if(typeof userID !== 'undefined')
            this.userID = userID;
        else{
            console.warn('userID is not defined. Please add $user to your baseParams');
        }

        this.userStates = [];
        this.tmpState = null;

        this.initAsync();
    }

    init(){
        if(!this.initialized) {
            $(this.dialog.element).detach().appendTo('body');
        }else{

        }

        this.bindEvents();



        this.initialized = true;
    }

    initServersideStates(){
        if(this.grid.params.presetSaveType === 'serverside'){
            let states = this.getStates();
            this.serverSideStates = states;

            if(!states){
                return;
            }

            states.forEach((apiState, index) => {
                if(typeof apiState.Data === "string"){
                    apiState.Data = JSON.parse(apiState.Data);
                }

                if(apiState.PresetName === '_tmp_'){
                    this.tmpState = this.grid.grid.presetManager.createPresetFromState('_tmp_', apiState.PresetName, apiState.Data);
                    return;
                }

                let name = 'USR'+apiState.User_ID + '_' + apiState.PresetName;


                // let state = this.grid.grid.stateRestore.state(name);
                //
                // if(state[0] === null){
                //     this.grid.grid.stateRestore.state.add(name);
                // }

                this.grid.grid.presetManager.addPresetFromState(name, apiState.PresetName, apiState.Data);
                // localStorage.setItem('DataTables_stateRestore_USR' + apiState.User_ID + '_' + apiState.PresetName+'_'+apiState.URL, apiState.Data);
            });
        }else{
            Object.entries(localStorage).forEach(([key, value]) => {
                if(key.includes('DataGridVue') && key.includes(this.grid.id) && key.includes(window.location.pathname) && key.includes('USR'+this.userID)){
                    let state = JSON.parse(value);

                    if(key.includes('__tmp__')){
                        this.tmpState = this.grid.grid.presetManager.createPresetFromState('_tmp_', '_tmp_', state);
                        return;
                    }

                    let name = key.replace('DataGridVue_'+'USR'+this.userID+'_', '');
                    name = name.replace('_'+this.grid.id+'_'+window.location.pathname, '');

                    this.grid.grid.presetManager.addPresetFromState(key, name, state);
                }
            });
        }
    }

    async initAsync(){
        this.init();
    }

    async loadUserStatesAsync(){
        this.loadUserStates();
    }

    addDefaultState(baseOptions){
        let options = {
            "order": [],
            "columns": [],
            "columnsWidth": [],
            "ColReorder": [],
            "start": 0,
            "length": 400
        };

        options.order = baseOptions.order.order.map((order) => {
            return {
                column: order[0],
                dir: order[1]
            }
        })

        baseOptions.aoColumnDefs.forEach((col, i) => {
            let c = {};

            if(typeof col.visible === 'undefined')
                col.visible = true;

            c.visible = col.visible;
            options.columns.push(c);

            if(typeof col.sWidth === 'undefined')
                col.sWidth = null;

            options.columnsWidth.push(col.sWidth);

            options.ColReorder.push(i);
        });

        this.grid._onAfterInit = (() => {
            // this.defaultState = new $.fn.dataTable.StateRestore(
            //     this.grid.grid,
            //     {remove: false, rename: false},
            //     "Reset",
            //     options,
            //     true
            // );

            this.defaultState = this.grid.grid.presetManager.createPresetFromState('default', 'Default', options);
        });
    }

    bindEvents(){
        $(document).on('click', '#'+ this.selector + ' .user-presets button', function(){
            eval($(this).data('onclick'));
        });

        $(document).on('click', '#'+ this.selector + ' button .buttons div', ((e) => {
            e.stopPropagation();
            eval($(e.currentTarget).data('onclick'));
        }));

        $(document).click((event) => {
            if(this.dialog.dialogShow){
                let $target = $(event.target);
                if(!$target.closest('#'+this.selector).length && !$target.closest('#'+this.selector + '_button').length){
                    this.hideDialog();
                }
            }
        });
    }

    changeDialogPosition(){
        let button = $(this.dialog.buttonElement);
        let element = $(this.dialog.element);
        let buttonPos = button.offset();

        this.dialog.position = {
            top: buttonPos.top + button.outerHeight() + 11,
            left: buttonPos.left - element.outerWidth() + button.outerWidth() + 15 - 6,
        };

        this.redrawDialog();

        return this.dialog.position;
    }

    redrawDialog(){
        let element = $(this.dialog.element);

        element.css('top', this.dialog.position.top);
        element.css('left', this.dialog.position.left);
    }

    showDialog(){
        this.loadUserStatesAsync().then(() => {
            this.renderDialog();
            this.changeDialogPosition();

            $(this.dialog.element).removeClass('d-none');
            this.dialog.dialogShow = true;
        });

    }

    hideDialog(){
        $(this.dialog.element).addClass('d-none');
        this.dialog.dialogShow = false;
    }

    toogleShowDialog(){
        if(this.dialog.dialogShow)
            this.hideDialog();
        else
            this.showDialog();
    }

    renderDialog(){
        let element = $(this.dialog.element);

        element.find('.user-presets').html('');
        this.userStates.forEach((state, i) => {
            element.find('.user-presets').append(`
                <div class="preset-row">
                    <button type="button" class="btn" data-onclick="window['${this.grid.id}'].stateRestore.changeState('${state.id}')">${state.name}
                    <div class="buttons">
                        <div data-onclick="window['${this.grid.id}'].stateRestore.renameStateDialog('${state.id}')" data-toggle="bstooltip" title="${translations.RENAME}"><i class="ci ci-edit btn-ci"></i></div>
                        <div data-onclick="window['${this.grid.id}'].stateRestore.updateState('${state.id}')" data-toggle="bstooltip" title="${translations.UPDATE}"><i class="ci ci-refresh btn-ci"></i></div>
                        <div data-onclick="window['${this.grid.id}'].stateRestore.removeState('${state.id}')" data-toggle="bstooltip" title="${translations.REMOVE}"><i class="ci ci-times btn-ci"></i></div>
                    </div>
                    </button>
                </div>
            `);
        });

    }

    loadUserStates(){
        this.userStates = [];
        if(this.userID){
            // this.grid.grid.stateRestore.states().each((state, i) => {
            //     if(state.s.identifier.includes('USR'+this.userID + '_')){
            //         state.Identifier = state.s.identifier;
            //         state.Name = state.s.identifier.replace('USR'+this.userID + '_', "");
            //         this.userStates.push(state);
            //     }
            // });
            Object.entries(this.grid.grid.presetManager.presets).forEach(([key, preset]) => {
                if(preset.id.includes('USR'+this.userID + '_')){
                    // state.Identifier = state.s.identifier;
                    // state.Name = state.s.identifier.replace('USR'+this.userID + '_', "");
                    this.userStates.push(preset);
                }
            });
        }

        this.renderDialog();

        return this.userStates;
    }

    showAddStateDialog(){
        // this.grid.grid.stateRestore.state.add('', {
        //     creationModal: true,
        //     toggle: {
        //         columns: {
        //             visible: true
        //         },
        //         order: false,
        //     },
        //     saveState: {
        //         order: true,
        //         scroller: false,
        //         select: false,
        //         paging: false,
        //         search: false,
        //         columns: {
        //             search: false,
        //             visible: true,
        //         },
        //         searchBuilder: false,
        //         searchPanes: false,
        //     },
        // });
        this.renderAddStateDialog();
    }

    renderAddStateDialog(){
        this.addDialog.dialog = new Dialog();
        this.addDialog.dialog.title = translations.ADD;
        this.addDialog.dialog.enableCancelButton();
        this.addDialog.dialog.enableConfirmButton(`window['${this.grid.id}'].stateRestore.addUserState()`);

        this.addDialog.dialog.content = `<div class="form-group"><div class="form-input-group col-md-12"><label for="Name">${translations.NAME}</label><input type="text" name="tmpName" class="form-control"></div></div>`;

        // $(this.addDialog.dialog.element).on('keyup', '[name="tmpName"]', ((e) => {
        //     $(this.grid.element).closest('.dataTables_wrapper').find('.dtsr-creation').find('.dtsr-name-input').val('USR'+this.userID + '_' + $(e.currentTarget).val());
        // }));


        this.addDialog.dialog.show();
    }

    addUserState(){
        if(!this.isStateExist($('[name="tmpName"]').val())) {
            // $(this.grid.element).closest('.dataTables_wrapper').find('.dtsr-creation').find('.dtsr-creation-button').click();
            const preset = this.grid.grid.presetManager.addPresetFromCurrentDataGrid('USR'+this.userID + '_' + $('[name="tmpName"]').val(), $('[name="tmpName"]').val());

            if(this.grid.params.presetSaveType === 'serverside'){
                const data = JSON.stringify(preset.state);

                this.saveState(preset.name, data);
            }else{
                localStorage.setItem('DataGridVue_'+preset.id+'_'+this.grid.id+'_'+window.location.pathname, JSON.stringify(preset.state));
            }

            this.addDialog.dialog.close();
            setTimeout(() => this.loadUserStates(), 100);
            this.addDialog.dialog = null;
        }else{
            alert(translations.NAME_ALREADY_EXIST);
        }
    }

    changeState(id){
        const preset = this.grid.grid.presetManager.getPresetByID(id);

        if(preset){
            preset.load();
        }
        // let storeData = this.grid.grid.state.loaded();
        //
        // this.grid.columnsWidth = storeData.columnsWidth;

        return preset;
    }

    resetToDefault(){
        this.defaultState.load();
        // let storeData = this.grid.grid.state.loaded();
        //
        // this.grid.columnsWidth = storeData.columnsWidth;
    }

    updateState(id){
        const preset = this.grid.grid.presetManager.getPresetByID(id);

        if(confirm(translations.PRESET_ADD_CONFIRM + ' "' + preset.name + '"?')) {
            if(preset){
                this.grid.grid.presetManager.addPresetFromCurrentDataGrid(id, preset.name);
            }

            const data = JSON.stringify(preset.state);
            if(this.grid.params.presetSaveType === 'serverside'){
                this.saveState(preset.name, data);
            }else{
                localStorage.setItem(preset.id, JSON.stringify(preset.state));
            }

            this.loadUserStates();
        }
    }

    removeState(id){
        const preset = this.grid.grid.presetManager.getPresetByID(id);

        if(confirm(translations.REMOVE_QUESTION + ' ' + translations.PRESET + ' "' + preset.name + '"?')) {
            if(this.grid.params.presetSaveType === 'serverside') {
                this.deleteState(preset.name);
            }else{
                localStorage.removeItem(preset.id);
            }

            this.grid.grid.presetManager.removePreset(id);


            this.loadUserStates();
        }
    }

    renameStateDialog(id){
        this.renameDialog.dialog = new Dialog();
        this.renameDialog.dialog.title = translations.PREVIEW;
        this.renameDialog.dialog.enableCancelButton();
        this.renameDialog.dialog.enableConfirmButton(`window['${this.grid.id}'].stateRestore.processRenameStateDialog('${id}')`);

        this.renameDialog.dialog.content = `<div class="form-group"><div class="form-input-group col-md-12"><label for="Name">${translations.NAME}</label><input type="text" name="tmpName" class="form-control"></div></div>`;

        this.renameDialog.dialog.show();
    }

    processRenameStateDialog(id){
        const preset = this.grid.grid.presetManager.getPresetByID(id);

        let newName = $('[name="tmpName"]').val();
        if(!this.isStateExist(newName)){
            this.renameState(preset.name, newName, id);
            this.renameDialog.dialog.close();
            this.renameDialog.dialog = null;
        }else{
            alert(translations.NAME_ALREADY_EXIST);
        }

    }

    renameState(name, newName, id){
        const preset = this.grid.grid.presetManager.getPresetByID(id);

        if(this.grid.params.presetSaveType === 'serverside') {
            this.renameServersideState(name, newName);
        }else{
            localStorage.removeItem(preset.id);
            localStorage.setItem('DataGridVue_'+preset.id+'_'+this.grid.id+'_'+window.location.pathname, JSON.stringify(preset.state));
        }

        preset.name = newName;

        this.loadUserStates();
    }

    isStateExist(name){
        let exist = false;

        this.userStates.forEach((state, i) => {
            if(state.Name === name)
                exist = true;
        });

        return exist;
    }

    getState(presetName){
        let state;
        Helpers.ajax({
            url: basePath + '/' + this.grid.params.presetServersideUrl + '/get',
            async: false,
            data: {
                URL: window.location.pathname,
                GridName: this.grid.id,
                UserID: this.userID,
                PresetName: presetName,
            },
            success: (data) => {
                if(data)
                    state = JSON.parse(data);
                else
                    state = null;
            }
        });

        return state;
    }

    getStates(){
        let states;
        Helpers.ajax({
            url: basePath + '/' + this.grid.params.presetServersideUrl + '/get',
            async: false,
            data: {
                URL: window.location.pathname,
                GridName: this.grid.id,
                UserID: this.userID,
                All: true,
            },
            success: (data) => {
                if(data)
                    states = JSON.parse(data);
                else
                    states = null;
            }
        });

        return states;
    }

    deleteState(presetName){
        Helpers.ajax({
            url: basePath + '/' + this.grid.params.presetServersideUrl + '/delete',
            data: {
                URL: window.location.pathname,
                GridName: this.grid.id,
                UserID: this.userID,
                PresetName: presetName,
            },
            success: (data) => {
            }
        });
    }

    saveState(presetName, data){
        Helpers.ajax({
            url: basePath + '/' + this.grid.params.presetServersideUrl + '/save',
            data: {
                URL: window.location.pathname,
                GridName: this.grid.id,
                UserID: this.userID,
                PresetName: presetName,
                Data: data,
            },
            success: (data) => {
            }
        });
    }

    renameServersideState(oldPresetName, newPresetName){
        Helpers.ajax({
            url: basePath + '/' + this.grid.params.presetServersideUrl + '/rename',
            data: {
                URL: window.location.pathname,
                GridName: this.grid.id,
                UserID: this.userID,
                OldPresetName: oldPresetName,
                NewPresetName: newPresetName,
            },
            success: (data) => {
            }
        });
    }

    getTmpState(){

    }
}