class ShippingPayment {
    static zasilkovnaCZShippingID = 13;
    static zasilkovnaSKShippingID = 12;
    static balikovnaShippingID = 1;
    static balikNaPostuShippingID = 3;
    static pplShippingID = 8;
    static applePayID = 5;

    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            new Zasilkovna('2237ad43f1459473');
            new Balikovna('BALIKOVNY');
            new Balikovna('POST_OFFICE');
            new PPL();
            if(window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
               $(`div[data-payment-id=${ ShippingPayment.applePayID }]`).show();
            } else {
                $(`div[data-payment-id=${ ShippingPayment.applePayID }]`).remove();
            }

            // $('.continue-shopping').click(() => {
            //     $('#main-form').submit();
            // });

            $('.shippings .item').click((e) => {
                let $this = $(e.target).closest('.shippings .item');

                if ($this.hasClass('active'))
                    return;

                $('.shippings .item').removeClass('active');
                $this.addClass('active');
                $('#recap-shipping-name').html($this.data('shipping-name'));

                let shippingPriceWithVat = $this.data('shipping-price-with-vat') > 0 ? numberHelpers.formatPrice($this.data('shipping-price-with-vat')) : 'Zdarma';
                $('#recap-shipping-price').html(shippingPriceWithVat);
                $('#Shipping_ID').val($this.data('shipping-id'));

                const shippingImage = $this.find('.image img').attr('src');
                if (shippingImage) {
                    $('#recap-shipping-image').attr('src', shippingImage);
                }

                cartRecapitulation.shippingPriceWithoutVat = $this.data('shipping-price-without-vat');
                cartRecapitulation.shippingPriceWithVat = $this.data('shipping-price-with-vat');
                cartRecapitulation.updateTotalPrice();


                this.loadPayments($this.data('shipping-id'));
                ShippingPayment.handlePickUpCarriers();
            });

            $('.payments .item').click((e) => {
                let $this = $(e.target).closest('.payments .item');

                if ($this.hasClass('inactive'))
                    return;

                $('.payments .item').removeClass('active');
                $this.addClass('active');
                $('#recap-payment-name').html($this.data('payment-name'));

                let paymentPriceWithVat = $this.data('payment-price-with-vat') > 0 ? numberHelpers.formatPrice($this.data('payment-price-with-vat')) : 'Zdarma';
                $('#recap-payment-price').html(paymentPriceWithVat);
                $('#Payment_ID').val($this.data('payment-id'));

                const paymentImage = $this.find('.image img').attr('src');
                if (paymentImage) {
                    $('#recap-payment-image').attr('src', paymentImage);
                }

                cartRecapitulation.paymentPriceWithVat = $this.data('payment-price-with-vat');
                cartRecapitulation.paymentPriceWithoutVat = $this.data('payment-price-without-vat');
                cartRecapitulation.updateTotalPrice();
            });

