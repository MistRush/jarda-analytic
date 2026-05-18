class Newsletter {
    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        $(".newsletter-subscribe").click((e) => {
            this.newsletterSubscribe();
        });
    }

    newsletterSubscribe() {
        $.ajax({
            type: "POST",
            url: "/default/customer/newsletter-subscribe",
            data: {
                NewsletterSubscriber: $('.newsletter-email').val()
            },
            success: function (data) {
                let newsletterMessage = $('.newsletter-container .message');

                newsletterMessage.show();
                newsletterMessage.html(data);
            },
        });
    }
}