import FormControl from "./FormControl";
import ControlPart from "@/Components/OldForm/js/Controls/Parts/ControlPart";
import {reactive} from "vue";

export default class ComboBox extends FormControl {
    enumValues = {};
    multi = false;
    dynamicAddingOptions = false;
    quickEditorUrl = null;
    editable = false;
    storeField = null;
    ajax = false;

    constructor(superInstance, name, label = null, required = false, enumValues = {}, storeField = null, multi = false, ajax = false) {
        super(superInstance, name, label);

        // Nastavení základních vlastností
        this.controlPart = reactive(new ControlPart('select'));
        this.controlPart.addClass('form-control');
        this.multi = multi;
        this.storeField = storeField;
        this.ajax = ajax;

        //TODO vyřešit, tohle není dobré
        if (!ajax && ajax !== null) {
            // Přidání atributu 'multiple' pokud je povoleno více výběrů
            if (multi) {
                this.controlPart.setAttribute('multiple', 'multiple');
            }

            // Pokud není zadané storeField, nastavíme enumValues přímo
            if (storeField == null || (Array.isArray(storeField) && storeField.length === 0)) {
                if (multi) {
                    delete enumValues[''];
                }
                this.enumValues = enumValues;
            } else {
                // Jinak zpracujeme hodnoty podle storeField
                this.enumValues = this.getStoreValues(enumValues, storeField);
            }

            // Pokud je enumValues příliš mnoho, nastavíme minimální délku pro vyhledávání
            if (Object.keys(this.enumValues).length > 50) {
                this.setMinimumSearchLength(1);
            }

            // Nastavení šířky selectboxu
            this.setSelectWidth('100%');
        } else {
            // Pokud je ajax true, nastavíme store data pro dynamické načítání hodnot
            if (!enumValues['action']) {
                enumValues['action'] = 'data-list';
            }

            let store = window.basePath ?? null;
            if (!enumValues['module']) {
                store += '/admin';
            } else {
                store += `/${enumValues['module']}`;
                delete enumValues['module'];
            }
            store += `/${enumValues['controller']}/${enumValues['action']}`;
            delete enumValues['action'];
            delete enumValues['controller'];

            this.controlPart.setAttribute('data-store', store);
            this.controlPart.setAttribute('data-storefield', storeField);
            this.controlPart.setAttribute('data-storeparams', JSON.stringify(enumValues));
            this.controlPart.setAttribute('data-storedepends', ajax);

            this.setSelectWidth();
        }

        // Nastavení required pokud je potřeba
        if (required) {
            this.setRequired();
        }
    }

    // Metoda pro získání hodnot ze store
    getStoreValues(store, storeField) {
        let managerClass = `${store['module'] || 'admin'}_Manager_`;
        managerClass += store['controller'].split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
        const manager = new window[managerClass]();
        delete store['module'];
        delete store['controller'];

        const data = manager.performDataList(store, 'LIST_HIERARCHY');
        const result = this.multi ? [] : { '': '' };

        data['data'].forEach(item => {
            result[item["ID"]] = item[storeField];
        });

        return result;
    }

    // Nastavení minimální délky pro vyhledávání v selectboxu
    setMinimumSearchLength(length = 3) {
        this.controlPart.setAttribute('data-minimum-input-length', length);
        return this;
    }

    // Nastavení šířky selectboxu
    setSelectWidth(width = '100%') {
        if (typeof width !== 'string') {
            width += 'px';
        }

        this.controlPart.setAttribute('data-width', width);
        this.controlPart.setAttribute('style', `width: ${width}`); //TODO tohle je špatně
        return this;
    }

    // Kontrola, zda je selectbox načítaný dynamicky pomocí ajaxu
    isAjax() {
        return !!this.controlPart.getAttribute('data-store');
    }

    enableDynamicAddingOptions(quickEditorUrl)
    {
        this.quickEditorUrl = quickEditorUrl;
        this.dynamicAddingOptions = true;

        return $this;
    }

    // Nastavení editovatelnosti selectboxu
    setEditable(editable = true) {
        this.editable = editable;
    }
}
