import BasePart from './BasePart';

export default class ControlPart extends BasePart {
    constructor(type = 'input', attributes = {}) {
        super(type, attributes);
    }

    // Specifické nastavení pro input typy, např. placeholder, value
    setValue(value) {
        this.setAttribute('value', value);
        return this;
    }

    setPlaceholder(placeholder) {
        this.setAttribute('placeholder', placeholder);
        return this;
    }
}
