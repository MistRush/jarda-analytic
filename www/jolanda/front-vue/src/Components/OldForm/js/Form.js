import BasePart from "./Controls/Parts/BasePart";
import FormGroup from "./Controls/FormGroup";
import {reactive} from "vue";

export default class Form {
    // Definice vlastností s výchozími hodnotami
    id = null;
    formGroups = [];
    element = null;
    super = null;
    buttons = [];
    templatePath = null;

    // Konstruktor třídy
    constructor(superInstance = null) {
        // Inicializace ID formuláře
        this.id = 'form_' + Math.random().toString(36).substring(7);

        // HTML element formuláře
        this.element = reactive(new BasePart('form'));
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('enctype', 'multipart/form-data');

        // Nastavení rodičovské instance
        this.super = superInstance;
    }

    // Vrací HTML element formuláře
    getElement() {
        return this.element;
    }

    // Nastavení akce (URL) pro odeslání formuláře
    setAction(action) {
        this.element.setAttribute('action', action);
        return this;
    }

    // Vrací pole formulářových skupin
    getFormGroups() {
        return this.formGroups;
    }

    // Přidání formulářové skupiny
    addFormGroup(label = null, id = null) {
        const formGroup = reactive(new FormGroup(this, label, id)); // FormGroup implementujeme později
        this.formGroups.push(formGroup);
        return formGroup;
    }

    // Přidání tlačítka
    addButton(label, type = 'button', classes = 'btn btn-primary') {
        const button = reactive(new BasePart('button'));
        button.setAttribute('type', type);
        button.setClass(classes);
        button.setText(label);
        button.setTag('button');

        this.buttons.push(button);
        return button;
    }

    // Nastavení, zda má být formulář odesílán pomocí AJAXu
    setAjax(ajax = true) {
        this.element.setAttribute('data-ajax', ajax.toString());
        return this;
    }

    // Vrací rodičovskou instanci (super)
    getSuper() {
        return this.super;
    }

    // Vrací ID formuláře
    getId() {
        return this.id;
    }

    // Nastavuje ID formuláře
    setId(id) {
        this.id = id;
        this.element.setAttribute('id', id);
        return this;
    }

    // Nastavuje cestu k šabloně (budoucí použití)
    setTemplate(templatePath) {
        this.templatePath = templatePath;
        return this;
    }

    // Hledá konkrétní FormGroup podle ID
    getFormGroup(id) {
        return this.formGroups.find(group => group.getId() === id) || null;
    }

    // Hledá konkrétní FormControl podle názvu
    getFormControl(name) {
        for (const group of this.formGroups) {
            const control = group.getFormControl(name);
            if (control) return control;
        }
        return null;
    }

    // Vrací všechny FormControly ve všech FormGroups
    getFormControls() {
        return this.formGroups.reduce((controls, group) => {
            return controls.concat(group.getFormControls());
        }, []);
    }

    // Kontroluje, zda formulář má nějaké kontroly
    hasControls() {
        return this.getFormControls().length > 0;
    }
}
