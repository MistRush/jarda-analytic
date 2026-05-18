import { defineCustomElement } from 'vue';
import AnalyticsDashboard from './pages/admin/analytics/Index.vue';

/**
 * JARDA Analytics Universal Widget
 * Umožňuje vložit statistiky do libovolného projektu pomocí jedné řádky:
 * <jarda-analytics property-id="442371946" site-url="https://..."></jarda-analytics>
 */

const JardaAnalytics = defineCustomElement(AnalyticsDashboard);

// Registrace web komponenty
if (!customElements.get('jarda-analytics')) {
    customElements.define('jarda-analytics', JardaAnalytics);
    console.log('✅ JARDA Analytics Universal Widget registrován');
}
