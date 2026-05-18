class Cart {
    constructor() {
        window.confirmDialog = null;

        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            $(document).on('click', '.cart-block button', async function(e) {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = $this.parent().parent().children().children('.quantity').val();
                try {
                    const stockCheck = await Cart.checkProductStockQuantity(productID, quantity);
                    if (stockCheck['QuantityDiff']) {
                        quantity = stockCheck['AllowedQuantity'];
                        await Cart.displayWarningInfoAboutStock(stockCheck)
                    }
                    if(quantity > 0)
                    {
                        Cart.updateCart(productID,  quantity);
                    }
                } catch (error) {
                    console.error(error);
                }

            });

            // pridani do kosiku z wish listu
            $('#wish-list .add-to-cart').click((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = 1;
                Cart.updateCart(productID, quantity);
                this.flyToCart();
            });

            // pridani do kosiku z detailu produktu
            $('.cart-info .add-to-cart').click(async (e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = $('.cart-info .quantity').val();
                let cartMsg = $('#cart-msg');

                try {
                    const stockCheck = await Cart.checkProductStockQuantity(productID, quantity);
                    if (stockCheck['QuantityDiff']) {
                        quantity = stockCheck['AllowedQuantity'];
                        await Cart.displayWarningInfoAboutStock(stockCheck)
                    }
                } catch (error) {
                    console.error(error);
                }


                if ($.isNumeric(quantity)) {
                    cartMsg.hide();
                    Cart.updateCart(productID, quantity, false, null);
                } else {
                    cartMsg.show();
                    cartMsg.html('Musíte zadat číselnou hodnotu.');
                }

                this.flyToCart();
            });
        });
    }

    static updateCart(productID, quantity, assign = false, callback = null) {
        $.ajax({
            type: "POST",
            url: "/default/cart/update-cart-product",
            data: {
                ProductID: productID,
                Quantity: quantity,
                Assign: assign,
            },
            success: (data) => {
                let cartData = JSON.parse(data);
                CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);

                if ( cartData.failMsg ) {
                    alerts.alert('Chyba', 'error', cartData.failMsg);
                    if(cartData.totalQuantity) {
                        const selector = `.item[data-product-id = ${cartData.productID}] .quantity`;
                        if($(selector).length > 0) {
                            $(selector).val($(selector).val() > cartData.totalQuantity? cartData.totalQuantity : $(selector).val());
                        }
                    }
                }

                if ( !assign ) {
                    window.confirmDialog = new Dialog();
                    window.confirmDialog.modalClass = 'add-to-cart';
                    window.confirmDialog.title = 'Produkt byl přidán do košíku';
                    window.confirmDialog.openFromUrl(projectVars.basePath + '/modal/add-to-cart', {
                        'Product_ID': productID,
                        'Quantity': quantity,
                    });
                } else {
                    if ( cartData.successMsg )
                        alerts.alert('Hotovo', 'success', cartData.successMsg);
                }

                /*if ( !assign )
                    CartPrompt.addedToCart();*/

                if ( callback )
                    callback(cartData);
            },
        });
    }

    deleteProduct(productID, callback = null) {
        $.ajax({
            type: "POST",
            url: "/default/cart/delete-cart-product",
            data: {
                ProductID: productID,
            },
            success: (data) => {
                let cartData = JSON.parse(data);
                CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);

                if ( callback )
                    callback(cartData);
            },
        });
    }

    flyToCart() {
        return;
            const cart = $('.header-cart-badge .cart-icon');
            const imgToDrag = $('.product-image .fancybox').find("img").eq(0);
            const imgWidth = imgToDrag.width();
            const imgHeight = imgToDrag.height();
            if (imgToDrag) {
                const imgClone = imgToDrag.clone()
                    .offset({
                        top: imgToDrag.offset().top,
                        left: imgToDrag.offset().left
                    })
                    .css({
                        'opacity': '0.5',
                        'position': 'absolute',
                        'height': imgHeight+'px',
                        'width': imgWidth+'px',
                        'z-index': '100'
                    })
                    .appendTo($('body'))
                    .animate({
                        'top': cart.offset().top + 10,
                        'left': cart.offset().left + 10,
                        'width': 75,
                        'height': 75
                    }, 1000, 'easeInOutExpo');

                // setTimeout(function () {
                //     cart.effect("shake", {
                //         times: 2
                //     }, 200);
                // }, 1500);

                imgClone.animate({
                    'width': 0,
                    'height': 0
                }, function () {
                    $(this).detach()
                });
            }
}

    static checkProductStockQuantity(productID, quantity) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/default/cart/check-product-stock-quantity",
                data: {
                    ProductID: productID,
                    Quantity: quantity,
                },
                success: (data) => {
                    let cartData = JSON.parse(data);
                    resolve(cartData);
                },
                error: (xhr, status, error) => {
                    reject(error);
                }
            });
        });
        
    }

    static async displayWarningInfoAboutStock(stockCheck) {
        if (this.dialog) { this.dialog.close(); }

        this.dialog = new Dialog();
        this.dialog._title = 'Požadované množství není skladem';
        this.dialog._modalClass = 'cart-out-stock-info';
        await this.dialog.openFromUrl(projectVars.basePath + '/modal/cart-out-stock-info', {stockCheck} );
    }
}