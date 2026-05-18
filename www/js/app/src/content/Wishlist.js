class Wishlist {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            $('.add-to-wishlist').click((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                this.updateWishList(productID);
            });

            $('.remove-from-wishlist').click((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                this.deleteWishlistItem(productID);
                $this.parent('.item').parent('.col-lg-3').hide();
            });
        });
    }



    updateWishList(productID, callback = null) {
        $.ajax({
            type: "POST",
            url: "/default/wishlist/update-wish-list",
            data: {
                ProductID: productID
            },
            success: (data) => {
                let wishlistData = JSON.parse(data);
                // CartHeader.updateCartHeader(wishlistData.TotalPriceWithVat, wishlistData.TotalCount, wishlistData.cartItems);

                if ( wishlistData.successMsg )
                    alerts.alert('Hotovo', 'success', wishlistData.successMsg);

                if ( wishlistData.failMsg )
                    alerts.alert('Chyba', 'error', wishlistData.failMsg);

                /*if ( !assign )
                    CartPrompt.addedToCart();*/

                if ( callback )
                    callback(wishlistData);
            },
        });
    }

    deleteWishlistItem(productID, callback = null) {
        $.ajax({
            type: "POST",
            url: "/default/wishlist/delete-wish-list-item",
            data: {
                ProductID: productID,
            }
        //     success: (data) => {
        //         let cartData = JSON.parse(data);
        //         CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);
        //
        //         if ( callback )
        //             callback(cartData);
        //     },
        });
    }
}