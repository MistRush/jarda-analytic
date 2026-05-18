import BasePart from "./Parts/BasePart";
import Checkbox from "./Checkbox";
import ComboBox from "./ComboBox";
import DateBox from "./DateBox";
import FileBox from "./FileBox";
import RadioButton from "./RadioButton";
import TextArea from "./TextArea";
import TextInput from "./TextInput";
import {reactive} from "vue";

export default class FormGroup {
    parent = null;
    super = null;
    id = null;
    defaultColumnSize = 12;
    element = null;
    label = null;
    formControls = [];
    dataAttribute = null;
    formGroups = [];

    // Konstruktor
    constructor(parent, label = null, id = null) {
        this.element = reactive(new BasePart('div'));
        this.element.addClass(['row', 'form-group']);
        this.label = label;
        this.parent = parent;
        this.id = id || 'group_' + Math.random().toString(36).substring(7);
        this.super = parent?.getSuper();
    }

    // Vrací výchozí velikost Bootstrap sloupce
    getDefaultColumnSize() {
        return this.defaultColumnSize;
    }

    // Nastavuje výchozí velikost Bootstrap sloupce
    setDefaultColumnSize(defaultColumnSize) {
        if (defaultColumnSize > 12) {
            this.defaultColumnSize = 12;
        } else if (defaultColumnSize === 0) {
            this.defaultColumnSize = 'auto';
        } else if (defaultColumnSize < 1) {
            this.defaultColumnSize = 1;
        } else {
            this.defaultColumnSize = defaultColumnSize;
        }
        return this;
    }

    // Nastavuje počet sloupců
    setColumns(columns) {
        if (columns > 12) {
            this.defaultColumnSize = 1;
        } else if (columns < 1) {
            this.defaultColumnSize = 12;
        } else {
            this.defaultColumnSize = 12 / columns;
        }
        return this;
    }

    // Nastavuje property modelu pro vazbu
    setDataAttribute(dataAttribute) {
        this.dataAttribute = dataAttribute;
        return this;
    }

    // Vrací HTML element skupiny
    getElement() {
        return this.element;
    }

    // Vrací popisek skupiny
    getLabel() {
        return this.label;
    }

    // Nastavuje popisek skupiny
    setLabel(label) {
        this.label = label;
        return this;
    }

    // Přidá prázdné pole
    addEmpty(columnSize = null) {
        if (columnSize === null) {
            columnSize = this.defaultColumnSize;
        }
        const control = document.createElement('div');
        control.classList.add('form-input-group', `col-md-${columnSize}`);
        this.formControls.push(control);
        return control;
    }

