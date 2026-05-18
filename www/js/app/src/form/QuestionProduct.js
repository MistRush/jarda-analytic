class QuestionProduct {
    constructor() {
        $(async () => {
            this.contactForm=new Form("QuestionForm");
            if(this.contactForm.validate()){
                await this.recapchaCallback()
            }
        });
    }

    recapchaCallback(){
        const me=this;
        grecaptcha.ready(function() {
            grecaptcha.execute('6LdSvYUsAAAAAMEc4A38re5VImJbJI1Jz04BF2PX', {action: 'submit'}).then(function(token) {
                me.validateForm(token);
            });
        });
    }

    validateForm(token) {
        $.ajax({
            type: "POST",
            url: '/default/product/process-question',
            data: {
                Product_ID: $('#Product_ID').val(),
                Email: $('#Email').val(),
                Phone: $('#Phone').val(),
                Description: $('#Description').val(),
                Token: token
            },
           success: function (data) {
                try {
                    data = JSON.parse(data);
                    if (data.error) {
                        alerts.alert('Error', 'error', data.msg);
                    } else {
                          const dialogId = $('#Dialog_ID').val();
                            window[dialogId].close();
                            window.onSuccessDialog();
                    }
                } catch(e) {
                    console.error(e);
                    alerts.error();
                }
            },
        });
    }
}