class OrderDetailLayout {

    isOpen = false;
    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
         this.clickEvent();
    }

    clickEvent() {
        const me = this;
        $(".open-order-detail").click(function (event) {
            if(me.isOpen) {
                $( "#order-detail-block" ).remove();
                me.isOpen = false;
                if($(this).hasClass('open')) {
                    $(this).removeClass('open');
                    $(this).parent('td').parent('tr').removeClass('open-order-detail');
                    return;
                }
            }
            $(".order-detail").removeClass('open');
            $(".order-history tr").removeClass('open-order-detail');

            const orderId= $(this).attr('data-id');
            // $(".loader-circle").show();
            $('<tr id="order-detail-block"><td colspan="6"><div id="order-detail-load"></div></td></tr>').insertAfter(  $(this).parent('td').parent('tr') );
            me.loadPage(orderId);
            $(this).addClass('open');
            $(this).parent('td').parent('tr').addClass('open-order-detail');
            me.isOpen = true;
        });
    }

    loadPage(orderId) {
        const me = this;
        let url;
        url = this.buildProperUrlForPageLoading(orderId);
        $.ajax({
            url,
            data: {},
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedPageIntoPage(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function () {
                new OrderCustomerForm();
            }
        });
    }

    buildProperUrlForPageLoading(orderId) {
        return `/customer/order-detail/id/${orderId}`
    }

    insertLoadedPageIntoPage(data) {
        $('#order-detail-load').hide();
        $('#order-detail-load').html(data);
        $('#order-detail-load').show(500);
    }
}