class Zasilkovna {
    packetaApiKey;
    packetaOptions;
    country;

    constructor(packetaApiKey) {
        this.packetaApiKey = packetaApiKey;
        this.loadPacketaScript();
    }

    bindEvents = () => {
        this.packetaOptions = {
            valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street",
            view: "modal",
            defaultCurrency: "CZK"
        }

        $('#chooseCzPickupPlace').unbind('click').click(() => {
            this.country= "cz";
            this.packetaOptions.country = "cz";
            this.packetaOptions.language= "cs";
            this.modalDialog($('#m1-cz'));
        });

        $('#chooseSkPickupPlace').unbind('click').click(() => {
            this.country= "sk";
            this.packetaOptions.country = "sk";
            this.packetaOptions.language= "sk";
            this.modalDialog($('#m1-sk'));
        });
    }

    showSelectedPickupPoint(point) {
        this.style.display = "block";
        this.innerText = "Vybrané místo: " + (point ? point.name : "Žádné");
        this.dataset.pointChosen = !!point;
        this.dataset.pointId = point ? point.id : '';
        this.dataset.pointName = point ? point.name : '';
        this.dataset.pointAddress = point ? `${point.street}, ${point.city}, ${point.zip}` : '';
        ShippingPayment.handleZasilkovna();
    }

    clear() {
        const elements = document.querySelectorAll(`.zasilkovna-${this.country}-selected-pickup-point`);
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerText = "";
        }
        Packeta.Widget.close();
    }

    modalDialog(div) {
        this.clear();
        Packeta.Widget.pick(this.packetaApiKey, this.showSelectedPickupPoint.bind(div[0]), this.packetaOptions);  // Použij div[0] pro získání DOM elementu z jQuery objektu
    }

    loadPacketaScript() {
        const packetaScript = document.createElement('script');
        packetaScript.src = 'https://widget.packeta.com/v6/www/js/library.js';
        packetaScript.onload = this.bindEvents;
        document.head.appendChild(packetaScript);
    }
}