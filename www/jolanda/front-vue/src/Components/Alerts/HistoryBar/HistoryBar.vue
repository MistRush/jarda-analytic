<script setup>
    import {useAlertStore} from "@/Components/Alerts/stores/alertStore";
    import InputField from "@/Components/Inputs/InputField.vue";
    import {computed, reactive, ref} from "vue";
    import Checkbox from "@/Components/Inputs/Checkbox.vue";
    import Alert from "@/Components/Alerts/Alert.vue";

    const alertStore = useAlertStore(window.pinia)
    const searchVar = ref('');

    const isHistory = ref(true);
    const showType = reactive({
        success: true,
        info: true,
        warning: true,
        danger: true,
        waiting: true,
    });

    const alertCount = computed(() => {
        return {
            success: alertStore.alerts.filter( alert => alert.type === 'success').length,
            info: alertStore.alerts.filter( alert => alert.type === 'info').length,
            warning: alertStore.alerts.filter( alert => alert.type === 'warning').length,
            danger: alertStore.alerts.filter( alert => alert.type === 'danger').length,
            waiting: alertStore.alerts.filter( alert => alert.type === 'waiting').length,
        }
    })

    const showFilters = ref(false);

    const toggleShowFilters = () => {
        showFilters.value = !showFilters.value;
    }

    const filteredAlerts = computed(() => {
        return alertStore.alerts.filter(alert => showType[alert.type]).filter(alert => alert.title.includes(searchVar.value));
    });
</script>

<template>
    <Teleport to="#vue_teleport">
        <div id="jolanda_historyBar" class="history" v-if="alertStore.isHistoryBarShown">
            <div class="history-container">
                <div class="history-header">
                    <div class="history-title">
                        <h2>Historie alertů <span class="history-title-count">(zobrazeno {{ filteredAlerts.length }} z {{ alertStore.alerts.length }})</span></h2>
                    </div>
                    <div class="history-header-buttons">
                        <div class="history-header-buttons-info info-error">
                            <Icon icon="close" class="pill-image" :width="14" :height="14"/>
                            <span class="info-text">{{ alertStore.alerts.filter( alert => alert.type === 'danger').length }}</span>
                        </div>
                        <div class="history-header-buttons-info info-warning">
<!--                            <img src="./../../../../img/error.svg" height="18" width="18">-->
                            <Icon icon="warning" class="pill-image" :width="14" :height="14"/>
                            <span class="info-text">{{ alertStore.alerts.filter( alert => alert.type === 'warning').length }}</span>
                        </div>
                        <div class="history-delete" @click="alertStore.clearAll">
                            <Icon icon="delete" class="delete-icon" color="#506069" :width="22" :height="22"/>
                        </div>
                        <div class="history-close" @click="alertStore.showHistoryBar(false)">
                            |
                            <!--                        <img class="close-image" alt="Close alert" src="../../../../img/cdb-icons/times.svg" height="30">-->

                            <Icon icon="close" color="#506069" :width="16" :height="16"/>
                        </div>
                    </div>
                </div>

                <div class="history-body">
                    <div class="history-search">
                        <div class="history-search-input">
                            <InputField v-model="searchVar" size="large" variant="fancy" icon="search" placeholder="Vyhledat dle názvu/obsahu"/>
                        </div>
                        <div class="history-search-filter" @click="toggleShowFilters">
                            <Icon icon="filter" class="v-center filter-icon" color="white" :height="20" :width="20"/>
                        </div>
                    </div>
                    <div class="history-checkboxes" v-if="showFilters">
                        <div class="history-checkboxes-list">
                            <div class="history-checkboxes-item">
                                <Checkbox v-model="showType.success" :label="'Úspěch (' + alertCount.success + ')'"></Checkbox>
                            </div>
                            <div class="history-checkboxes-item">
                                <Checkbox v-model="showType.info" :label="'Info (' + alertCount.info + ')'"></Checkbox>
                            </div>
                            <div class="history-checkboxes-item">
                                <Checkbox v-model="showType.warning" :label="'Varování (' + alertCount.warning + ')'"></Checkbox>
                            </div>
                            <div class="history-checkboxes-item">
                                <Checkbox v-model="showType.danger" :label="'Chyba (' + alertCount.danger + ')'"></Checkbox>
                            </div>
                            <div class="history-checkboxes-item">
                                <Checkbox v-model="showType.waiting" :label="'Čekající (' + alertCount.waiting + ')'"></Checkbox>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="history-list">
                    <Alert v-for="(alert, index) in filteredAlerts" :alert="filteredAlerts[filteredAlerts.length - index - 1]" :key="filteredAlerts.length - index - 1" :isHistory="isHistory" @close="(removedAlert) => {alertStore.removeAlert(removedAlert)}"/>
                </div>
            </div>

        </div>
    </Teleport>
