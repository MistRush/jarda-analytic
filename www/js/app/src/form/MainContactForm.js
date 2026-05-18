class MainContactForm {
    constructor() {
        $(() => {
            this.contactForm = new Form("contact-us-form");
            this.bindEvents();
        });
    }

    bindEvents() {
        $("#contact-us-form #confirm-contact-form").click(async (e) => {
            e.preventDefault();
            if (this.contactForm.validate()) {
                await this.recapchaCallback();
            }
        });
    }

    recapchaCallback() {
        const me = this;
        grecaptcha.ready(function () {
            grecaptcha.execute('6LdSvYUsAAAAAMEc4A38re5VImJbJI1Jz04BF2PX', { action: 'submit' }).then(function (token) {
                me.validateForm(token);
            });
        });
    }

    validateForm(token) {
        $('<div class="progress-loader-wrap" style="float: initial; margin: 0 auto; position: absolute; right: 15px; top: -26px"><div class="progress-loader"></div></div>').insertBefore('#confirm-contact-form');
        $('#confirm-contact-form').hide();
        $.ajax({
            type: "POST",
            url: "/default/page/contact-us",
            data: {
                Name: $('#name').val(),
                Company: $('#company').val(),
                Email: $('#email').val(),
                Subject: $('#subject').val(),
                Message: $('#message').val(),
                Token: token
            },
            success: function (data) {
                $('#contact-us-form').trigger("reset");
                $('#contact-us-form form').hide();
                $('#contact-us-form').css('height', '125px');
                $('#contact-us-form').html('<p><strong>Vaše zpráva byla úspěšně odeslána. Děkujeme</strong></p>');
            },
        });
    }
}