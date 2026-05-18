class Form {
    static VALIDATOR_REQUIRED = ':required';
    static VALIDATOR_MIN_LENGTH = ':min_length';
    static VALIDATOR_MAX_LENGTH = ':max_length';
    static VALIDATOR_LENGTH = ':length';
    static VALIDATOR_EMAIL = ':email';
    static VALIDATOR_PATTERN = ':pattern';
    static VALIDATOR_NUMBER = ':number';
    static VALIDATOR_RANGE = ':range';
    static VALIDATOR_CUSTOM = ':custom';
    static VALIDATOR_SAME_VALUE = ':same';

    /**
     * Form constructor
     * @param {string} form_id ID elementu s formulářem
     */
    constructor(form_id) {
        this.form = document.getElementById(form_id);
        this.onSuccess = null;
        this.onBeforeSubmit = null;
        this.onAfterValidate = null;
        this.onError = null;
        this.invalidFields = [];
        this.inputs = {};
        this.initInputs();
        this.id = form_id;

        if ($(this.form).data('ajax')) {
            $(this.form).submit((event) => {
                event.preventDefault();
                if (typeof this.onBeforeSubmit === 'function') {
                    this.onBeforeSubmit()
                }
                if (this.validate()) {
                    tinyMCE.triggerSave();
                    if (typeof this.onAfterValidate === 'function') {
                        this.onAfterValidate()
                    }
                    Helpers.ajax({
                        url: $(this.form).attr('action'),
                        method: $(this.form).attr('method')?$(this.form).attr('method'):'GET',
                        data: this.serializeArrayEntity(),
                        success: this.onSuccess,
                        error: this.onError
                    })
                }
            })
        }
        this.prepareAjaxStores();

        this.dynamicSelects = [];

        $(this.form).find('[data-dynamicadding="true"]').each((i,e) => {
            const select = {
                element: e,
                name: $(e).find('select').attr('name'),
                parentRows: [],
                parentColumn: null,
                parentEntityID: null,
                customParams: {},
            }

            this.dynamicSelects[select.name] = select;
        });

        $(() => {
            $(this.form).on('change', ':input', (e) => {
                e = $(e.target);
                this.validate(e);
            })

            $(this.form).on('dp.change', '[data-datepicker]', (e) => {
               $(this.form).trigger('change');
            });

            $(this.form).find('[type="file"]').bind('resetFile', function () {
                $(this).data('id', null);
                $(this).next().remove();
            });

            $(this.form).on('click', '.combo_box_add_dynamic_option_button', (e) => {
                e.preventDefault();
                let parent = $('#'+$(e.currentTarget).data('parent'));

                const select = parent.find('select');

                if(typeof select[0] !== 'undefined'){
                    this.openQuickEditor(parent.data('dynamicaddingquickeditor'), select[0], this.dynamicSelects[select.attr('name')]);
                }

            });
        })
    }

    prepareAjaxStores() {
        $(() => {
            plugins.initSelect2Ajax(this.form);
        });
    }

    /**
     * Vrací HTML element s formulářem
     * @returns {HTMLElement}
     */
    getForm() {
        return this.form;
    }

    /**
     * Validace dle RegEx
     * @param {string} value Hodnota k ověření
     * @param {string} pattern RegEx pattern
     * @returns {boolean}
     */
    static validateRegex(value, pattern) {
        let r = new RegExp(pattern);
        return value.match(r) != null
    }

    /**
     * Kontroluje minimální délku řetězce
     * @param {int} value Hodnota k ověření
     * @param {int} minlength Minimílní délka
     * @returns {boolean}
     */
    static validateMinLength(value, minlength) {
        return value.length >= minlength;
    }

    /**
     * Kontroluje maximální délku řetězce
     * @param {int} value Hodnota k ověření
     * @param {int} maxlength Maximální délka
     * @returns {boolean}
     */
    static validateMaxLength(value, maxlength) {
        return value.length <= maxlength;
    }

    /**
     * Kontroluje přesnou délku řetezce
     * @param {string} value Hondota k ověření
     * @param length Délka řetězce
     * @returns {boolean}
     */
    static validateLength(value, length) {
        return toString(value).length === length;
    }

    /**
     * Kontroluje zda je hodnota email
     * @param {string} value Email k ověření
     * @returns {boolean}
     */
    static validateEmail(value) {
        return this.validateRegex(value.toLowerCase(), /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    }

    /**
     * Kontroluje prázdné řetezce
     * @param {string} value Hodnota k ověření
     * @param {jquery} element
     * @returns {boolean}
     */
    static validateRequired(value, element) {
        if (element[0].type === 'radio') {
            return element.closest('.form-input-group').find('input:checked').length > 0
        } else
        return value !== '';
    }

    /**
     * Kontroluje zda je hodnota číslo
     * @param {*} value
     * @returns {boolean}
     */
    static validateNumber(value) {
        return value.isInteger(value);
    }

    /**
     * Kontroluje zda je hodnota stejná jako v cílovém inputu
     * @param {string} value Hodnota k ověření
     * @param {string} other_value Hodnota druhého inputu
     * @returns {boolean}
     */
    static validateSameValue(value, other_value) {
        return other_value == value;
    }

    static validateByCustom(value, input_name, func) {
       return eval(func + '("'+value+'", "'+input_name+'")');
    }

    /**
     * Kontroluje zda je hodnota v rozsahu
     * @param {int} value Hodnota k ověření
     * @param {int} min Minimální hranice
     * @param {int} max Maximální hranice
     * @returns {boolean|boolean}
     */
    static validateRange(value, min, max) {
        return value >= min && value <= max;
    }

    /**
     * Uspořádá data do podoby pro Clevis Manager
     * @returns {{}}
     */
    serializeArrayEntity() {
        let result = {};
        let elements = $.makeArray($(this.form).prop('elements'));

        if(typeof grapesjs !== 'undefined'){
            grapesjs.editors.forEach((editor) => {
                if($(editor.getEl()).parent().hasClass('block-editor')){
                    let name = $(editor.getEl()).parent().parent().attr('blockeditordata');
                    if(typeof name !== 'undefined' && name){
                        //$("[name='"+name+"']").val(JSON.stringify(editor.storeData()));
                        $("[name='"+name+"']").val(JSON.stringify({
                            html: Plugins.getModifiedGrapesHTML(editor.storeData().html),
                            css: editor.storeData().css,
                        }));
                    }
                }
            });
        }

        elements.filter((item) => {
            return item.name && !$(item).is(':disabled') && item.nodeName.match(/^(?:input|select|textarea|keygen)/i)
        }).forEach((v) => {
            let val = null;
            if (v.type === 'checkbox')
                val = v.checked;
            else if (v.type === 'radio') {
                if (v.checked)
                    val = v.value;
            } else if (v.type == 'select-multiple') {
                val = $(v).select2('val');
            }else if(v.type == 'select-one'){
                if (v.value === 'null') {
                    val = null;
                    result[v.name] = null
                } else {
                    val = String(v.value);
                    if(v.hasAttribute('data-storefield') && v.getAttribute('data-storefield') && v.getAttribute('data-storefield') !== '' && v.getAttribute('data-storefield') !== 'ID' && typeof  v.options[v.options.selectedIndex] !== 'undefined')
                        result[v.name + '_storefield'] = v.options[v.options.selectedIndex].text;
                }
            } else if(v.type == 'textarea') {
                if (v.getAttribute('data-mce') !== null)
                    val = tinymce.get(v.id).getContent();
                else
                    val = String(v.value);
            } else {
                if (v.value === 'null') {
                    val = null;
                    result[v.name] = null
                } else
                    val = String(v.value);
            }
            if (val !== null) {
                if (val === "on")
                    val = true;
                else if (val === "off")
                    val = false;
                if (v.getAttribute('data-datepicker') != null) {
                    let date = moment(v.value, ['L', 'YYYY-MM-DD'], true)
                    if (date.isValid()) {
                        val = date.format('YYYY-MM-DD');
                    } else
                        val = '';
                } else if (v.getAttribute('data-datetimepicker') != null) {
                    let date = moment(v.value, ['L LTS', 'YYYY-MM-DD HH:mm:ss'], true)
                    if (date.isValid()) {
                        val = date.format('YYYY-MM-DD HH:mm:ss');
                    } else
                        val = '';
                }
                if (v.name.includes('[')) {
                    let dataattr = v.name.replace(/ *\[[^)]*\] */g, "");
                    if (result[dataattr] === undefined)
                        result[dataattr] = {};
                    result[dataattr][v.name.match(/\[(.*)\]/)[1]] = val;
                } else {
                    result[v.name] = val;
                    if (v.type === 'number') {
                        result[v.name] = result[v.name].replace(',','.');
                    }
                    if (v.getAttribute('data-currency') !== null)
                        result[v.name] = (result[v.name]!=='')?parseFloat(result[v.name])*100:''
                    if (v.getAttribute('data-range') !== null) {
                        if (v.getAttribute('data-range') === 'from')
                            result[v.getAttribute('data-range-target')] = result[v.name] + ':';
                        else {
                            result[v.getAttribute('data-range-target')] += result[v.name];
                            if (result[v.getAttribute('data-range-target')] === ":") {
                                result[v.getAttribute('data-range-target')] = null;
                            }
                        }
                    }
                }
            }
        });
        return result;
    }

    /**
     * Provede validaci formuláře
     * @returns {boolean}
     */
    validate(input = null) {
        this.invalidFields = [];
        let noError = true;
        if (input === null) {
            input = $(this.form).find(':input');
            $(this.form).find('.form-input-group').removeClass('has-error');
        } else {
            input.closest('.form-input-group').removeClass('has-error');
        }
        input.each((i, e) => {
            e = $(e);
            let errorMessage = '';
            let validation_data = e.data('validator');
            if (validation_data === undefined)
                return;
            e.find('.error-message span').text('');
            let value = e.val();
            validation_data.forEach((v) => {
                if(typeof v.enabled !== 'undefined' && v.enabled === false)
                    return;

                switch (v.v) {
                    case Form.VALIDATOR_REQUIRED:
                        if (!Form.validateRequired(value, e))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_EMAIL:
                        if (!Form.validateEmail(value))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_LENGTH:
                        if (!Form.validateLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_MAX_LENGTH:
                        if (!Form.validateMaxLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_MIN_LENGTH:
                        if (!Form.validateMinLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_NUMBER:
                        if (!Form.validateNumber(value))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_PATTERN:
                        let re = new RegExp(v.p);
                        if (!Form.validateRegex(value, re))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_SAME_VALUE:
                        if (!Form.validateSameValue(value, this.getValue(v.p)))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_CUSTOM:
                        if (!Form.validateByCustom(value, e.attr('name'), v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_RANGE:
                        if (!Form.validateRange(value, v.p[0], v.p[1]))
                            errorMessage += v.m;
                }
            });
            if (errorMessage !== '') {
                noError = false;
                e.closest('.form-input-group').addClass('has-error');
                if (e.closest('.form-input-group').find('.error-message').length === 0)
                    e.closest('.form-input-group').append($('<div class="error-message"><span></span></div>'));
                e.closest('.form-input-group').find('.error-message').children().text(errorMessage);
                console.log(errorMessage);
                this.invalidFields.push(e);
            }
        });
        if (!noError){
            if (input.length > 1)
                alerts.alert(translations.VALIDATION_ERR, 'error', translations.VALIDATION_ERR_TEXT)
        }
        return noError;
    }

    /**
     * Resetuje formulář
     */
    reset() {
        let elements = $.makeArray($(this.form).prop('elements'));
        elements.filter((item) => {
            return item.name && !$(item).is(':disabled') && item.nodeName.match(/^(?:input|select|textarea|keygen)/i)
        }).forEach((v) => {
            this.setValue(v.name, '');
        });
    }

    /**
     * Vrací požadovaný selector inputu
     * @param {string} input_name Název inputu
     * @returns {jQuery|[]}
     */
    getInput(input_name) {
        let input = $(this.form).find('[id^="'+this.form.getAttribute('id')+'"][name="' + input_name + '"]');
        if (input.length === 0)
            input = $(this.form).find('[id^="'+this.form.getAttribute('id')+'"][name$="[' + input_name + ']"]');
        if (input.length === 0)
            input = $(this.form).find('[type="radio"][name="' + input_name + '"]');

        switch (input.attr('type')) {
            case 'radio':
                input = input.filter(':checked')
                break;
        }


        return input;
    }

    /**
     * Vrací hodnotu z požadovaného inputu
     * @param {string} input_name
     * @returns {*}
     */
    getValue(input_name) {
        let input = this.getInput(input_name);
        if (input[0] === undefined)
            return null;




        switch (input[0].type) {
            case 'checkbox':
                return input.prop('checked');
            case 'radio':
                return $('input[name="'+input_name+'"]:checked', '#'+this.form.getAttribute('id')).val();
            case 'text':
                if (input[0].getAttribute('data-datepicker') != null) {
                    let date = moment(input.val(), ['L', 'YYYY-MM-DD'], true)
                    if (date.isValid()) {
                        return date.format('YYYY-MM-DD');
                    } else
                        return;
                } else if (input[0].getAttribute('data-datetimepicker') != null) {
                    let date = moment(input.val(), ['L LTS', 'YYYY-MM-DD HH:mm:ss'], true)
                    if (date.isValid()) {
                        return date.format('YYYY-MM-DD HH:mm:ss');
                    } else
                        return '';
                } else
                    return input.val();
            default:
                if(input.data('mce') === true){
                    let val = tinymce.get(input[0].id).getContent();

                   return val;
                }
                return input.val();
        }
    }

    /**
     * Vrací objekt nebo pole objektů vybraných dat v select boxu {id, text}
     * @param {string} input_name Název inputu
     * @returns {[{}]|null}
     */
    getSelectValue(input_name) {
        let result = [];
        let input = this.getInput(input_name)
        if (input[0].type === 'select-one' || input[0].type === 'select-multiple') {
            let data = input.select2('data');
            if (data.length == 0)
                return null;
            data.forEach((v,k) => {
                result.push({id: v.id, text: v.text});
            });
            return result;
        } else
            return null;
    }

    /**
     * Nastavuje hodnotu v inputu
     * @param {string} input_name Název inputu
     * @param {string} value Nová hodnota
     */
    setValue(input_name, value) {
        let input = this.getInput(input_name);
        if (input[0] === undefined)
            return;
        switch (input[0].type) {
            case 'checkbox':
                input.prop('checked', value);
                break;
            case 'radio':
                if (value === '' || value === false) {
                    if ($('input[name="'+input_name+'"][value=""]').length === 1)
                        $('input[name="'+input_name+'"][value=""]', '#'+this.form.getAttribute('id')).prop('checked', 'checked');
                    else
                        $('input[name="' + input_name + '"]', '#' + this.form.getAttribute('id')).prop('checked', false);
                }
                else
                    $('input[name="'+input_name+'"][value="'+value+'"]', '#'+this.form.getAttribute('id')).prop('checked', 'checked');
                break;
            case 'text':
                if (input.hasClass('datepicker')) {
                    if (moment(value, ["L", "YYYY-MM-DD"]).isValid())
                        input.val(moment(value).format('L'));
                    else
                        input.val('');
                } else if (input.hasClass('datetimepicker')) {
                    if (moment(value, ["L LTS", "YYYY-MM-DD HH:mm:ss"]).isValid())
                        input.val(moment(value).format('L LTS'));
                    else
                        input.val('');
                } else
                    input.val(value);
                break;
            case 'select-one': case 'select-multiple':
                input.val(value);
                input.trigger('change');
                break;
            case 'textarea':
                if (input.data('mce'))
                    tinymce.get(input.attr('id')).setContent(value);
                else
                    input.val(value);
                break;
            default:
                input.val(value);
        }

    }

    /**
     * Nastavuje atribut readonly pro input
     * @param {string} input_name Název inputu
     * @param {boolean} disabled Určení, zda je pouze pro čtení
     */
    setDisabled(input_name, disabled = true) {
        let input = this.getInput(input_name);
        if (disabled) {
            input.attr('readonly', 'readonly');
            input.closest('.form-input-group').addClass('readonly');
        } else {
            input.removeAttr('readonly');
            input.closest('.form-input-group').removeClass('readonly');
        }
    }

    getUrlParameters(input_name) {
        let input = this.getInput(input_name);
        return {
            params: input.attr('storeparams'),
            input: input,
            add: ()=>{
                params
            }
        }
    }

    openQuickEditor(url, element, dynamicSelect){
        let dialog = new Dialog();

        let data = {
            'parent_column': dynamicSelect.parentColumn,
            'parent_entity_id': dynamicSelect.parentEntityID,
            'parent_rows': dynamicSelect.parentRows,
            'parent_row': dynamicSelect.parentRows && Object.keys(dynamicSelect.parentRows).length ? dynamicSelect.parentRows[0] : null, //kvůli bc breaku
            ...dynamicSelect.customParams,
        };

        dialog.showFromUrl(url, data, true);
        dialog.onAfterClose = () => {
            element.refresh();
        };
    }

    initInputs(){
        let inputs = $(this.form).find(':input');

        inputs.each((i, e) => {
            e = $(e);

            if(typeof this.inputs[e.attr('name')] === 'undefined'){
                switch (e.prop("tagName")){
                    case "SELECT":
                        if(typeof e.data('store') !== 'undefined')
                            this.inputs[e.attr('name')] = new SelectAjax(e[0], this);
                        else
                            this.inputs[e.attr('name')] = new Select(e[0], this);
                        break;
                    default:
                        switch(e.attr('type')){
                            case "radio":
                                this.inputs[e.attr('name')] = new Radio(e[0], this);
                                break;
                            case "checkbox":
                                this.inputs[e.attr('name')] = new Checkbox(e[0], this);
                                break;
                            case "text":
                                if(typeof e.data('datepicker') !== 'undefined'){
                                    this.inputs[e.attr('name')] = new DateBox(e[0], this);
                                    break;
                                }
                                if(typeof e.data('datetimepicker') !== 'undefined'){
                                    this.inputs[e.attr('name')] = new DateTimeBox(e[0], this);
                                    break;
                                }
                                this.inputs[e.attr('name')] = new Input(e[0], this);
                                break;
                            default:
                                this.inputs[e.attr('name')] = new Input(e[0], this);
                        }
                }
            }

        });

        $(this.form).find('.block-editor').each((i, e) => {
            e = $(e);

            this.inputs[e.parent().attr('name')] = new BlockEditor(e[0], this);
        });
    }

    getInputObject(input_name){
        return this.inputs[input_name];
    }

    getInputObjectsByType(type){
        let result = {};

        for (const [name, input] of Object.entries(this.inputs)) {
            if(input instanceof type)
                result[name] = input;
        }

        return result;
    }
}
