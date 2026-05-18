class Registration {
    constructor() {
        $(() => {
            this.registrationForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('<a id="loadDataFromAres" class="btn btn-primary" style="position:absolute; right:18px; padding:5px 10px; bottom:4px">Vyplnit fa údaje z ARES</a>').insertAfter($('#IC'));
        $('#loadDataFromAres').click((e) => {
            $.ajax({
                type: "POST",
                url: "/default/customer/check-ic",
                data: { IC: $('#IC').val() },
                success: function(data) {
                    if (data && data.status === 'success') {
                        const companyData = data.data;
                        $('#CompanyName').val(companyData.company);
                        $('#Street').val(companyData.street + ' ' + companyData.descriptiveNumber + (companyData.orientationNumber?('/' + companyData.orientationNumber) : ''));
                        $('#City').val(companyData.city);
                        $('#ZipCode').val(companyData.zip);
                        $('#DIC').val(companyData.tin);
                    } else {
                        alert('Zadané IČ není platné, nebo nebylo nalezeno v ARES.');
                    }
                }
            });
        })



        $('#confirm-registration').click((e) => {
            e.preventDefault();
            if ( !$('#terms').prop('checked') ) {
                $('.terms label').css('color', '#ea545f');
            } else {
                $('.terms label').css('color', '#212529');
            }

            if ( !$('#gdpr').prop('checked') ) {
                $('.gdpr label').css('color', '#ea545f');
            } else {
                $('.gdpr label').css('color', '#212529');
            }

            this.registrationForm.validate();

            if ( this.registrationForm.valid && $('#terms').prop('checked') && $('#gdpr').prop('checked')) {
                this.recapchaCallback();
            }
        });

        $('.company.with-toggler').click(function() {
            $('.company-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsCompany"]').val($(this).hasClass());
        });

        $('.delivery-address.with-toggler').click(function() {
            $('.delivery-address-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsDeliveryAddress"]').val($(this).hasClass());
        });
    }

    recapchaCallback(){
        grecaptcha.ready(function() {
            grecaptcha.execute('6Ld4ogArAAAAAN-5fVn8mxHa848vSIN4pqJ41BYy', {action: 'submit'}).then(function(token) {
                $('<input>').attr({
                    type: 'hidden',
                    id: 'recaptchaToken',
                    name: 'Token',
                    value: token
                }).appendTo('#main-form');
                $('#main-form').submit();
            });
        });
    }

    validateEmail(value) {
        let result = true;
        $.ajax({
            type: "POST",
            url: "/default/customer/check-email",
            data: { Email: value },
            async: false,
            success: function(data) {
                result = (data != 1);
            }
        });

        return result;
    }

    validatePassword() {
        let password = $('#Password').val();
        let passwordAgain = $('#PasswordAgain').val();
        let result = true;

        if ( password !== passwordAgain)
            result = false;

        return result;
    }
}