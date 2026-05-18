class LoginForm {

    constructor() {
        $('body').on('click', '#confirm-login', function () {
            $('.userError').hide();

            if ($('#LoginEmail').val() && $('#LoginPassword').val()) {
                $.ajax({
                    type: "POST",
                    url: "/default/customer/login-process",
                    data: {
                        Email: $('#LoginEmail').val(),
                        Password: $('#LoginPassword').val(),
                    },
                    async: false,
                    success: function (data) {
                        const dataObj = JSON.parse(data);
                        if (dataObj.success && !dataObj.userFromOldAccount) {
                            if (location.href.includes('/logout') || location.href.includes('/register-done') || location.href.includes('/set-new-password')) {
                                location.href = '/';
                            } else {
                                location.reload();
                            }
                        }
                        if (dataObj.success && dataObj.userFromOldAccount) {
                            location.href = '/default/customer/old-account?hash=' + dataObj.hash;
                        }
                        if (!dataObj.success && dataObj.userFromOldAccount) {
                            $('.userError').show();
                        }
                        if (!dataObj.success && !dataObj.userFromOldAccount) {
                            $('.userError').show();
                        }

                    }
                });
            } else {
                $('.userError').show();
            }
        });

        $('.loginDialog .modal-body').keypress(function (e) {
            if (e.keyCode === 13) {
                $('#confirm-login').trigger('click');
            }
        });

    }
}