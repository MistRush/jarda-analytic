class EvidsoftLayout {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $('#changeEshop').change((e) => {
            let val = e.currentTarget.value;
            let selected = $('#changeEshop').data('selected');
            if (val != selected) {
                let d = new Date();
                d.setTime(d.getTime() + 86400000);
                document.cookie = "Eshop_ID=" + val + ";expires=" + d.toUTCString() + ";path=/admin";
                window.location.reload();
            }
        });
        $('#changeLanguage').change((e) => {
            let val = e.currentTarget.value;
            let selected = $('#changeLanguage').data('selected');
            if (val != selected) {
                let d = new Date();
                d.setTime(d.getTime() + 86400000);
                document.cookie = "Language=" + val + ";expires=" + d.toUTCString() + ";path=/admin";
                window.location.reload();
            }
        });

        $(document).on('select2:open', () => {
            document.querySelector('.select2-search__field').focus();
        });

        // $('header .right').prepend('<a class="create-new-feedback" title="Vytvořit nový feedback" href="/admin/feedback/create-feedback"><i class="ci ci-feedback"></i>Nový</a>');

    }
}