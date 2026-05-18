class OrderAddress {
    constructor() {
        $(() => {
            this.customerForm = new Form('main-form');
            $('#step-2').removeAttr('href');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('#step-2').click(() => {
            this.customerForm.validate();

            if ( this.customerForm.valid ) {
                $('#main-form').submit();
            }
        });

        $('.continue-shopping').click(() => {
            $('#main-form').submit();
        });

        $('#DFirstName, #DLastName, #DStreet, #DCity, #DZipCode').on('input', () => {
            this.deliveryAddressToggle();
        });


        $('#invoiceAddressesSelect').change(() => {
            let addressID = $('#invoiceAddressesSelect').val();
            this.reloadAddress(addressID, 'invoice');
        });

        $('#deliveryAddressesSelect').change(() => {
            let addressID = $('#deliveryAddressesSelect').val();
            this.reloadAddress(addressID, 'delivery');
            this.deliveryAddressToggle();
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

        $('.user.with-toggler').click(function() {
            $('.register-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsRegister"]').val($(this).hasClass());
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

    deliveryAddressToggle() {
        if($('#DFirstName').val() === '' &&
            $('#DLastName').val() === '' &&
            $('#DStreet').val() === '' &&
            $('#DCity').val() === '' &&
            $('#DZipCode').val() === '') {
            $('input[name="IsDeliveryAddress"]').val(0);
            $('.delivery-address-block').hide();
        }

    }

    reloadAddress(addressID, type) {
        $.ajax({
            type: "POST",
            url: "/default/order/get-address",
            data: { AddressID: addressID },
            success: function(data) {
                let address = JSON.parse(data);

                if(type === 'invoice') {
                    $('#FirstName').val(address.FirstName);
                    $('#LastName').val(address.LastName);
                    $('#Street').val(address.Street);
                    $('#City').val(address.City);
                    $('#ZipCode').val(address.ZipCode);
                    $('#Phone').val(address.Phone);
                    $('#CompanyName').val(address.CompanyName);
                    $('#ICO').val(address.IC);
                    $('#DIC').val(address.DIC);
                }

                if(type === 'delivery') {
                    $('#DFirstName').val(address.FirstName);
                    $('#DLastName').val(address.LastName);
                    $('#DStreet').val(address.Street);
                    $('#DCity').val(address.City);
                    $('#DZipCode').val(address.ZipCode);
                }
            }
        });
    }
}