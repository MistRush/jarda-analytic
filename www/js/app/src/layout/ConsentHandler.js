class ConsentHandler {
    enableAnalyticsScripts() {
        if (typeof gtag === 'undefined') {
            return;
        }
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        })
    }

    disableAnalyticsScripts() {
        if (typeof gtag === 'undefined') {
            return;
        }
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        })
    }

    enableMarketingScripts() {
        if (typeof gtag === 'undefined') {
            return;
        }
        gtag('consent', 'update', {
            'ad_personalization': 'granted',
            'ad_user_data': 'granted',
            'analytics_storage': 'granted'
        })
    }

    disableMarketingScripts() {
        if (typeof gtag === 'undefined') {
            return;
        }
        gtag('consent', 'default', {
            'ad_personalization': 'denied',
            'ad_user_data': 'denied'
        })
    }

}

