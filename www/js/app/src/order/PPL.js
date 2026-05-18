class PPL {
    constructor() {
        this.modalBox = null;
        this.closeButton = null;
        this.init();
        this.bindEvents();
    }

    init() {
        // Vytvoření základních elementů
        $('<div id="ppl-parcel-shop-modal"><div class="ppl-modal-header"></div>').insertBefore('#footer');
        $('<div id="ppl-parcelshop-map" data-countries="cz"></div>').appendTo('#ppl-parcel-shop-modal');
        $('<a id="close-modal-button">&times;</a>').prependTo('.ppl-modal-header');

        this.modalBox = document.querySelector("#ppl-parcel-shop-modal");
        this.closeButton = document.querySelector("#close-modal-button");

        // Načtení externích zdrojů
        this.loadExternalResources();
    }

    loadExternalResources() {
        // Načtení JavaScript souboru
        const script = document.createElement('script');
        script.src = 'https://www.ppl.cz/sources/map/main.js';
        script.onload = () => {
            this.setupEventListeners();
        };
        document.getElementsByTagName('head')[0].append(script);

        // Načtení CSS souboru
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://www.ppl.cz/sources/map/main.css";
        document.getElementsByTagName('head')[0].append(link);
    }

    bindEvents() {
        // Kliknutí na tlačítko pro výběr pobočky
        $('#choose-parcel-shop').unbind('click').click(() => {
            this.openModal();
        });

        // Kliknutí na tlačítko pro zavření modalu
        this.closeButton.addEventListener("click", () => {
            this.closeModal();
        });
    }

    setupEventListeners() {
        // Poslouchání událostí z mapy PPL
        document.addEventListener("ppl-parcelshop-map", (event) => {
            this.closeModal();
            this.processSelectedPoint(event.detail);
        });
    }

    openModal() {
        this.modalBox.style.opacity = 1;
        this.modalBox.style.zIndex = 99999;
    }

    closeModal() {
        this.modalBox.style.opacity = 0;
        this.modalBox.style.zIndex = -9999999;
    }

    processSelectedPoint(details) {
        const pickupID = details.id;
        const pickupName = details.name;
        const pickupCode = details.code;
        const addressCity = details.city;
        const addressStreet = details.street;
        const addressZipCode = details.zipCode;
        const parcelShopDetail = $('.ppl-selected-pickup-point');

        parcelShopDetail.css('display', 'block');
        parcelShopDetail.attr('data-point-chosen', true);
        parcelShopDetail.attr('data-point-id', pickupID);
        parcelShopDetail.attr('data-point-name', pickupName);
        parcelShopDetail.attr('data-point-code', pickupCode);
        parcelShopDetail.attr('data-point-address', `${addressStreet}, ${addressCity} ${addressZipCode}`);
        parcelShopDetail.html(`Vybrané místo: ${pickupName}, ${addressStreet}, ${addressCity} ${addressZipCode}`);

        // Zavolání metody pro zpracování na straně košíku
        ShippingPayment.handlePPL();
    }

    clear() {
        const parcelShopDetail = $('.ppl-selected-pickup-point');
        parcelShopDetail.css('display', 'none');
        parcelShopDetail.attr('data-point-chosen', false);
        parcelShopDetail.html('');
    }
}
