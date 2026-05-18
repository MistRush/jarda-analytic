class Formatters {
    formatStock(value, col) {
        if (value === null)
            value = 0;
        let cls = '';
        switch (col) {
            case 'Availability1':
                cls = 'green';
                break;
            case 'Availability2':
                cls = 'yellow';
                break;
            case 'Availability3':
                cls = 'red';
                break;
            case 'AvailabilitySum':
                cls = 'yellowClaim';
                break;
        }
        if (value <= 0)
            cls = '';

        return '<div class="stock-info ' + cls + '">' + value + '</div>';
    }

    formatPriceCdb(value, col, row) {
        const gExactPrice = row?.gExactPrice ? row.gExactPrice === "1" : false;
        const last3 = col.slice(-3);
        if ((value == 0 || value == null || value == 'null') && !gExactPrice)
            return 'On request';
        else
        if(last3 == "EUR")
            return '<div style=" font-size: 14px">' + Helpers.formatPrice(value / 100) + ' \u20AC</div>';
        if(last3 == "CZK")
            return '<div style=" font-size: 14px">' + Helpers.formatPrice(value / 100) + ' Kč</div>';
        if(last3 == "GBP")
            return '<div style=" font-size: 14px">' + Helpers.formatPrice(value / 100) + ' &pound</div>';
        if(last3 == "PLN")
            return '<div style=" font-size: 14px">' + Helpers.formatPrice(value / 100) + ' zł</div>';

    }

    formatPriceCdbWorkflow(value) {
        if (value == 0 || value == null || value == 'null')
            return 'Not a value';
        else
            return '<div style=" font-size: 14px">' + Helpers.formatPrice(value) + '</div>';
    }

    formatPriceCdbGreen(value, col, row) {
        const gExactPrice = row?.gExactPrice ? row.gExactPrice === "1" : false;
        const last3 = col.slice(-3);
        if ((value == 0 || value == null || value == 'null') && !gExactPrice)
            return 'On request';
        else
            if(last3 == "EUR")
                return '<div style="color: #24C586; font-weight: bold; font-size: 14px">' + Helpers.formatPrice(value / 100) + ' \u20AC</div>';
            if(last3 == "CZK")
                return '<div style="color: #24C586; font-weight: bold; font-size: 14px">' + Helpers.formatPrice(value / 100) + ' Kč</div>';
            if(last3 == "GBP")
                return '<div style="color: #24C586; font-weight: bold; font-size: 14px">' + Helpers.formatPrice(value / 100) + ' &pound</div>';
            if(last3 == "PLN")
                return '<div style="color: #24C586; font-weight: bold; font-size: 14px">' + Helpers.formatPrice(value / 100) + ' zł</div>';

    }

    formatPrice(value, col, row) {
        const gExactPrice = row?.gExactPrice ? row.gExactPrice === "1" : false;

        if ((value == 0 || value == null || value == 'null') && !gExactPrice)
            return 'On request';
        else
            return Helpers.formatPrice(value / 100);
    }

    generateRandomText(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    formatProductRankingBuyer(value) {
        if(!value)
            return '<div class="stock-info w-75" style="background: darkgrey;">-</div>';
        else
            return '<div class="stock-info w-75" style="background: #48BF53;">'+ value +'</div>';
    }
    formatProductRanking(value) {
        if(!value)
            return '<div class="stock-info w-75" style="background: darkgrey;">-</div>';
        else if(value <= 100)
            return '<div class="stock-info w-75" style="background: #48BF53;">'+ value +'</div>';
        else if(value <= 200)
            return '<div class="stock-info w-75" style="background: #FFCE03; color: black !important;">'+ value +'</div>';
        else if(value <= 300)
            return '<div class="stock-info w-75" style="background: #FD9A01;">'+ value +'</div>';
        else if(value <= 400)
            return '<div class="stock-info w-75" style="background: #FD6104;">'+ value +'</div>';
        else if(value <= 1000)
            return '<div class="stock-info w-75" style="background: #C1181D;">'+ value +'</div>';
        else if(value <= 2500)
            return '<div class="stock-info w-75" style="background: #88060b;">'+ value +'</div>';
        else
            return '<div class="stock-info w-75" style="background: #8c2905;">2501+</div>';
    }

    formatProductReclamationStatus(value) {
        let match = value.match(/(\d+)/); // Find the first occurrence of numbers

        if (!match) {
            return '<div class="stock-info w-75" style="background: grey;">Unknown</div>';
        }
        let numberPart = parseInt(match[0], 10); // Convert matched number to an integer
        let stringPart = value.replace(match[0], "").trim(); // Remove the number from the input string

        if(!value)
            return '<div class="stock-info w-75" style="background: darkgrey;">-</div>';
        else if(numberPart == 138)
            return '<div class="stock-info w-75" style="background: #48BF53;">'+ stringPart +'</div>';
        else if(numberPart == 105)
            return '<div class="stock-info w-75" style="background: #FFCE03; color: black !important;">'+ stringPart +'</div>';
        else if(numberPart == 113)
            return '<div class="stock-info w-75" style="background: #FD9A01;">'+ stringPart +'</div>';
        else if(numberPart == 159)
            return '<div class="stock-info w-75" style="background: #FD6104;">'+ stringPart +'</div>';
        else
            return '<div class="stock-info w-75" style="background: #8c2905;">'+ stringPart +'</div>';
    }

    formatProductReclamationLegitimacy(value) {

        let match = value.match(/(\d+)/); // Find the first occurrence of numbers

        if (!match) {
            return '<div class="stock-info w-75" style="background: grey;">Unknown</div>';
        }
        let numberPart = parseInt(match[0], 10); // Convert matched number to an integer
        let stringPart = value.replace(match[0], "").trim(); // Remove the number from the input string

        if(!value)
            return '<div class="stock-info w-75" style="background: darkgrey;">-</div>';
        else if(numberPart == 1)
            return '<div class="stock-info w-75" style="background: #0080ff; color: black !important;">'+ stringPart +'</div>';
        else if(numberPart == 2)
            return '<div class="stock-info w-75" style="background: #FF0000; color: black !important;">'+ stringPart +'</div>';
        else if(numberPart == 3)
            return '<div class="stock-info w-75" style="background: #48BF53;">'+ stringPart +'</div>';
        else if(numberPart == 4)
            return '<div class="stock-info w-75" style="background: #FD9A01;">'+ stringPart +'</div>';
        else
            return '<div class="stock-info w-75" style="background: grey;">'+stringPart+'</div>';
    }

    formatWorkflowStatus(value) {
        if (!value) {
            return '<div class="stock-info w-75" style="background: #A9A9A9;">Není určeno</div>';
        }

        let color = '#A9A9A9'; // default: Není určeno
        let label = value;

        switch (value.toLowerCase()) {
            case 'zrušeno':
                color = '#FF4C4C'; // červená
                break;
            case 'dokončeno':
                color = '#4CAF50'; // zelená
                break;
            case 'probíhá':
                color = '#2196F3'; // modrá
                break;
            case 'vytvořeno':
                color = '#FFB74D'; // oranžová
                break;
            case 'pozastaveno':
                color = '#607D8B'; // oranžová
                break;
            case 'není známo':
                color = '#A9A9A9'; // tmavě šedá
                break;
            case 'čeká':
                color = '#C9B010'; // žlutá
                break;
        }

        return `<div class="stock-info w-75" style="background: ${color};">${label}</div>`;
    }

    formatWorkflowResult(value) {
        if (!value) {
            return '<div class="stock-info w-75" style="background: #A9A9A9;">Není určeno</div>';
        }

        let color = '#A9A9A9'; // default: Není určeno
        let label = value;

        switch (value.toLowerCase()) {
            case 'zamítnuto':
                color = '#FF4C4C'; // červená
                break;
            case 'schváleno':
                color = '#4CAF50'; // zelená
                break;
            case 'není určeno':
                color = '#A9A9A9'; // tmavě šedá
                break;
        }

        return `<div class="stock-info w-75" style="background: ${color};">${label}</div>`;
    }

    formatResponsibleEmployees(value) {
        if (!value || typeof value !== 'string') {
            return '<div class="stock-info w-75" style="background: #A9A9A9;">Není určeno</div>';
        }

        const items = value.split(',').map(v => v.trim());

        const results = items.map(item => {
            // Expected format: "schváleno: Petra Černá"
            const parts = item.split(':');
            if (parts.length !== 2) return '';

            const status = parts[0].trim().toLowerCase();
            const label = parts[1].trim();

            let color = '#A9A9A9'; // default

            switch (status) {
                case 'zamítnuto':
                    color = '#FF4C4C'; // red
                    break;
                case 'schváleno':
                    color = '#4CAF50'; // green
                    break;
                case 'není určeno':
                    color = '#A9A9A9'; // gray
                    break;
            }

            return `<div class="stock-info w-75 mb-1" style="background: ${color};">${label}</div>`;
        });

        return results.join('');
    }


    formatImage(name, key, row) {
        const srcFull = `/files/reclamations/${row.OrderNumber}/${name}`;
        return ` <a href="${srcFull}" target="_blank">
            <img src="${srcFull}" style="max-height: 200px">
        </a>`;
    }
}

var ActiveProductFilter = (row, data) => {
    if (data.Deactivate == 1)
        $(row).addClass('deactivated');
}
