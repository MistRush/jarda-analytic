<script setup>
import AlertData from "@/Components/Alerts/AlertData.vue";
import { nextTick, onMounted, ref, watch } from "vue";

const emit = defineEmits(["close"]);

const props = defineProps({
    alert: {},
    isHistory: "",
});

const isExpanded = ref(false);

const alertText = ref(null);
const alertTextMessage = ref(null);
const alertTextOverflown = ref(false);

// čas skrytí alertu
// const duration = ref(5000);
const isVisible = ref(true);
const fade = ref("");
let timer;

const checkOverflow = (shownTextEl, fullTextEl) => {
    const containerHeight = alertText.value?.offsetHeight ?? 0;
    const messageHeight = alertTextMessage.value?.offsetHeight ?? 0;
    return messageHeight > containerHeight;
};

function closeAlert() {
    fade.value = "fade";

    setTimeout(() => {
        isVisible.value = false;
    }, 500);
}

function hideAlert(duration = 5000) {
    if (!props.isHistory) {
        fade.value = "startFade";
        timer = setTimeout(() => {
            closeAlert();
        }, duration);
    }
}

function preventClosing() {
    if (timer && fade.value !== "fade") {
        fade.value = "";
        clearTimeout(timer);
    }
}

// Skrytí komponenty při jejím vytvoření v případě otevřené historie
onMounted(() => {
    if (props.alert.type !== "waiting" && !props.isHistory) {
        hideAlert();
    } else {
        preventClosing();
    }
    nextTick(() => {
        alertTextOverflown.value = checkOverflow(alertText, alertTextMessage);
    });
});

watch(
    () => props.alert.type,
    () => {
        hideAlert();
    },
);

function copyDataToClipboard(data) {
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data);

    // Use the Clipboard API to write the text to the clipboard
    navigator.clipboard
        .writeText(jsonString)
        .then(function () {
            console.log("JSON data copied to clipboard successfully!");
        })
        .catch(function (err) {
            console.error("Failed to copy text: ", err);
        });
}
</script>

<template>
    <div v-if="(!isHistory && isVisible) || isHistory" :class="['alert', 'jolanda-alert', 'alert-' + alert.type, fade]" @mouseenter="preventClosing()" @mouseleave="isVisible && !isHistory && alert.type !== 'waiting' ? hideAlert(5000) : ''" class="dark:border-1 dark:border-medium">
        <div v-if="alert.progress !== null" class="w-full h-[8px] absolute top-0 left-0">
            <div class="h-full bg-green" :style="{ width: alert.progress + '%' }"></div>
        </div>
        <div class="wrapper w-full">
            <div class="left">
                <div :class="['alert-icon', 'icon-' + alert.type]">
                    <Icon icon="ExclamationMark" v-if="alert.type === 'danger'" width="15" height="15" />
                    <Icon icon="success" v-if="alert.type === 'success'" width="15" height="15" />
                    <Icon icon="ExclamationMark" v-if="alert.type === 'warning'" width="15" height="15" />
                    <Icon icon="info" v-if="alert.type === 'info'" width="15" height="15" />
                    <Icon icon="loading" v-if="alert.type === 'waiting'" width="15" height="15" />
                </div>
            </div>
            <div class="right overflow-auto">
                <div class="alert-title" :class="['alert-' + alert.type]">
                    <div v-if="!alert.options?.titleTrusted" :class="alert.type === 'waiting' ? 'loading' : ''">
                        {{ alert.title }}
                    </div>
                    <div v-else :class="alert.type === 'waiting' ? 'loading' : ''" v-html="alert.title"></div>

                    <div v-if="!isHistory" class="alert-close" @click="closeAlert()">
                        <Icon icon="close" height="11" width="11" />
                    </div>
                    <div v-if="isHistory" class="alert-close" @click="emit('close', alert)">
                        <Icon icon="delete" height="11" width="11" />
                    </div>
                </div>
                <p v-if="alert.message" :class="['alert-text', isExpanded ? 'expanded' : '', alertTextOverflown ? 'alert-text-show-more' : '']" ref="alertText">
                    <span v-if="!alert.options?.textTrusted" ref="alertTextMessage" class="alert-text-message">{{ alert.message }}</span>
                    <span v-else ref="alertTextMessage" class="alert-text-message no-tailwind" v-html="alert.message"></span>
                </p>
                <div :class="['alert-text-expand', 'text-' + alert.type]" v-if="alertTextOverflown" @click="isExpanded = !isExpanded">
                    {{ isExpanded ? "Skrýt" : "Zobrazit více" }}
                </div>
                <div class="alert-data" v-if="alert.areDataShown">
                    <div v-if="alert.areDataShown" class="alert-data-block">
                        <div class="alert-data-header">
                            <div class="alert-data-title">
                                <h4 class="alert-data-title">Data</h4>
                            </div>
                            <div class="alert-data-copy" @click="copyDataToClipboard(alert.data)">
                                <!-- předělat na cdb icon -->
                                <Icon icon="copy" class="copy-image" height="11" width="11" />
                            </div>
                            <div class="alert-data-remove" @click="alert.toggleData">
                                <Icon icon="close" class="copy-image" height="11" width="11" />
                            </div>
                        </div>

                        <div class="alert-data-content">
                            <div class="json-tree">
                                <AlertData :data="alert.data" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--        <div class="alert-footer">-->
        <!--          <div class="alert-timestamp">-->
        <!--&lt;!&ndash;            {{ alert.createdAt }}&ndash;&gt;-->
        <!--          </div>-->
        <!--          <div v-if="!alert.areDataShown && alert.data" class="tooltip" @click="alert.toggleData">-->
        <!--            <Icon icon="help" width="11" height="11" />-->
        <!--            <span class="tooltiptext">Zobrazit data</span>-->
        <!--          </div>-->
        <!--        </div>-->
        <div v-if="!alert.areDataShown && alert.data" class="tooltip" @click="alert.toggleData">
            <Icon icon="help" width="11" height="11" />
            <span class="tooltiptext">Zobrazit data</span>
        </div>
        <div v-if="fade" :class="{ 'alert-timer': fade === 'startFade', ['alert-timer-' + alert.type]: true }"></div>
    </div>
