import FormControl from "./FormControl";
import ControlPart from "@/Components/OldForm/js/Controls/Parts/ControlPart";
import {reactive} from "vue";

export default class TextArea extends FormControl {
    constructor(superInstance, name, label = null, required = false) {
        super(superInstance, name, label);

        // Vytvoření HTML elementu pro textarea
        this.controlPart = reactive(new ControlPart('textarea'));
        this.controlPart.addClass('form-control');

        // Nastavení required, pokud je potřeba
        if (required) {
            this.setRequired();
        }
    }

    // Přepsání metody setValue
    setValue(value) {
        super.setValue(value);
        this.controlPart.setValue = value; // Používáme value pro textarea
        return this;
    }

    // Nastavení počtu řádků v TextArea
    setRows(count) {
        this.controlPart.setAttribute('rows', count);
        return this;
    }
}
