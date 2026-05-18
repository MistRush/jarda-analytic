<script setup>
import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";
import Alert from "@/Components/Alerts/Alert.vue";
import HistoryBar from "@/Components/Alerts/HistoryBar/HistoryBar.vue";

const alertStore = useAlertStore(window.pinia);

if(typeof window.jolandaConfig !== 'undefined' && window.jolandaConfig.alerts.vueAlerts){
    window.alerts = alertStore;
}
</script>

<template>
    <div>
        <Teleport to="#vue_teleport">
            <div class="alert-grid" id="alertGrid">
                <Alert v-for="alert in alertStore.alerts" :alert="alert" :key="alert.id" :isHistory="false" @close=""/>
            </div>
        </Teleport>
        <HistoryBar></HistoryBar>
    </div>
</template>

<style scoped>
    .alert-grid {
        position: fixed;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column-reverse;
        width: 30vw;
        height: 100vh;
        flex-wrap: wrap;
        z-index: 99999;
        pointer-events: none;
        direction: rtl;
    }

    @media (max-width: 767px) {
        .alert-grid {
            width: 100%;
        }
    }

    @media (min-width: 768px) and (max-width: 1200px) {
        .alert-grid {
            width: 45%;
        }
    }
</style>