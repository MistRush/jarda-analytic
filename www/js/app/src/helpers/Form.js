class Form {
    static VALIDATOR_REQUIRED = ':required';
    static VALIDATOR_IN= ':in-validator';
    static VALIDATOR_MIN_LENGTH = ':min_length';
    static VALIDATOR_MAX_LENGTH = ':max_length';
    static VALIDATOR_LENGTH = ':length';
    static VALIDATOR_EMAIL = ':email';
    static VALIDATOR_PATTERN = ':pattern';
    static VALIDATOR_NUMBER = ':number';
    static VALIDATOR_RANGE = ':range';

    constructor(form_id) {
        this.$form = $('#' + form_id);
        this.valid = true;
    }

    checkVisibility(d) {
        if (d === undefined)
            return true;
        else
            return !$(d).is(':hidden');
    }

    validate() {
        this.valid = true;
        this.$form.find(':input').each((i, e) => {
            e = $(e);
            let validation_data = e.data('validator');
            if (validation_data === undefined)
                return;
            else if (typeof validation_data === 'string')
                validation_data = JSON.parse(validation_data);
            let value = e.val();
            let errorMessage = '';
            let errorDiv = $("#" + e.attr('name') + "Error");
            errorDiv.html('');
            e.removeClass('input-error');

            validation_data.forEach((v) => {
                switch (v.v) {
                    case Form.VALIDATOR_REQUIRED:
                        if (this.checkVisibility(v.d) && !Form.validateRequired(value))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_IN:
                        if (this.checkVisibility(v.d) && !Form.validateRegex(value, '^[0-9]{1,8}$'))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_EMAIL:
                        if (this.checkVisibility(v.d) && !Form.validateEmail(value))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_LENGTH:
                        if (this.checkVisibility(v.d) && !Form.validateLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_MAX_LENGTH:
                        if (this.checkVisibility(v.d) && !Form.validateMaxLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_MIN_LENGTH:
                        if (this.checkVisibility(v.d) && !Form.validateMinLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_NUMBER:
                        if (this.checkVisibility(v.d) && !Form.validateNumber(value))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_PATTERN:
                        let re = new RegExp(v.p);
                        if (this.checkVisibility(v.d) && !Form.validateRegex(value, re))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_RANGE:
                        if (this.checkVisibility(v.d) && !Form.validateRange())
                            errorMessage += v.m;
                        break;
                    default:
                        let validateFunction = v.v.split('.');
                        if (typeof window[validateFunction[0]][validateFunction[1]] === 'function') {
                            if (!window[validateFunction[0]][validateFunction[1]](value))
                                errorMessage += v.m;
                        }
                        break;
                }
            });

            if (errorMessage !== '') {
                if (errorDiv.length === 0)
                    e.after($(`<div class="error" id="${e.attr('name')}Error"></div>`));
                $("#" + e.attr('name') + "Error").html(errorMessage);
                e.addClass('input-error');
                this.valid = false;
            }
        });

        return this.valid;
    }

    static validateRegex(value, pattern) {
        let r = new RegExp(pattern);
        return value.match(r) != null
    }

    static validateMinLength(value, minlength) {
        return value.length >= minlength;
    }

    static validateMaxLength(value, maxlength) {
        return value.length <= maxlength;
    }

    static validateLength(value, length) {
        return toString(value).length === length;
    }

    static validateEmail(value) {
        return this.validateRegex(value.toLowerCase(), /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    }

    static validateRequired(value) {
        return value != '';
    }

    static validateNumber(value) {
        return value.isInteger(value);
    }

    static validateRange(value, min, max) {
        return min >= value && value <= max;
    }
}