            let selectedShippingID = $('#Shipping_ID').val();
            if ( selectedShippingID ) {
                $('.shippings .item[data-shipping-id=' + selectedShippingID + ']').click();
            } else {
                $('.shippings .item:first-of-type').click();
            }
        });
    }

    loadPayments(shippingID) {
        $.ajax({
            type: "POST",
            url: "/default/order/shipping-payments",
            data: {
                ShippingID: shippingID
            },
            success: function (data) {
                $('.no-payment').hide();

                let payments = JSON.parse(data);
                let hasPayment = false;
                let paymentsItem = $('.payments .item');
                let selectedPaymentID = $('#Payment_ID').val();

                paymentsItem.removeClass('active');
                paymentsItem.addClass('inactive');

                $.each(payments, function (k, v) {
                    let payment = $('.payments .item[data-payment-id="' + v.Payment_ID + '"]');
                    payment.removeClass('inactive');

                    if ( selectedPaymentID ) {
                        if ( v.Payment_ID == selectedPaymentID )
                            payment.click();

                        hasPayment = true;
                    } else {
                        if (!hasPayment)
                            payment.click();

                        hasPayment = true;
                    }
                });

                if (!hasPayment) {
                    $('#recap-payment-name').html('');
                    $('#recap-payment-price').html('');
                    $('#Payment_ID').val('');

                    $('.no-payment').show();
                }
            },
        });
    }

    static handlePickUpCarriers() {
        if (this.isZasilkovnaCzChosen()) {
            this.processZasilkovna();
            return;
        }

        if (this.isZasilkovnaSkChosen()) {
            this.processZasilkovna();
            return;
        }

        if (this.isPPLChosen()) {
            this.processPPL();
            return;
        }

        if (this.isBalikovnaChosen()) {
            this.processBalikovna();
            return;
        }

        if (this.isBalikNaPostuChosen()) {
            this.processBalikNaPostu();
            return;
        }

        this.enableCompleteShoppingButton();

    }

    static handleZasilkovna() {
        if (this.isZasilkovnaCzChosen() || this.isZasilkovnaSkChosen()) {
            this.processZasilkovna();
        }
    }

    static handleBalikovna() {
        if (this.isBalikovnaChosen()) {
            this.processBalikovna();
        }
    }

    static handleBalikNaPostu() {
        if (this.isBalikNaPostuChosen()) {
            this.processBalikNaPostu();
        }
    }

    static handlePPL() {
        if (this.isPPLChosen()) {
            this.processPPL();
        }

    }

    static isZasilkovnaCzChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.zasilkovnaCZShippingID;
    }

    static isZasilkovnaSkChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.zasilkovnaSKShippingID;
    }

    static isBalikovnaChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.balikovnaShippingID;
    }

    static isBalikNaPostuChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.balikNaPostuShippingID;
    }

    static isPPLChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.pplShippingID;
    }

    static isPickUpPointChosen(selector) {
        return $(selector).attr('data-point-chosen') === 'true';
    }

    static getDataAboutPickUpPoint(pickupPlaceSelector) {
        const ID = $(pickupPlaceSelector).attr('data-point-id');
        const Name = $(pickupPlaceSelector).attr('data-point-name');
        const Address = $(pickupPlaceSelector).attr('data-point-address');
        const Code = $(pickupPlaceSelector).attr('data-point-code');

        return {
            ID,
            Name,
            Address,
            Code
        };

    }

    static processZasilkovna() {
        if (this.isZasilkovnaCzChosen() && !this.isPickUpPointChosen('#m1-cz')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.')
        } else if(this.isZasilkovnaSkChosen() && !this.isPickUpPointChosen('#m1-sk')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky;')
        } else {
            this.enableCompleteShoppingButton();
            let pickupPointData;
            if(this.isZasilkovnaCzChosen())
                pickupPointData= this.getDataAboutPickUpPoint('#m1-cz');
            else
                pickupPointData= this.getDataAboutPickUpPoint('#m1-sk');
            this.clearHiddenInputs(pickupPointData);
            this.createHiddenInputs(pickupPointData);
        }
    }

    static processBalikovna() {
        if (this.isBalikovnaChosen() && !this.isPickUpPointChosen('#m1-balikovna')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.')
        } else {
            this.enableCompleteShoppingButton();
            const pickupPointData = this.getDataAboutPickUpPoint('#m1-balikovna');
            this.clearHiddenInputs(pickupPointData);
            this.createHiddenInputs(pickupPointData);
        }
    }

    static processBalikNaPostu() {
        if (this.isBalikNaPostuChosen() && !this.isPickUpPointChosen('#m1-balik-na-postu')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.')
        } else {
            this.enableCompleteShoppingButton();
            const pickupPointData = this.getDataAboutPickUpPoint('#m1-balik-na-postu');
            this.clearHiddenInputs(pickupPointData);
            this.createHiddenInputs(pickupPointData);
        }
    }

    static processPPL() {
        if (this.isPPLChosen() && !this.isPickUpPointChosen('.ppl-selected-pickup-point')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.')
        } else {
            this.enableCompleteShoppingButton();
            const pickupPointData = this.getDataAboutPickUpPoint('.ppl-selected-pickup-point');
            this.clearHiddenInputs(pickupPointData);
            this.createHiddenInputs(pickupPointData);
        }
    }

    static disableCompleteShoppingButton() {
        console.log("VOLAM SE");
        $('.complete-order').attr("disabled", "disabled");
        $('.complete-order').css("background", "gray");

        // $('.continue-shopping').attr("disabled", "disabled");
        // $('.continue-shopping').css("background", "gray");
    }

    static sendAlertMessage(selector, message) {
        console.log("VOLAM ALERT MESSAGE");
        if (!$('#info-message').length)
            $(selector).append(`<div id="info-message" style="color: red;" class="p-1">${message}</div>`);
    }

    static clearAlertMessage() {
        if ($('#info-message').length) {
            $('#info-message').remove();
        }
    }

    static enableCompleteShoppingButton() {
        $('.complete-order').removeAttr("disabled");
        $('.complete-order').removeAttr("style");

        // $('.continue-shopping').removeAttr("disabled");
        // $('.continue-shopping').removeAttr("style");

        this.clearAlertMessage();
    }

    static createHiddenInputs(data) {
        const mainForm = $('#main-form');
        for (const key in data) {
            mainForm.append(`<input type="hidden" id="PickupPoint_${key}" name="PickupPoint_${key}" value="${data[key]}">`);
        }
    }

    static clearHiddenInputs(data = null) {
        if (data) {
            for (const key in data) {
                $(`#PickupPoint_${key}`).remove()
            }
        }
    }
}