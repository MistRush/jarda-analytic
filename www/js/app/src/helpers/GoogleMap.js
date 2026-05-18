class GoogleMap {
    apiKey;
    coordinates;
    iconName;
    elementId;
    constructor(options) {
        $(() => {
            this.apiKey = options.apiKey;
            this.coordinates = {lat: options.lat, lng: options.lng};
            this.iconName = options.iconName;
            this.elementId = options.elementId;
            this.bindEvents();
        });
    }

    bindEvents() {
        this.handleMap()
    }

    handleMap() {
        const me = this;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&v=weekly"`;
        script.onload = function() {
           me.initMap();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    }


   initMap() {
        const map = new google.maps.Map(document.getElementById(this.elementId), {
            center: new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng),
            zoom: 16,
        });

        const iconBase = "/img/front/icons/";
        const icons = {
            evidsoft: {
                icon: iconBase + this.iconName,
            },
        };
        const features = [
            {
                position: new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng),
                type: "evidsoft",
            },
        ];

        // Create markers.
        for (let i = 0; i < features.length; i++) {
            const marker = new google.maps.Marker({
                position: features[i].position,
                icon: icons[features[i].type].icon,
                map: map,
            });
        }
    }
}