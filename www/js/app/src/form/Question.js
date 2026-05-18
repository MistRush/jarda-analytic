class Question {
    constructor() {
        $(() => {
            this.questionForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('#confirm-question').click(() => {
            this.questionForm.validate();

            if ( this.questionForm.valid )
                $('#main-form').submit();
        });
    }
}