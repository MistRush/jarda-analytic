class CartHeader {
    static updateCartHeader(price, count, items) {
        $('#header .cart-block .price').text(price);
        $('#header .cart-block .count').text(count);
        $('#header .cart-block .items-block').html(this.formatItems(items));
        $('#header .cart-block .summary .total span').text(price);
        $('#header .cart-block').toggleClass('empty', (!items || items.length === 0));
        CartHeader.quantityChangeListener();

        $("#header .quantity-change").click(function (e) {
            var quantity = $(e.currentTarget).siblings('.quantity').val();

            if ( $(e.currentTarget).hasClass('down') && quantity != 1 )
                $(e.currentTarget).siblings('.quantity').val(quantity - 1);

            if ( $(e.currentTarget).hasClass('up') ) {
                $(e.currentTarget).siblings('.quantity').val(quantity - (-1));
            }
            $(e.currentTarget).siblings('.quantity').trigger('change');
        });
    }

    static deleteCartItem(element) {
        let productID = $(element).parents('.item').data('id');
        cart.deleteProduct(productID);
    }

    static formatItems(items) {
        let out = "";

        items.forEach((item) => {
            out += this.formatItem(item);
        });

        return out;
    }

    static quantityChangeListener() {
        $('#header .quantity').change((e) => {
            let $this = $(e.target);
            let productID = $this.data('product-id');
            let quantity = $this.val();

            Cart.updateCart(productID, quantity, true);
        });

    }

    static formatItem(item) {
        let out = `
              <div class="item" data-id="${item.Product_ID}">
                    <div class="photo-block">
                        <img src="${item.ProductImageUrl}">
                    </div>
                    <div class="info-block">
                        <a href="${projectVars.basePath}/${projectVars.url.product}/${item.slug}">${item.ProductName}</a>
                        <div class="code">Kód zboží: <span>${item.ProductCode}</span></div>
                        <div class="${item.TotalQuantityOnStock > 0 ? 'on-stock' : 'out-stock'} availability">
                        ${item.TotalQuantityOnStock > 0 ? 'Skladem' : 'Není skladem'}
                        </div>
                    </div>
                    <div class="quantity-block">
                        <span class="quantity-change down">-</span>
                        <input type="number" value="${item.Quantity}" data-product-id="${item.Product_ID}" class="quantity" maxlength="4" min="1" max="999" step="1">
                        <span class="quantity-change up">+</span>
                    </div>

                    <div class="price-block">${item.TotalPriceWithVat}</div>
                    <div class="remove-block">
                        <a href="javascript:;" onclick="CartHeader.deleteCartItem(this)">
                            <span class="remove">X</span>
                        </a>
                    </div>
                </div> `;

        return out;
    }
}