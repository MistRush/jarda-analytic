import FormControl from "./FormControl";
import ControlPart from "./Parts/ControlPart";
import {reactive} from "vue"; // Importujeme třídu ControlPart

export default class TextInput extends FormControl {
    static TYPE_TEXT = 'text';
    static TYPE_EMAIL = 'email';
    static TYPE_PASSWORD = 'password';
    static TYPE_NUMBER = 'number';
    static TYPE_FLOAT = 'float';
    static TYPE_HIDDEN = 'hidden';

    constructor(superInstance, name, label = null, required = false, type = TextInput.TYPE_TEXT) {
        super(superInstance, name, label);

        // Používáme ControlPart místo přímého HTML elementu
        this.controlPart = reactive(new ControlPart('input'));
        this.controlPart.setAttribute('type', (type === TextInput.TYPE_FLOAT) ? 'number' : type);
        this.controlPart.setClass('form-control');
        this.controlPart.setAttribute('autocomplete', 'false');

        // Specifické chování pro typ FLOAT
        if (type === TextInput.TYPE_FLOAT) {
            this.controlPart.setAttribute('step', '0.01');
            this.addRule(FormControl.VALIDATOR_PATTERN, 'Invalid float value', "^([0-9.]+)*$");
        }

        // Specifické chování pro typ HIDDEN
        if (type === TextInput.TYPE_HIDDEN) {
            this.element.addClass('d-none');
            this.setRenderLabel(false);
        }

        // Nastavení required, pokud je potřeba
        if (required) {
            this.setRequired();
        }
    }

    // Přepsání metody setValue
    setValue(value) {
        super.setValue(value);
        this.controlPart.setAttribute('value', value);
        return this;
    }
}
