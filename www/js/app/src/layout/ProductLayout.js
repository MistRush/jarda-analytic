class ProductLayout {

    constructor() {
        $(() => {
            this.bindEvents();
        });

        new Tabs('product-tabs');
    }

    bindEvents() {
        const me = this;
        $(".fancybox").fancybox({
            'speedIn': 0
        });
        this.inputControls(me);
        this.switchProductDetailBlock();

        window.onresize = (event) => {
            this.switchProductDetailBlock();
        }

        $('#button-price').click((e) => {
            e.preventDefault();
        })

        if($('.attribute-item').length) {
            me.disableAddToCartButton();
        }

        $('.attribute-item').click(function () {
            if(me.isAddToCartButtonDisabled()) {
                me.enableAddToCartButton()
            }
            me.handleProductAttributes(this);
        })


        $('.copy-current-product-link').click(async function() {
            const url = $(this).data('url');
            try {
                await navigator.clipboard.writeText(url);
            } catch (e) {
                console.log(e);
            }
        })

        if( $('.price-per-piece-block').length > 0 ) {
            const me = this;
            $('.quantity').on('change', this.debounce(function() {
                me.checkUnitPrice($('#product').data('id'), $(this).val());
            }, 1000));
        }

        new Watchdog();
    }

    switchProductDetailBlock() {
        if ($(window).width() < 992) {
            $(".desktop-visible .sticky").appendTo(".mobile-visible");
        } else {
            $(".mobile-visible .sticky").appendTo(".desktop-visible");
        }
    }

    isAddToCartButtonDisabled() {
        return $('.add-to-cart').hasClass('disabled');
    }

    enableAddToCartButton() {
        $('.add-to-cart').removeClass('disabled');
        $('.add-to-cart').removeAttr('disabled');
    }

    disableAddToCartButton() {
        $('.add-to-cart').addClass('disabled');
        // $('.add-to-cart').attr("disabled", true);
    }

    debounce(func, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    handleProductAttributes(context) {
        const paramID = $(context).data('paramId');
        const productParamID = $(context).data('productParamId');
        const paramValue = $(context).data('paramValue');
        $(`#param-${paramID}`).html(paramValue);
        this.handleActiveClass(context);
        $('#selected-product-attributes').val(`${productParamID}`)
    }

    handleActiveClass(context) {
        this.clearActiveClass();
        $(context).addClass('active');
    }

    inputControls(me) {
        $('.input-group').on('click', '.button-qty', function (e) {
            me.checkWhetherIncrOrDecr(e, me);
        });
    }

    checkUnitPrice(productID, quantity) {
        $.ajax({
            url: '/default/product/check-unit-price',
            data: {
                productID: productID,
                quantity: quantity
            },
            success: function(data) {
                const response = JSON.parse(data);
                $('.price-block .with-vat').html(response.PriceWithVat +' Kč');
                $('.price-block .without-vat').html(response.PriceWithoutVat + ' Kč bez DPH');
            }
        });
    }

    checkWhetherIncrOrDecr(e, me) {
        if (e.target.value === "+") {
            me.incrementInputValue(e);
            $("#finalPrice").trigger("change");
        } else {
            me.decrementInputValue(e);
            $("#finalPrice").trigger("change");
        }
    }

    incrementInputValue(e) {
        e.preventDefault();
        const fieldName = $(e.target).data('field');
        const parent = $(e.target).closest('div');
        const currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

        if (!isNaN(currentVal)) {
            parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
        } else {
            parent.find('input[name=' + fieldName + ']').val(0);
        }
    }

    clearActiveClass() {
        $('.attribute-item').removeClass('active');
    }

    decrementInputValue(e) {
        e.preventDefault();
        const fieldName = $(e.target).data('field');
        const parent = $(e.target).closest('div');
        const currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

        if (!isNaN(currentVal) && currentVal > 0) {
            parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
        } else {
            parent.find('input[name=' + fieldName + ']').val(0);
        }
    }
}