class AddressEditLayout {

    constructor() {
        $(() => {
            this.addressForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
         this.clickEvent();

    }

    clickEvent() {
        const me = this;
        $(".edit-address").click(function (event) {
            const addressId = $(this).data('id');
            const type = $(this).data('type');
            me.loadPage(addressId, type);
        })

        $(".remove-address").click(async function (event) {
            event.preventDefault();
            if (this.dialog) { this.dialog.close(); }
            const addressId = $(this).data('id');

            this.dialog = new Dialog();
            this.dialog._title = 'Opravdu chcete odstranit adresu?';
            this.dialog._modalClass = 'delete-address-confirmation';
            await this.dialog.openFromUrl(projectVars.basePath + '/modal/delete-address-confirmation', {addressId} );
        })

        $(".create-address-item").click(function (event) {
            const type = $(this).data('type');
            me.loadPage(null, type);
        })

    }


    loadPage(addressId, type) {
        const me = this;
        let url;
        url = this.buildProperUrlForPageLoading();
        $.ajax({
            url,
            data: {
                addressId,
                type
            },
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedPageIntoPage(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function () {
                 $('#confirm-address').click(() => {
                     me.addressForm = new Form('main-form');
                     $('<div class="progress-loader-wrap"><div class="progress-loader"></div></div>').insertBefore('#confirm-address');
                     me.addressForm.validate();

                    if ( me.addressForm.valid ) {
                        let data = {};
                        if(type === 'type-delivery') {
                           data = {
                                AddressId: addressId,
                                Label: $('#Label').val(),
                                MainAddress: $('#MainAddress').is(':checked') ? 1 : 0,
                                DFirstName: $('#DFirstName').val(),
                                DLastName: $('#DLastName').val(),
                                DStreet: $('#DStreet').val(),
                                DZipCode: $('#DZipCode').val(),
                                DCity: $('#DCity').val(),
                                DCountry: $('#DCountry').val(),

                               IsDelivery: true
                            }
                        } else {
                            data = {
                                AddressId: addressId,
                                Label: $('#Label').val(),
                                MainAddress: $('#MainAddress').is(':checked') ? 1 : 0,
                                FirstName: $('#FirstName').val(),
                                LastName: $('#LastName').val(),
                                Street: $('#Street').val(),
                                ZipCode: $('#ZipCode').val(),
                                City: $('#City').val(),
                                Country: $('#Country').val(),
                                Phone: $('#Phone').val(),
                                CompanyName: $('#CompanyName').val()??'',
                                IC: $('#IC').val()??'',
                                DIC: $('#DIC').val()??'',
                            }
                        }
                        $.ajax({
                            url: "/default/customer/address-edit-process",
                            type: 'POST',
                            dataType: "html",
                            data,
                            success: function (data) {
                                new MyAccount('address-list');
                                setTimeout(()=> {
                                    $('#address-edit-load').show();
                                    $('#address-edit-load').css('opacity', '1');
                                    $('#address-edit-load').css('width', '100%');
                                    $('#address-edit-load').css('height', 'auto');
                                    $('#address-edit-load').html(data);
                                }, 500)

                            },
                        })

                    }
                });

                $('.company-toggler').click(() => {
                    let companyBox = $('.company-box');
                    $('#IsCompany').prop('checked') ? companyBox.slideDown(300) : companyBox.slideUp(300);
                });

                $('.delivery-toggler').click(() => {
                    let deliveryBox = $('.delivery-box');
                    $('#IsDelivery').prop('checked') ? deliveryBox.slideDown(300) : deliveryBox.slideUp(300);
                });

                $('#close-edit-address').click(()=>{
                    $('#address-edit-load').hide();
                });
            }
        });
    }

    buildProperUrlForPageLoading() {
        return `/customer/address-edit`
    }

    insertLoadedPageIntoPage(data) {
        $('#address-edit-load').addClass('open');
        $('#address-edit-load').hide();
        $('#address-edit-load').html(data);
        $('#address-edit-load').show(500);
        $('html, body').animate({ scrollTop: 0 }, 500);
    }


}