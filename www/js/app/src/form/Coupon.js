/**
 * Kupóny
 */
class Coupon {
    /**
     * Konstruktor pro kupóny
     * @param form_id
     */
    constructor(form_id = 'coupon-form') {
        this._element = document.getElementById(form_id);
        this._form = new Form(form_id);

        this.init();
    }

    /**
     * Vrací formulář
     * @return {*|jQuery|HTMLElement}
     */
    get $form() {
        return $(this._element);
    }

    init() {
        $(() => {
            this.$input = this.$form.find('input[name="couponCode"]');
            this.$submit = this.$form.find('button[type="submit"]');
            this.$reset = this.$form.find('button[type="reset"]');

            if (this.$input.val().length) {
                this.handleSuccess();
            }
        });

        this.$form.on('submit', (e) => {
            e.preventDefault();
            this.applyCoupon(this.$input.val());
        });

        this.$form.on('reset', (e) => {
            this.removeCoupon();
        });
    }

    /**
     * Aplikuje kupón
     * @param {string} coupon
     */
    applyCoupon(coupon) {
        $.ajax({
            url: projectVars.basePath + '/cart/apply-coupon',
            method: 'POST',
            data: {
                coupon: coupon
            },
            success: (data) => {
                try {
                    data = JSON.parse(data);
                    if (data.error === true)
                        return this.handleError(data.error_msg);

                    this.handleSuccess();
                } catch (ex) {
                    this.handleError();
                }
                location.reload();
                //CartPage.refreshCart();
            },
            error: () => {
                this.handleError();
            },
        });
    }


    removeCoupon() {
        $.ajax({
            url: projectVars.basePath + '/cart/remove-coupon',
            method: 'POST',
            success: (data) => {
                this.$input.prop('readonly', false);
                this.$reset.hide();
                this.$submit.show();
                location.reload();
                //CartPage.refreshCart();
            },
            error: () => {
                this.handleError();
            },
        });
    }

    /**
     * Handle pro error
     * @param {string|null} msg
     * @return {boolean}
     */
    handleError(msg = null) {
        this.$input.prop('readonly', false);
        this.$reset.hide();
        this.$submit.show();

        if (msg)
            alerts.alert('Error', 'error', msg);
        else
            alerts.error();

        return false;
    }

    /**
     * Handle pro úspěšné užití
     */
    handleSuccess() {
        this.$input.attr('readonly', true);
        this.$reset.show();
        this.$submit.hide();
    }
}