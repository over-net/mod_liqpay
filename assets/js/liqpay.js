const currencies = {
    "USD": "&#36;",
    "EUR": "&#128;",
    "UAH": "&#8372;"
};


function generateForm(formData) {
    Joomla.request({
        url: 'index.php?option=com_ajax&module=liqpay&method=get&format=json',
        method: 'post',
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: JSON.stringify(formData),
        onBefore: function (xhr) {
            //console.log(xhr);
            // if return false - query will stop
        },
        onSuccess: function (response, xhr) {
            if (response !== '') {
                let result = JSON.parse(response);
                //console.log(result.data.form);
                jQuery('#liqpay-form-result').html(result.data.form);
            }
        },
        onError: function (xhr) {
            console.log('Oops, something went wrong!');
        }
    })
}


jQuery(document).ready(function () {

    if (jQuery('div').hasClass('simple-payment')) {

        let amounts = jQuery('.mod-liqpay-amounts');
        let inputAmount = jQuery('input[name=amount]');
        let amountTag = jQuery('.mod-liqpay-amount-tag');
        let amountTagSymbol = jQuery('.mod-liqpay-amount-tag .symbol');

        let formData = {
            amount: jQuery('#amount').val(),
            currency: jQuery('#currency').val(),
            description: jQuery('#description').val(),
            module_id: jQuery('#module_id').val(),
            btn_text: jQuery('#btn_text').val(),
            route: jQuery('#route').val()
        };

        jQuery('#liqpay-form').on('change', function () {
            generateForm(formData);
        });
        jQuery('select[name=currency]').on('change', function () {
            let symbol = currencies[jQuery(this).val()];
            amountTagSymbol.html(symbol);
            generateForm(formData);
        });
        amountTag.on('click', function () {
            let value = jQuery(this).attr('data-value');
            amountTag.removeClass('active');
            jQuery(this).addClass('active');
            inputAmount.val(value);
            generateForm(formData);
        });
        if (inputAmount.not(":empty")) {
            generateForm(formData);
        }
        inputAmount.on('blur', function () {
            let val = jQuery(this).val();
            amountTag.removeClass('active');
            if (val !== "") {
                amounts.find('span[data-value=' + val + ']').addClass('active');
            }
        });
    }
    if (jQuery('div').hasClass('group-payment')) {

        let serviceCheck = jQuery('input.service-check');
        let tableView = jQuery('.mod-liqpay-table-view');
        let currency = tableView.attr('data-currency');
        let module_id = tableView.attr('data-module-id');
        let btn_text = tableView.attr('data-btn-text');
        let route = tableView.attr('data-route');

        serviceCheck.on('change', function () {
            let total = 0;
            let description = '';
            let servicesSum = jQuery('.services-sum');
            jQuery('input:checkbox:checked').each(function () {
                total += isNaN(parseInt(jQuery(this).val())) ? 0 : parseInt(jQuery(this).val());
                description += jQuery(this).attr('data-name').toLowerCase() + ";";
            });
            jQuery(".services-sum span").html(total);

            if(total === 0) {
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
            });
        });

    }
});