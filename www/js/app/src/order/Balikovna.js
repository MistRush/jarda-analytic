class Balikovna {

    type = null;
    constructor(type = 'BALIKOVNY') {
        this.type = type;
        this.bindEvents();
    }

    bindEvents = () => {
        let selector = '#balikovnaChoosePickupPlace'
        if(this.type === 'POST_OFFICE') {
            selector = '#balikNaPostuChoosePickupPlace'
        }
        $(selector).unbind('click').click((e) => {
            e.preventDefault();
            this.createModal();
            window.addEventListener('message', this.iframeListener);
        });

    }

    iframeListener = (event) => {
        if (event.data.message === 'pickerResult') {
            $('.balikovna-overlay').remove();
            this.showSelectedPickupPoint(event.data.point);
        }
    }

    showSelectedPickupPoint(point) {
        let pickupPointElementId = 'm1-balikovna';
        if(this.type === 'POST_OFFICE') {
            pickupPointElementId = 'm1-balik-na-postu'
        }
        let divContainer = document.getElementById(pickupPointElementId);
        divContainer.style.display = "block";
        divContainer.innerText = "Vybrané místo: " + (point ? point.name : "Žádné");
        divContainer.dataset.pointChosen = !!point;
        divContainer.dataset.pointId = point ? point.id : '';
        divContainer.dataset.pointName = point ? point.name : '';
        divContainer.dataset.pointAddress = point ? `${point.street}, ${point.municipality_name}, ${point.zip}` : '';

        if(this.type === 'POST_OFFICE') {
            ShippingPayment.handleBalikNaPostu();
        } else {
            ShippingPayment.handleBalikovna();
        }
    }

    clear() {
        let pickupPointElementId = 'm1-balikovna';
        if(this.type === 'POST_OFFICE') {
            pickupPointElementId = 'm1-balik-na-postu'
        }
        const divContainer = document.getElementById(pickupPointElementId);
        divContainer.innerText = "";
        Packeta.Widget.close();
    }

    // Vytvoření modalu
    createModal = () => {
        this.clear();
        // Vytvoření overlay prvku
        const $overlay = $('<div class="balikovna-overlay">').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0, 0, 0, 0.7)',
            'z-index': '1000',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center'
        });

        // Vytvoření modálního okna
        const $modal = $('<div>').css({
            'background-color': 'white',
            'border-radius': '5px',
            'padding': '20px',
            'max-width': '90%',
            'max-height': '90%',
            'position': 'relative',
            'overflow': 'hidden'
        });

        // Vytvoření tlačítka pro zavření
        const $closeButton = $('<button>').text('X').css({
            'position': 'absolute',
            'top': '10px',
            'right': '10px',
            'border': 'none',
            'background': 'none',
            'font-size': '20px',
            'cursor': 'pointer'
        }).on('click', () => {
            $overlay.remove();
        });

        // Vytvoření iframe
        const $iframe = $('<iframe>', {
            'title': 'Výběr místa pro vyzvednutí zásilky',
            'src': `https://b2c.cpost.cz/locations/?type=${this.type}`,
            'allow': 'geolocation'
        }).css({
            'width': '90vw',
            'height': '80vh',
            'border': 'none'
        });

        // Sestavení modalu
        $modal.append($closeButton);
        $modal.append($iframe);
        $overlay.append($modal);

        // Přidání do DOM
        $('body').append($overlay);
    }

    // Funkce pro otevření mPOST_OFFICEodalu při kliknutí na tlačítko
    createModalButton = () => {
        const $button = $('<button>').text('Vybrat místo vyzvednutí').on('click', () => {
            this.createModal();
        });
        $('body').append($button);
    }
}
