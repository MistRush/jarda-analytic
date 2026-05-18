class Complaint {
    constructor() {
        this.complaintItemCounter = 1;
        $(() => {
            this.complaintForm = new Form('complaint-form');
            this.bindEvents();
            this.initializeTogglers();
            // this.initializeCountrySelects();
            this.initializeComplaintItems();
            $('.complaint-item').first().find('.complaint-item-title').text(`Položka č. 1`);
        });
    }

    bindEvents() {
        $('#confirm-complaint').click(() => {
            this.complaintForm.validate();

            let isValid = this.complaintForm.valid && $('#gdpr').prop('checked');

            $('select:visible').each(function () {
                let select = $(this);

                if (select.hasClass('select2-hidden-accessible') && !select.val()) {
                    let select2Container = select.siblings('.select2-container');
                    select2Container.addClass('input-error');
                    isValid = false;
                } else {
                    select.siblings('.select2-container').removeClass('input-error');
                }
            });

            if (isValid) {
                this.recapchaCallback();
            }
        });

        $('select').on('change', function () {
            $(this).siblings('.select2-container').removeClass('input-error');
        });
    }

    recapchaCallback() {
        grecaptcha.ready(() => {
            grecaptcha.execute('6Ld4ogArAAAAAN-5fVn8mxHa848vSIN4pqJ41BYy', {action: 'submit'}).then((token) => {
                $('<input>').attr({
                    type: 'hidden',
                    id: 'recaptchaToken',
                    name: 'Token',
                    value: token
                }).appendTo('#complaint-form');
                $('#complaint-form').submit();
            });
        });
    }

    initializeTogglers() {
        $('.with-toggler').click(function() {
            $(this).toggleClass('active');
            $(this).next().slideToggle();

            if ($(this).hasClass('active')) {
                $(this).next().find('input[type="hidden"]').val(1);
            } else {
                $(this).next().find('input[type="hidden"]').val(0);
            }
        });

        $('.company-block').hide();
        $('.delivery-address-block').hide();
    }

    initializeComplaintItems() {
        if ($('.complaint-item').length === 1) {
            $('.complaint-item').first().find('.remove-complaint-item').hide();
        }

        $('#add-complaint-item').click(() => {
            const maxCurrentNumber = Math.max(...$('.complaint-item').map(function() {
                return parseInt($(this).find('.complaint-item-title').text().replace('Položka č. ', ''));
            }).get());

            const newNumber = maxCurrentNumber + 1;

            var newItem = $('.complaint-item').first().clone();

            newItem.find('.complaint-item-title').text(`Položka č. ${newNumber}`);

            newItem.find('input, textarea').each((index, el) => {
                var $el = $(el);
                var originalId = $el.attr('id');
                var originalName = $el.attr('name');
                var newId = originalId ? originalId.replace(/\d+$/, '') + newNumber : '';
                var newName = originalName.replace(/\d+$/, '') + newNumber;

                $el.attr({
                    'id': newId,
                    'name': newName
                }).val('');
            });

            newItem.find('.remove-complaint-item').show();
            $('.complaint-item').first().find('.remove-complaint-item').show();

            $('#complaint-items').append(newItem);
        });

        $(document).on('click', '.remove-complaint-item', function() {
            if ($('.complaint-item').length > 1) {
                $(this).closest('.complaint-item').remove();

                $('.complaint-item').each((index, item) => {
                    const $item = $(item);
                    const newNumber = index + 1;

                    $item.find('.complaint-item-title').text(`Položka č. ${newNumber}`);

                    $item.find('input, textarea').each((idx, el) => {
                        const $el = $(el);
                        const originalId = $el.attr('id');
                        const originalName = $el.attr('name');

                        if (originalId) {
                            $el.attr('id', originalId.replace(/\d+$/, '') + newNumber);
                        }
                        $el.attr('name', originalName.replace(/\d+$/, '') + newNumber);
                    });
                });

                if ($('.complaint-item').length === 1) {
                    $('.complaint-item').first().find('.remove-complaint-item').hide();
                }
            } else {
                alert("Musí zůstat alespoň jedna položka zásilky.");
            }
        });
    }
}