class CartRecapitulation {
    shippingPriceWithoutVat = 0;
    shippingPriceWithVat = 0;
    paymentPriceWithoutVat = 0;
    paymentPriceWithVat = 0;

    updateTotalPrice () {
        let totalPriceWithoutVat = this.shippingPriceWithoutVat - (-this.paymentPriceWithoutVat) - (-$('.order-recapitulation .total-price-with-vat').data('total-produts-price-without-vat'));
        let totalPriceWithVat = this.shippingPriceWithVat - (-this.paymentPriceWithVat) - (-$('.order-recapitulation .total-price-with-vat').data('total-produts-price-with-vat'));

        $('.total .total-price-without-vat').html(numberHelpers.formatPrice(totalPriceWithoutVat));
        $('.total .total-vat').html(numberHelpers.formatPrice(totalPriceWithVat - totalPriceWithoutVat));
        $('.total .total-price-with-vat').html(numberHelpers.formatPrice(totalPriceWithVat));
    }
}