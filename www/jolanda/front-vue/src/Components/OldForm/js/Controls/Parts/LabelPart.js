import BasePart from './BasePart';

export default class LabelPart extends BasePart {
    constructor(text = '', attributes = {}) {
        super('label', attributes);
        this.setText(text); // Nastaví text, pokud je uveden
    }
}