    // Přidá TextBox
    addTextBox(name, label = null, required = false) {
        const control = reactive(new TextInput(this.super, name, label, required, TextInput.TYPE_TEXT));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá Password
    addPassword(name, label = null, required = false) {
        const control = reactive(new TextInput(this.super, name, label, required, TextInput.TYPE_PASSWORD));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá NumericBox
    addNumericBox(name, label = null, required = false) {
        const control = reactive(new TextInput(this.super, name, label, required, TextInput.TYPE_NUMBER));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá DateTimeBox
    addDateTimeBox(name, label = null, required = false) {
        const control = reactive(new DateBox(this.super, name, label, required, DateBox.TYPE_DATETIME));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá TimeBox
    addTimeBox(name, label = null, type = 'HMS', required = false) {
        if (type !== 'H' && type !== 'HM' && type !== 'HMS') {
            throw new Error('Wrong timeBox type');
        }
        const control = reactive(new DateBox(this.super, name, label, required, DateBox.TYPE_TIME + type));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá Editor (alias TextArea)
    addEditor(name, label = null) {
        const control = this.addTextArea(name, label);
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        control.getControlPart().setAttribute('data-mce', 'true');
        return control;
    }

    // Přidá TextArea
    addTextArea(name, label = null, required = false) {
        const control = reactive(new TextArea(this.super, name, label, required));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá DateBox
    addDateBox(name, label = null, required = false) {
        const control = reactive(new DateBox(this.super, name, label, required, DateBox.TYPE_DATE));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá ComboBoxStore
    addComboBoxStore(name, label = null, storeUrl = { module: 'admin' }, storeField = 'Name', required = false) {
        const control = reactive(new ComboBox(this.super, name, label, required, storeUrl, storeField));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá AjaxComboBoxStore
    addAjaxComboBoxStore(name, label = null, storeUrl = { module: 'admin' }, storeField = 'Name', depends = null, required = false) {
        const control = reactive(new ComboBox(this.super, name, label, required, storeUrl, storeField, false, depends));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Alias addComboBoxEnum
    addSelect(name, label = null, enumValues = [], required = false) {
        return this.addComboBoxEnum(name, label, enumValues, required);
    }

    // Přidá ComboBoxEnum
    addComboBoxEnum(name, label = null, enumValues = [], required = false, multi = false) {
        const control = reactive(new ComboBox(this.super, name, label, required, enumValues, [], multi));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá MultiSelect
    addMultiSelect(name, label = null, enumValues = [], required = false) {
        return this.addComboBoxEnum(name, label, enumValues, required, true);
    }

    // Přidá FileBox
    addFileBox(name, label = null, fileUploadUrl = { module: 'common', controller: 'file', action: 'upload' }, preview = false, path = null) {
        const control = reactive(new FileBox(this.super, name, label, fileUploadUrl));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);

        if (fileUploadUrl.folder) {
            control.getControlPart().setAttribute('data-folder', fileUploadUrl.folder);
        }

        if (preview) {
            const group = document.createElement('div');
            group.classList.add('form-input-group', 'col-md-12');
            const img = document.createElement('img');
            img.setAttribute('data-imgpreview', name);
            img.setAttribute('data-imgpath', path);
            group.appendChild(img);
            this.formControls.push(group);
        }

        this.formControls.push(control);
        return control;
    }

    // Přidá MultiFileBox
    addMultiFileBox(name, label = null, fileUploadUrl = { module: 'common', controller: 'file', action: 'upload' }, callback = null, options = null) {
        const control = reactive(new FileBox(this.super, name, label, fileUploadUrl, true));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        control.getControlPart().setAttribute('data-callback', callback);
        control.getControlPart().setAttribute('data-multiupload', true);

        if (options) {
            options.url = `/url/${options.url}/data-create`;
            control.getControlPart().setAttribute('data-multiupload-url', JSON.stringify(options));
        }

        this.formControls.push(control);
        return control;
    }

    // Přidá CheckBox
    addCheckBox(name, label = null, required = false) {
        const control = reactive(new Checkbox(this.super, name, label, required));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá BoolRadioButton
    addBoolRadioButton(name, label = null, noneOption = false) {
        const control = this.addRadioButton(name, label);
        const items = {
            '1': 'Yes',
            '0': 'No'
        };

        if (noneOption) {
            items[null] = 'None';
        }

        control.addDataItems(items);
        return control;
    }

    // Přidá RadioButton
    addRadioButton(name, label = null, items = [], required = false) {
        const control = reactive(new RadioButton(this.super, name, label, required));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        control.addDataItems(items);
        this.formControls.push(control);
        return control;
    }

    // Přidá CurrencyBox
    addCurrencyBox(name, label = null, required = false) {
        const control = this.addFloatingPointBox(name, label, required);
        control.getControlPart().setAttribute('data-currency', '1');
        return control;
    }

    // Přidá FloatingPointBox
    addFloatingPointBox(name, label = null, required = false) {
        const control = reactive(new TextInput(this.super, name, label, required, TextInput.TYPE_FLOAT));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Přidá HiddenField
    addHidden(name) {
        const control = reactive(new TextInput(this.super, name, null, false, TextInput.TYPE_HIDDEN));
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        this.formControls.push(control);
        return control;
    }

    // Vrací rodičovský formulář
    getParent() {
        return this.parent;
    }

    // Přidá HTML obsah
    addHtml(html = '') {
        const columnSize = this.getDefaultColumnSize();
        const control = document.createElement('div');
        control.classList.add('form-input-group', `col-md-${columnSize}`);
        control.innerHTML = html;
        this.formControls.push(control);
        return control;
    }

    // Přidá BlockEditor
    addBlockEditor(name) {
        //TODO BlockEditor
        const control = this.addTextArea(name);
        control.setParentForm(this.parent);
        control.setColumnSize(this.defaultColumnSize);
        control.getControlPart().hidden = true;
        control.getControlPart().setAttribute('blockeditor', name);

        const blockEditor = new BlockEditor(this.super, name, name);
        blockEditor.setColumnSize(this.defaultColumnSize);
        this.formControls.push(blockEditor);
        return blockEditor;
    }

    // Přidá DynamicBlockEditor
    addDynamicBlockEditor(name, defaultName, names) {
        names.forEach(key => {
            const control = this.addTextArea(key);
            control.setParentForm(this.parent);
            control.setColumnSize(this.defaultColumnSize);
            control.getControlPart().hidden = true;
            control.getControlPart().setAttribute('blockeditor', key);
            control.getElement().classList.add('d-none');
        });

        const blockEditor = new BlockEditor(this.super, name, defaultName); //TODO
        blockEditor.setColumnSize(this.defaultColumnSize);
        blockEditor.getControlPart().setAttribute('dynamic', '1');

        const selectControl = this.addComboBoxEnum(`${blockEditor.getName()}_names`, '', names).setValue(defaultName);

        this.formControls.push(blockEditor);
        return blockEditor;
    }

    // Přidá FormGroup
    addFormGroup(title) {
        const formGroup = reactive(new FormGroup(this, title));
        formGroup.setDefaultColumnSize(12);
        this.formGroups.push(formGroup);
        this.formControls.push(formGroup);
        return formGroup;
    }

    // Vrací ID skupiny
    getId() {
        return this.id;
    }

    // Nastavuje ID skupiny
    setId(id) {
        this.id = id;
        return this;
    }

    // Vrací formControls
    getFormControls() {
        return this.formControls;
    }

    // Hledá FormControl podle názvu
    getFormControl(name) {
        return this.formControls.find(control => control.getName() === name) || null;
    }
}