</template>

<style scoped>
.alert {
    display: flex;
    flex-direction: column;
    position: relative;
    background: var(--color-dark);
    border-radius: 8px;
    padding: 14px 11px;
    margin: 5px;
    direction: ltr;
    pointer-events: all;
    min-height: 70px;
    width: 75%;
    flex-wrap: wrap !important;
    justify-content: space-between;
    overflow: hidden;

    box-shadow: 0 4px 31px -3px rgba(53, 70, 97, 0.25);

    .wrapper {
        display: flex;
    }

    .alert-title {
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        flex-direction: row;
        width: 100%;
        font-weight: 600;
        font-size: 14px;
        padding-bottom: 0;
        line-height: 20px;

        &.alert-success {
            color: var(--color-green);
        }

        &.alert-danger {
            color: var(--color-error);
        }

        &.alert-warning {
            color: var(--color-warning);
        }

        &.alert-info {
            color: var(--color-blue);
        }

        &.alert-waiting {
            color: var(--color-blue);
        }

        .loading:after {
            display: inline-block;
            animation: dotty steps(1, end) 1s infinite;
            content: "";
        }
    }

    .left {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .right {
        flex-grow: 1;
        padding-right: 20px;
    }

    .alert-icon {
        display: flex;
        padding: 8px;
        margin-right: 1rem;
        border-radius: 100px;

        &.icon-success {
            background: color-mix(in srgb, var(--color-green) 20%, transparent);
            color: var(--color-green);
        }

        &.icon-danger {
            background: color-mix(in srgb, var(--color-error) 20%, transparent);
            color: var(--color-error);
        }

        &.icon-warning {
            background: color-mix(in srgb, var(--color-warning) 20%, transparent);
            color: var(--color-warning);
        }

        &.icon-info {
            background: color-mix(in srgb, var(--color-blue) 20%, transparent);
            color: var(--color-blue);
        }

        &.icon-waiting {
            background: color-mix(in srgb, var(--color-blue) 20%, transparent);
            color: var(--color-blue);
        }
    }

    .alert-text {
        color: var(--color-white);
        font-size: 12px;
        font-weight: 500;
        margin-top: 3px;
        line-height: 20px;
        margin-bottom: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }

    .alert-text-expand {
        font-weight: 500;
        cursor: pointer;
        padding-top: 2px;
        font-size: 12px;

        &.text-success {
            color: #24c586;
        }

        &.text-warning {
            color: #ff9900;
        }

        &.text-waiting {
            color: #52ff00;
        }

        &.text-danger {
            color: #f00;
        }

        &.text-info {
            color: #8898a7;
        }

        &:hover {
            text-decoration: underline;
            text-underline: black;
        }
    }

    .expanded {
        -webkit-line-clamp: unset; /* Remove the line clamping */
        max-height: none; /* Remove the height restriction */
        overflow: visible;
    }

    .alert-data {
        padding-top: 8px;
        margin-top: auto;
        text-align: right;

        .alert-data-block {
            display: block;
            margin-top: 5px;
            text-align: left;
            background: var(--color-dark-bg);
            color: white;
            padding: 5px 0;
            border-radius: 5px;
            overflow: hidden; /* Prevents overflow */
            word-wrap: normal; /* Ensures long words break */
            word-break: normal;

            .alert-data-content {
                max-height: 235px;
                overflow: auto;

                .json-tree {
                    font-family: monospace;
                    /* Breaks long words at any character */
                }
            }
        }

        .alert-data-header {
            display: flex;
            flex-direction: row;
            .alert-data-title {
                margin: 5px 0;
                padding: 0 5px;
            }

            .alert-data-copy {
                margin-left: auto;
                cursor: pointer;
                padding-right: 5px;

                .copy-image {
                    margin-top: 8px;
                    margin-right: 8px;
                    vertical-align: middle;
                    color: var(--color-medium);

                    &:hover {
                        color: var(--color-light);
                    }
                }
            }

            .alert-data-remove {
                cursor: pointer;
                padding-right: 5px;

                .copy-image {
                    margin-top: 8px;
                    margin-right: 8px;
                    vertical-align: middle;
                    color: var(--color-medium);

                    &:hover {
                        color: var(--color-light);
                    }
                }
            }
        }
    }

    .alert-footer {
        padding-top: 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        align-content: end;
        color: var(--color-medium);
        align-items: center;
        width: 100%;
        position: absolute;
        bottom: 11px;
    }

    .alert-timestamp {
        font-weight: 500;
        font-size: 11px;
        text-align: right;
        color: var(--color-medium);
    }

    &.alert-success {
        background: linear-gradient(195deg, rgba(11, 18, 29, 0) 57%, var(--color-green, rgba(36, 197, 134, 0.2)) 220%), var(--color-dark, #152234);
    }

    &.alert-warning {
        background: linear-gradient(195deg, rgba(11, 18, 29, 0) 57%, var(--color-warning, rgba(36, 197, 134, 0.2)) 220%), var(--color-dark, #152234);
    }

    &.alert-danger {
        background: linear-gradient(195deg, rgba(11, 18, 29, 0) 57%, var(--color-error, rgba(36, 197, 134, 0.2)) 220%), var(--color-dark, #152234);
    }

    &.alert-waiting {
        background: linear-gradient(195deg, rgba(11, 18, 29, 0) 57%, var(--color-blue, rgba(36, 197, 134, 0.2)) 220%), var(--color-dark, #152234);
    }

    &.alert-info {
        background: linear-gradient(195deg, rgba(11, 18, 29, 0) 57%, var(--color-blue, rgba(36, 197, 134, 0.2)) 220%), var(--color-dark, #152234);
    }

    .alert-close {
        position: absolute;
        right: 12px;
        top: 11px;
        margin-left: auto;
        cursor: pointer;
        color: var(--color-medium);

        &:hover {
            color: var(--color-light);
        }
    }

    &.fade {
        visibility: hidden;
        opacity: 0;
        transition:
            visibility 0s 0.5s,
            opacity 0.5s linear;
    }

    .alert-timer {
        border-radius: 0 0 0 8px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background-color: darkgray; /* Change the color as needed */
        animation: timer 5s linear forwards;

        &.alert-timer-success {
            background-color: var(--color-green);
        }

        &.alert-timer-warning {
            background-color: var(--color-warning);
        }

        &.alert-timer-danger {
            background-color: var(--color-error);
        }

        &.alert-timer-waiting {
            background-color: var(--color-blue);
        }

        &.alert-timer-info {
            background-color: var(--color-blue);
        }
    }

    /* Tooltip container */
    .tooltip {
        position: absolute;
        right: 11px;
        bottom: 11px;
        display: inline-block;
        cursor: pointer;
        color: var(--color-medium);

        &:hover {
            color: var(--color-light);
        }
    }

    /* Tooltip text */
    .tooltip .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;
        font-size: 14px;

        /* Position the tooltip text - see examples below! */
        position: absolute;
        z-index: 1;
        bottom: 100%;
        left: 50%;
        margin-left: -100px; /* Use half of the width (120/2 = 60), to center the tooltip */
        margin-bottom: 5px;
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip:hover .tooltiptext {
        visibility: visible;
    }
}

@keyframes timer {
    from {
        width: 100%;
    }
    to {
        width: 0px;
    }
}

@keyframes ellipsis {
    to {
        width: 40px;
    }
}

@-webkit-keyframes ellipsis {
    to {
        width: 40px;
    }
}

@keyframes dotty {
    0% {
        content: "";
    }
    25% {
        content: ".";
    }
    50% {
        content: "..";
    }
    75% {
        content: "...";
    }
    100% {
        content: "";
    }
}
</style>
