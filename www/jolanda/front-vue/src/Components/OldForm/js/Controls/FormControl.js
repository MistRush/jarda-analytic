import LabelPart from "./Parts/LabelPart";
import ControlPart from "./Parts/ControlPart";
import BasePart from "./Parts/BasePart";
import {reactive} from "vue";

export default class FormControl {
    static VALIDATOR_REQUIRED = ':required';
    static VALIDATOR_MIN_LENGTH = ':min_length';
    static VALIDATOR_MAX_LENGTH = ':max_length';
    static VALIDATOR_LENGTH = ':length';
    static VALIDATOR_EMAIL = ':email';
    static VALIDATOR_PATTERN = ':pattern';
    static VALIDATOR_NUMBER = ':number';
    static VALIDATOR_RANGE = ':range';
    static VALIDATOR_SAME_VALUE = ':same';
    static VALIDATOR_CUSTOM = ':custom';

    static idMask = 'frm-%s';

    // Definice vlastností s výchozími hodnotami
    name = '';
    value = null;
    label = '';
    labelPart = null;
    controlPart = null;
    disabled = false;
    placeholder = '';
    element = null;
    required = false;
    validators = [];
    readOnly = false;
    columnSize = 12;
    parentForm = null;
    renderLabel = true;
    helpHtml = null;
    super = null;

    // Konstruktor třídy
    constructor(superInstance, name, label = null) {
        this.name = name;
        this.super = superInstance;
        this.label = label;

        // Používáme třídu LabelPart místo HTML elementu
        this.labelPart = reactive(new LabelPart(label));
        this.element = reactive(new BasePart('div'));

        // Kontrolní část, defaultně je to input
        this.controlPart = reactive(new ControlPart('input'));
    }

    // Nastavení rodičovského formuláře
    setParentForm(parentForm) {
        this.parentForm = parentForm;
        this.controlPart.setAttribute('id', `${parentForm.getId()}_${this.name}`);
        return this;
    }

    // Vrací, zda se má renderovat label
    isRenderLabel() {
        return this.renderLabel;
    }

    // Nastavuje, zda se má renderovat label
    setRenderLabel(renderLabel) {
        this.renderLabel = renderLabel;
        return this;
    }

    // Vrací atribut name
    getName() {
        return this.name;
    }

    // Nastavuje atribut name
    setName(name) {
        this.name = name;
        return this;
    }

    // Vrací hodnotu prvku
    getValue() {
        return this.value;
    }

    // Nastavuje hodnotu prvku
    setValue(value) {
        this.value = value;
        return this;
    }

    // Vrací popisek prvku
    getLabel() {
        return this.label;
    }

    // Nastavuje popisek prvku
    setLabel(label) {
        this.label = label;
        return this;
    }

    // Nastavuje accesskey
    setAccesskey(accesskey) {
        this.labelPart.setAttribute('accesskey', accesskey);
    }

    // Vrací atribut placeholder
    getPlaceholder() {
        return this.placeholder;
    }

    // Nastavuje atribut placeholder
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    // Nastavuje prvek jako required
    setRequired(required = true, message = '') {
        if (!message) {
            message = 'Field is required';
        }
        this.required = required;
        this.addRule(FormControl.VALIDATOR_REQUIRED, message);
        return this;
    }

    // Přidává validační pravidlo
    addRule(validator, message, params = null) {
        this.validators.push({ v: validator, m: message, p: params });
        return this;
    }

    // Nastavuje velikost bootstrap sloupce
    setColumnSize(size) {
        if (size > 12) {
            this.columnSize = 12;
        } else if (size === 0) {
            this.columnSize = 'auto';
        } else if (size < 1) {
            this.columnSize = 1;
        } else {
            this.columnSize = size;
        }
        return this;
    }

    // Vrací HTML část s popiskem
    getLabelPart() {
        return this.labelPart;
    }

    // Nastavuje HTML část s popiskem
    setLabelPart(labelPart) {
        this.labelPart = labelPart;
        return this;
    }

    // Vrací HTML část s ovládacím prvkem
    getControlPart() {
        return this.controlPart;
    }

    // Nastavuje HTML část s ovládacím prvkem
    setControlPart(controlPart) {
        this.controlPart = controlPart;
        return this;
    }

    // Nastavuje atribut elementu
    setElementAttribute(name, value) {
        if (this.controlPart) {
            this.controlPart.setAttribute(name, value);
        }
        return this;
    }

    // Nastavuje nápovědu pro prvek
    setHelp(helpText) {
        this.helpHtml = helpText;
        return this;
    }

    // Vrací nápovědu prvku
    getHelp() {
        return this.helpHtml;
    }

    // Render prvku
    toString() {
        if (this.helpHtml) {
            this.labelPart.innerHTML += `<i class='ml-2 ci ci-help cursor-pointer' data-toggle='bstooltip' data-title='${this.helpHtml}'></i>`;
        }

        if (this.isRequired()) {
            this.labelPart.innerHTML += ' <span class="required-char">*</span>';
        } else {
            this.labelPart.innerHTML += ' <span class="required-char d-none">*</span>';
        }

        this.element.classList.add('form-input-group', `col-md-${this.columnSize}`);
        this.element.setAttribute('id', `${this.name}_group`);

        if (this.validators.length) {
            this.controlPart.setAttribute('data-validator', JSON.stringify(this.validators));
        }

        if (this.isDisabled()) {
            this.controlPart.classList.add('disabled');
            this.controlPart.setAttribute('disabled', 'disabled');
        }

        if (this.isReadOnly()) {
            this.controlPart.setAttribute('readonly', 'readonly');
            this.element.classList.add('readonly');
        }

        this.controlPart.setAttribute('placeholder', this.placeholder);
        this.controlPart.setAttribute('name', this.name);

        if (this.isRenderLabel()) {
            this.element.insertAdjacentElement('afterbegin', this.labelPart);
        }

        this.element.appendChild(this.controlPart);

        return this.element.outerHTML;
    }

    // Vrací, zda má prvek atribut disabled
    isDisabled() {
        return this.disabled;
    }

    // Nastavuje atribut disabled
    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }

    // Vrací, zda má prvek atribut readonly
    isReadOnly() {
        return this.readOnly;
    }

    // Nastavuje atribut readonly
    setReadOnly(readOnly) {
        this.readOnly = readOnly;
        return this;
    }

    getElement(){
        return this.element;
    }
}
