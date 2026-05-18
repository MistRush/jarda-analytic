class CompleteOrder {
    constructor() {
        $(() => {
            this.customerForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('.complete-order').click(() => {
            this.customerForm.validate();

            if ( !$('#terms').prop('checked') ) {
                $('.terms label').css('color', '#ea545f');
            } else {
                $('.terms label').css('color', '#212529');
            }

            console.log(this.customerForm.valid);

            if ( this.customerForm.valid ) {
                if ( $('#terms').prop('checked') ) {
                    $('.complete-order').attr('disabled', true);
                    $('<div class="progress-loader-wrap" style="float: left;top: -20px; left:38px"><div class="progress-loader"></div></div>').insertBefore('.complete-order');
                    $('.terms-label label').css('color', '#11142D');
                    const utmParams = Layout.checkCookieName(Layout.UTM_COOKIE);
                    const referer = Layout.checkCookieName(Layout.REFERER_COOKIE);
                    if(utmParams) {
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'UtmParams',
                            name: 'UtmParams',
                            value: utmParams
                        }).appendTo('#main-form');
                    }
                    if(referer) {
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'Referer',
                            name: 'Referer',
                            value: referer
                        }).appendTo('#main-form');
                    }
                    $('#main-form').submit();
                }
            }
        });

        $('.company-toggler').click(function() {
            let companyBox = $('.company-box');
            $('#IsCompany').prop('checked') ? companyBox.slideDown(300) : companyBox.slideUp(300);
        });

        $('.delivery-toggler').click(function() {
            let deliveryBox = $('.delivery-box');
            $('#IsDelivery').prop('checked') ? deliveryBox.slideDown(300) : deliveryBox.slideUp(300);
        });

        $('.user-toggler').click(function() {
            let userBox = $('.user-box');
            $('#IsUser').prop('checked') ? userBox.slideDown(300) : userBox.slideUp(300);
            $('.user-box .pw').attr({ id:"Password", type:"password", name:"Password"});
            $('.user-box .pw-again').attr({id:"PasswordAgain", type:"password", name:"PasswordAgain"});
        });
    }

    validateEmail(value) {
        let result = true;

        if ($("#IsUser").length == 0)
            return result;

        if (!$("#IsUser").prop('checked'))
            return result;

        $.ajax({
            type: "POST",
            url: "/default/customer/check-email/",
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