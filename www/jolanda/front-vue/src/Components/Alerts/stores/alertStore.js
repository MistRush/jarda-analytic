import { defineStore } from 'pinia';
import { ref } from "vue";
import { useAlert } from "@/Components/Alerts/js/useAlert";

// Max počet alertů
const DEFAULT_ALERT_COUNT = 50

export const useAlertStore = defineStore('jolanda_alerts', () => {
    const alerts = ref( []);
    const maxAlerts = ref(DEFAULT_ALERT_COUNT);
    const isHistoryBarShown = ref(false);

    /**
     * @brief Vloží alert do alertStoru
     * @param type typ alertu - momentálně success, warning, danger a **waiting**
     * @param title nadpis alertu
     * @param message zpráva alertu
     * @param data data, které do alertu můžeme poslat za účelem např. vypsání prostředí, když nastane chyba
     * @param duration délka zobrazení alertu (ms)
     * @returns objekt vytvořeného alertu
     * */
    function push (type, title, message, data = null, duration = 5000, options = {}) {
        if(duration === null){
            duration = 5000;
        }


        const alert = useAlert({type: type, title: title, message: message, data: data, duration: duration, options: options});

        if(alerts.value.length === maxAlerts.value) {
           alerts.value.shift();
        }

        alerts.value = [...alerts.value, alert];
        return alert;
    }

    function clearAll() {
        alerts.value = [];
    }

    function removeAlert(alert) {
        const index = alerts.value.indexOf(alert);
        if (index !== -1) {
            alerts.value.splice(index, 1);
        }
    }

    function danger(title, message, data = null, duration = 5000, options = {}){
        return push('danger', title, message, data, duration, options);
    }

    function error(title, message, data = null, duration = 5000, options = {}){
        return danger(title, message, data, duration, options);
    }

    function info(title, message, data = null, duration = 5000, options = {}){
        return push('info', title, message, data, duration, options);
    }

    function warning(title, message, data = null, duration = 5000, options = {}){
        return push('warning', title, message, data, duration, options);
    }

    function waiting(title, message, data = null, duration = 5000, options = {}){
        return push('waiting', title, message, data, duration, options);
    }

    function success(title, message, data = null, duration = 5000, options = {}){
        return push('success', title, message, data, duration, options);
    }

    function alert(title, type = 'info', message = '', persist = false, options = {}){
        if(type === 'error'){
            type = 'danger';
        }

        return push(type, title, message, null, 5000, options);
    }

    function showHistoryBar(show = true){
        isHistoryBarShown.value = show;
    }

    function processStatuses(statuses){
        statuses.forEach((status) => {
            alert(status.msg, status.type);
        });
    }


    return { alerts, push, removeAlert, clearAll, danger, error, info, warning, waiting, success, alert, showHistoryBar, isHistoryBarShown, processStatuses}
});