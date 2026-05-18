class orderController {

    step1Action() {
        window.orderAddress = new OrderAddress();
    }

    step2Action() {
        window.cartRecapitulation = new CartRecapitulation();
        window.shippingPayment = new ShippingPayment();
        window.completeOrder = new CompleteOrder();
    }

    step3Action() {
        if(Layout.checkCookieName(Layout.UTM_COOKIE)) {
            Layout.deleteCookie(Layout.UTM_COOKIE);
        }
        if(Layout.checkCookieName(Layout.REFERER_COOKIE)) {
            Layout.deleteCookie(Layout.REFERER_COOKIE);
        }
    }
}