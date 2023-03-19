const currencies = {
    "USD": "&#36;",
    "EUR": "&#128;",
    "UAH": "&#8372;"
};

const generateForm = (formData, send = true) => {
    if (send === true) {
        Joomla.request({
            url: 'index.php?option=com_ajax&module=liqpay&method=get&format=json',
            method: 'post',
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: JSON.stringify(formData),
            onBefore: function (xhr) {
                // if return false - query will stop
            },
            onSuccess: function (response, xhr) {
                if (response !== '') {
                    let result = JSON.parse(response);
                    jQuery('#liqpay-form-result').html(result.data.form);
                }
            },
            onError: function (xhr) {
                console.log('Oops, something went wrong!');
            }
        })
    } else {
        // TODO: it should've been rewrite ES6
        let btn_text = jQuery('.mod-liqpay-view').attr('data-btn-text');
        let emptyForm = ' <form action="javascript:void(0)" accept-charset="utf-8">\n' +
            '             <button disabled type="submit" class="btn_text"><span>&#x276D;&#x276D;</span><span>' + btn_text + '</span></button>\n' +
            '            </form>'
        jQuery('#liqpay-form-result').html(emptyForm);
    }
}


/**
 *
 * @returns {boolean}
 */
const isFormValid = () => {
    let form = document.getElementById('liqpay-form');
    return document.formvalidator.isValid(form);
}

// TODO: it should've been rewrite ES6
jQuery(document).ready(function () {

    let liqpayFormView = jQuery('.liqpay-form-view');

    let agreementInput = jQuery('input#agreement');
    let agreementMessage = agreementInput.attr('data-message');

    liqpayFormView.on('click', function (event) {
        if (!agreementInput.is(':checked')) {
            agreementInput.addClass('is-invalid form-control-danger invalid');
            Joomla.renderMessages({
                'error': [agreementMessage]
            });
            jQuery('html, body').animate({
                scrollTop: parseInt(agreementInput.offset().top - 120)
            }, 500);
            event.preventDefault();
        }
    });

    // Simple Payment
    if (jQuery('div').hasClass('simple-payment')) {

        let liqpayForm = jQuery('#liqpay-form');

        // Send Ajax - onchange form
        liqpayForm.on('change', function () {
            let formData = liqpayForm.serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            generateForm(formData, isFormValid());
            if(isFormValid()) {
                Joomla.removeMessages();
            }
        });

        // Send Ajax - onclick amount tag
        let inputAmount = jQuery('input[name=amount]');
        let amountTag = jQuery('.mod-liqpay-amount-tag');
        let amountTagSymbol = jQuery('.mod-liqpay-amount-tag .symbol');

        amountTag.on('click', function () {
            let value = jQuery(this).attr('data-value');
            amountTag.removeClass('active');
            jQuery(this).addClass('active');
            inputAmount.val(value);
            liqpayForm.trigger('change');
        });

    }

    // Group Payment
    if (jQuery('div').hasClass('group-payment')) {

        let serviceCheck = jQuery('input.service-check');
        let modLiqpayView = jQuery('.mod-liqpay-view');

        let currency = modLiqpayView.attr('data-currency');
        let module_id = modLiqpayView.attr('data-module-id');
        let btn_text = modLiqpayView.attr('data-btn-text');
        let route = modLiqpayView.attr('data-route');


        serviceCheck.on('change', function (event) {

            let servicesSum = jQuery('.services-sum');
            let servicesSumTotal = jQuery('.services-sum span');

            let total = 0;
            let description = '';

            jQuery('input.service-check:checkbox:checked').each(function () {
                total += isNaN(parseInt(jQuery(this).val())) ? 0 : parseInt(jQuery(this).val());
                description += jQuery(this).attr('data-name') !== "" ? jQuery(this).attr('data-name').toLowerCase() + ";" : '';
            });
            servicesSumTotal.html(total);

            if (total === 0) {
                servicesSum.removeClass('d-block').addClass('d-none');
                total = '';
            } else {
                servicesSum.removeClass('d-none').addClass('d-block');
            }

            generateForm({
                amount: total,
                currency: currency,
                description: description,
                module_id: module_id,
                btn_text: btn_text,
                route: route
            }, agreementInput.is(':checked'));
        });

        agreementInput.on('change', function () {
            serviceCheck.trigger('change');
        });

    }
});