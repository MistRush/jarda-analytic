class Input {
    constructor(element, form = null){
        this.element = element;
        this.$element;
        this.name;
        this.form = form;
        this.validators = [];

        this.init();
    }

    init(){
        this.$element = $(this.element);
        this.name = this.$element.attr('name');
        this.validators = this.$element.data('validator') ?? [];
        this.element.input = this;
    }

    bindEvents(){

    }

    disableValidator(validatorType){
        this.setValidatorEnabled(validatorType, false);

        return this;
    }

    enableValidator(validatorType){
        this.setValidatorEnabled(validatorType, true);

        return this;
    }

    setValidatorEnabled(validatorType, enabled){
        this.validators.forEach((validator, index) => {
            validator.enabled = enabled;
        });

        this.$element.data('validator', this.validators);

        if(this.form)
            this.form.validate(this.$element);

        return this;
    }

    setRequired(required = true){
        if(this.hasValidator(Form.VALIDATOR_REQUIRED))
            this.setValidatorEnabled(Form.VALIDATOR_REQUIRED, required);
        else
            this.addRule(Form.VALIDATOR_REQUIRED, translations.FIELD_REQUIRED);

        if(required)
            this.$element.closest('[id*="_group"]').find('.required-char').removeClass('d-none');
        else
            this.$element.closest('[id*="_group"]').find('.required-char').addClass('d-none');

        return this;
    }

    hasValidator(validatorType){
        let hasValidator = false;
        this.validators.forEach((validator, index) => {
            if(validator.v === validatorType)
                hasValidator = true;
        });

        return hasValidator;
    }

    addRule(validator, message, params = null){
        this.validators.push({
           'v': validator,
           'm': message,
           'p': params,
        });

        this.$element.data('validator', this.validators);

        if(this.form)
            this.form.validate(this.$element);

        return this;
    }

    getValue(){
        return this.$element.val();
    }

    setValue(val){
        this.$element.val(val);
        return this;
    }

    setReadonly(readonly = true){
        if(readonly) {
            this.$element.attr('readonly', 'readonly');
            this.$element.closest('.form-input-group').addClass('readonly');
        }else {
            this.$element.removeAttr('readonly');
            this.$element.closest('.form-input-group').removeClass('readonly');
        }
    }
}