</template>

<style scoped>
    .history {
        position: fixed;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        width: 30%;
        height: 100vh;
        flex-wrap: wrap;
        z-index: 100000;
        pointer-events: none;
        direction: rtl;

        background: white;
        box-shadow: 0 4px 34px 0 rgba(169, 181, 222, 0.25);

        .history-container {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow: hidden;
            direction: ltr;
            height: 100%;
            padding: 10px 15px;
            pointer-events: all;
            width: 95%;

            .history-header {
                margin: 12px 0 23px;
                display: flex;
                flex-direction: row;
                .history-title {
                    display: flex;
                    align-items: center;
                    h2 {
                        padding: 0;
                        margin: 0;
                    }
                    font-size: 16px;
                    padding: 0 5px;

                    .history-title-count {
                        font-size: 14px;
                        font-weight: 400;
                    }
                }

                .history-header-buttons {
                    align-items: center;
                    margin-left: auto;
                    display: flex;
                    flex-direction: row;

                    .history-header-buttons-info {
                        height: 19px;
                        border-radius: 15px;
                        padding: 0 8px;
                        color: white;
                        align-items: center;
                        margin-right: 7px;
                        font-size: 12px;
                        display: flex;

                        .pill-image {
                            padding-right: 5px;
                        }

                        .info-text {
                            padding-left: 1px;
                        }

                        &.info-warning {
                            background: #F90;
                        }

                        &.info-error {
                            background: red;
                        }
                    }

                    .history-delete {
                        margin: 0 3px;
                        cursor: pointer;
                    }

                    .history-close {
                        display: flex;
                        gap: 6px;
                        font-size: 22px;
                        color: rgba(0,0,0,0.2);
                        cursor: pointer;
                    }
                }
            }

            .history-body {

                .history-search {
                    border-radius: 20px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 10px;

                    .history-search-filter {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-left: 6px;
                        height: 36px;
                        width: 36px;
                        border-radius: 100px;
                        cursor: pointer;

                        text-align: center;
                        line-height: 45px;

                        background: #506069;
                        &:hover {
                            background: #24C586;
                        }

                        .filter-icon {
                            vertical-align: middle;
                        }
                    }

                    .history-search-input {
                        display: flex;
                        flex: 1;
                        padding-left: 3px;

                        .input-holder {
                            width: 100%;
                        }
                    }
                }

                .history-checkboxes {
                    display: flex;
                    flex-direction: row;
                    margin: 10px 0;

                    .history-checkboxes-list {
                        display: flex;
                        flex-grow: 1;

                        .history-checkboxes-item {
                            display: flex;
                            flex-grow: 1;

                            .checkbox-wrapper {
                                input {
                                    font-size: 12px!important;
                                }

                            }

                            .checkbox-wrapper label {
                                font-size: 10px!important;
                            }
                        }
                    }
                }

            }

            .history-list {
                border-radius: 10px;
                flex-grow: 1;
                overflow-y: auto;

                .alert {
                    width: 93%;
                    box-shadow: none;
                }
            }

            /* Custom scrollbar for WebKit browsers (Chrome, Safari) */
            .history-list::-webkit-scrollbar {
                width: 8px;
            }

            .history-list::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }

            .history-list::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
                border: 2px solid #f1f1f1; /* Adds a border to create a rounded effect */
            }

            .history-list::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            /* Remove scrollbar arrows in WebKit browsers */
            .history-list::-webkit-scrollbar-button {
                display: none;
            }

            /* Custom scrollbar for Firefox */
            .history-list {
                scrollbar-width: thin;
                scrollbar-color: #888 #f1f1f1;
            }

            /* Remove scrollbar arrows for Firefox */
            .history-list::-moz-scrollbarbutton {
                display: none;
            }
        }
    }

    @media (min-width: 1200px) and (max-width: 1399px) {
        .history {
            width: 40%;
        }
    }

    @media (min-width: 992px) and (max-width: 1199px) {
        .history {
            width: 45%;
        }
    }

    @media (min-width: 768px) and (max-width: 991px) {
        .history {
            width: 55%;
        }
    }

    @media (min-width: 576px) and (max-width: 767px) {
        .history {
            width: 74%;
        }
    }

    @media (max-width: 575px){
        .history {
            width: 90%;
        }
    }

    .pl-1 {
        padding-left: 0.5rem;
    }

</style>

<style>
html.dark-theme, html.prefer-dark{
  #jolanda_historyBar{
    background-color: var(--color-dark);
    border-left: 1px solid var(--color-medium);
    box-shadow: 0 4px 34px 0 rgba(21, 34, 52, 0.25);
  }

}
</style>