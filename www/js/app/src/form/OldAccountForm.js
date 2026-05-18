class OldAccountForm {
    constructor() {
        $(() => {
            this.registrationForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('input[name="Hash"]').val(window.location.search.replace('?hash=', ''));

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

            if ( this.registrationForm.valid && $('#gdpr').prop('checked')) {

                $('#main-form').submit();
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