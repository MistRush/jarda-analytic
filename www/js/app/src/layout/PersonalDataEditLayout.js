class PersonalDataEditLayout {

    constructor() {
        $(() => {
            this.personalDataForm = new Form('main-form-change-personal-data');
            this.bindEvents();
        });
    }

    bindEvents() {
        const me = this;
        $('#confirm-personal-data-change').click(() => {
            $('<div class="progress-loader-wrap"><div class="progress-loader"></div></div>').insertBefore('#confirm-address');
            me.personalDataForm.validate();

            if (me.personalDataForm.valid) {
                $.ajax({
                    url: "/default/customer/edit-password-process/",
                    type: 'POST',
                    dataType: "html",
                    data: {
                        // FirstName: $('#FirstName').val(),
                        // LastName: $('#LastName').val(),
                        // Email: $('#Email').val(),
                        // Phone: $('#Phone').val(),
                        CurrentPassword: $('#CurrentPassword').val()??'',
                        Password: $('#Password').val()??'',
                        PasswordAgain: $('#PasswordAgain').val()??'',
                    },
                    success: function (data) {
                        new MyAccount('my-account-personal-data');
                        setTimeout(()=>{$('#message').html(data)},500)

                    },
                })

            }
        });
    }


}