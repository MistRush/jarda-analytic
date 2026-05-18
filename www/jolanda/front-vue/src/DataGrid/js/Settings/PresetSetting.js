export class PresetSetting {
    static SAVE_TYPE_LOCAL = "local";
    static SAVE_TYPE_SERVERSIDE = "serverside";
    static SAVE_TYPE = PresetSetting.SAVE_TYPE_LOCAL;

    static SERVERSIDE_URL = "/default/preset";

    _toggle = {
        columns: {
            visible: true,
        },
        order: false,
    };
    _saveState = {
        order: true,
        scroller: false,
        select: false,
        paging: false,
        search: false,
        columns: {
            search: false,
            visible: true,
        },
        searchBuilder: false,
        searchPanes: false,
    };
    _saveType = PresetSetting.SAVE_TYPE;
    _serversideUrl = PresetSetting.SERVERSIDE_URL;

    _presetTriggerSave = null;

    constructor(settings) {
        this.toggle = settings.toggle;
        this.saveState = settings.saveState;
        this.presetTriggerSave = settings.presetTriggerSave ?? null;
    }

    get toggle() {
        return this._toggle;
    }

    set toggle(value) {
        this._toggle = value;
    }

    get saveState() {
        return this._saveState;
    }

    set saveState(value) {
        this._saveState = value;
    }

    get presetTriggerSave() {
        return this._presetTriggerSave;
    }

    set presetTriggerSave(value) {
        this._presetTriggerSave = value;
    }

    get saveType() {
        return this._saveType;
    }

    set saveType(value) {
        this._saveType = value;
    }

    get serversideUrl() {
        return this._serversideUrl;
    }

    set serversideUrl(value) {
        this._serversideUrl = value;
    }
}
