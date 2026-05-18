import FormControl from "./FormControl";
import ControlPart from "@/Components/OldForm/js/Controls/Parts/ControlPart";
import {reactive} from "vue";

export default class RadioButton extends FormControl {
    items = {};

    constructor(superInstance, name, label = null, required = false) {
        super(superInstance, name, label);

        // Vytvoření obalového elementu pro RadioButton
        this.controlPart = reactive(new ControlPart('div'));

        // Nastavení required, pokud je potřeba
        if (required) {
            this.setRequired();
        }
    }

    // Metoda pro přidání položek radiobuttonů
    addDataItems(items) {
        this.items = items;
        return this;
    }
}
