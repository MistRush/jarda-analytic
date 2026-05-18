<script setup>
    import { ref, computed, onMounted, watch } from "vue";
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import {useTranslations} from "@/Composables/useTranslation.js";
    import { useSpeechRecognition } from '@vueuse/core'

    import Modal from "@/Components/Modal/Modal.vue";
    import Select from "@/Components/Inputs/Select.vue";
    import Checkbox from "@/Components/Inputs/Checkbox.vue";
    import TinyMCE from "@/Components/Inputs/TinyMCE.vue";
    import Radio from "@/Components/Inputs/Radio.vue";

    const props = defineProps({
        task: Object,
        currentUser: Number|String,
        endpoints: Object,
        states: Object,
        onHoldTypes: Object,
    });

    const {translations} = useTranslations();
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);
    const { isSupported, isListening, result, start, stop } = useSpeechRecognition({
        lang: 'cs-CZ',
        interimResults: true,
        continuous: true,
    });

    const onHoldOptions = [
        { value: dashboardStore.onHoldTypes?.missingAssignment.value, text: dashboardStore.onHoldTypes?.missingAssignment.name },
        { value: dashboardStore.onHoldTypes?.otherPriorities.value, text: dashboardStore.onHoldTypes?.otherPriorities.name },
    ];

    const stateOptions = [
        { value: dashboardStore.states?.new.value, text: dashboardStore.states?.new.name },
        { value: dashboardStore.states?.onHold.value, text: dashboardStore.states?.onHold.name },
        { value: dashboardStore.states?.amended.value, text: dashboardStore.states?.amended.name },
        { value: dashboardStore.states?.solutionRuns.value, text: dashboardStore.states?.solutionRuns.name },
        { value: dashboardStore.states?.awaitingApproval.value, text: dashboardStore.states?.awaitingApproval.name },
        { value: dashboardStore.states?.completed.value, text: dashboardStore.states?.completed.name },
    ];

    const isOnHold = computed(() => {
        return state.value === dashboardStore.states?.onHold.value;
    });

    const maximizeAction = {
        id: 'maximizeAction',
        tooltip: 'Maximize',
        icon: 'fullscreen',
        action: () => {
            toggleMaximize();
        }
    }

    const speechRecognitionAction = {
        id: 'speechRecognitionAction',
        tooltip: 'Speech recognition',
        icon: 'microphone',
        action: () => {
            toggleSpeechRecognition();
        }
    }

    const tinyMceActions = ref([]);
    const tinyMceMaximizedActions = ref([]);
    const tinyMceInitialize = ref(false);
    onMounted(() => {
       if(isSupported.value) {
           tinyMceActions.value = [maximizeAction, speechRecognitionAction];
           tinyMceMaximizedActions.value = [speechRecognitionAction];
       } else {
           tinyMceActions.value = [maximizeAction];
           tinyMceMaximizedActions.value = [];
       }

       tinyMceInitialize.value = true;
    });

    const fileInput = ref(null);
    const editorElement = ref(null);
    const state = ref(props.task.state);
    const sendEmail = ref(true);
    const content = ref('');
    const waitingFor = ref('author');
    const onHoldType = ref(dashboardStore.onHoldTypes?.missingAssignment.value);
    const files = ref([]);
    const isDragging = ref(false);
    const isUploading = ref(false);
    function handleDragOver() {
        isDragging.value = true;
    }

    function handleDragLeave(event) {
        if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) {
            return;
        }

        isDragging.value = false;
        isUploading.value = false;
    }

    function handleDrop(event) {
        isDragging.value = false;
        const droppedFiles = Array.from(event.dataTransfer.files);
        files.value = [...files.value, ...droppedFiles];
    }

    function handleFileSelect(event) {
        const selectedFiles = Array.from(event.target.files);
        files.value = [...files.value, ...selectedFiles];
        event.target.value = null;
    }

    function removeSelectedFile(index) {
        files.value.splice(index, 1);
    }

    function sendReply() {
        dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
            reply: {
                state: state.value,
                sendEmail: sendEmail.value,
                content: content.value,
                waitingFor: waitingFor.value,
                onHoldType: onHoldType.value,
                attachments: files.value,
                userId: props.currentUser
            },
            filterOut: state.value === dashboardStore.states?.completed.value || state.value === dashboardStore.states?.canceled.value,
        });
    }

    function toggleMaximize() {
        modalStore.openModal('task-reply', 'task-reply', {});
        const buttons = editorElement.value.$el.querySelectorAll('button');
        buttons.forEach(el => el.blur());
    }

    function toggleSpeechRecognition() {
        if(isListening.value)
            stop();
        else start();
    }

    watch(() => result.value, (newValue) => {
        if (newValue?.trim())
            content.value += ` ${newValue}`;
    });

    const isMobile = computed(() => {
        return screen.width <= 768;
    });

    const formVisible = ref(false)
</script>

<template>
    <div
        class="task-reply-form task-reply-form-drop-zone"
        :class="{ 'drop-zone-active': isDragging, 'loading': isUploading || task.loading }"
        @dragover.prevent.stop="handleDragOver"
        @dragleave.prevent.stop="handleDragLeave"
        @drop.prevent.stop="handleDrop"
    >
        <div class="show-form-button" @click="formVisible = !formVisible" v-if="isMobile">
            <Icon icon="chat-bubble" color="#36557F" :width="20" :height="20" />
            <span>Odpovědět</span>
        </div>
        <div class="task-reply-form-container" v-if="!isMobile || formVisible">
            <div class="task-reply-form-editor">
                <div class="is-listening-container" v-if="isSupported && isListening">
                    <div class="pulse-circle"></div>
                    <div>Naslouchám ...</div>
                </div>
                <TinyMCE v-if="tinyMceInitialize" :key="'small-editor-' + task.id" ref="editorElement" v-model="content" :compact="true" :custom-actions="tinyMceActions" :height="150" :placeholder="translations.ADD_REPLY" @ctrl-enter-shortcut-pressed="sendReply"/>
            </div>
            <div class="task-reply-form-column">
                <div class="task-reply-form-column-row">
                    <div>{{ translations.STATE }}:</div>
                    <Select size="small" class="state-select" :options="stateOptions" v-model="state" :placeholder="translations.STATE" font="realist" :required="true" />
                </div>
                <div v-if="isOnHold" class="task-reply-form-column-row">
                    <div>{{ translations.WAITING_FOR }}:</div>
                    <div style="display: flex; gap: 1rem">
                        <Radio size="small" class="task-filter-checkbox" v-model="waitingFor" :label="translations.WAITING_FOR_AUTHOR" :value="'author'" font="realist"/>
                        <Radio size="small" class="task-filter-checkbox" v-model="waitingFor" :label="translations.WAITING_FOR_SOLVER" :value="'solver'" font="realist"/>
                    </div>
                </div>
                <div v-if="isOnHold" class="task-reply-form-column-row">
                    <div>{{ translations.ON_HOLD_REASON }}:</div>
                    <Select size="small" :options="onHoldOptions" v-model="onHoldType" font="realist" :required="true" />
                </div>
                <div class="task-reply-form-column-row attachment-upload-area">
                    <Icon icon="upload" :width="16" :height="16" color="#24C586" />
                    <div v-if="!files.length" @click="fileInput.click()">{{  translations.CHOOSE_FILES }}</div>
                    <div v-else>
                        <span v-for="(file, index) in files" :key="index" class="selected-file" @click="removeSelectedFile(index)">{{ file.name }}<span v-if="index < files.length - 1">, </span></span>
                    </div>
                    <input
                        type="file"
                        multiple
                        class="file-input"
                        @change="handleFileSelect"
                        ref="fileInput"
                    />
                </div>
                <Checkbox size="small" v-model="sendEmail" :label="translations.SEND_EMAIL" />
                <div class="send-reply" @click="sendReply">
                    <div>{{ translations.SEND_REPLY }}</div>
                </div>
            </div>
            <Modal
                v-for="modal in modalStore.openedModalsByType['task-reply']"
                :isVisible="true"
                size="medium"
                @update:is-visible="modalStore.closeModal(modal.id)"
                :z-index="6000"
            >
                <template v-slot:header>
                    {{ translations.SEND_REPLY }}
                </template>
                <template v-slot:body>
                    <div
                        class="maximized-task-reply-form"
                        :class="{ 'drop-zone-active': isDragging, 'loading': isUploading || task.loading }"
                        @dragover.prevent="handleDragOver"
                        @dragleave.prevent="handleDragLeave"
                        @drop.prevent="handleDrop"
                    >
                        <div class="is-listening-container" v-if="isSupported && isListening">
                            <div class="pulse-circle"></div>
                            <div>Naslouchám ...</div>
                        </div>
                        <TinyMCE v-if="tinyMceInitialize" :key="'big-editor-' + task.id" ref="editorElement" v-model="content" :compact="true" :height="400" :custom-actions="tinyMceMaximizedActions" :placeholder="translations.ADD_REPLY" @ctrl-enter-shortcut-pressed="sendReply"/>
                        <div class="maximized-task-reply-form-row">
                            <div>{{ translations.STATE }}:</div>
                            <Select class="state-select" :options="stateOptions" v-model="state" :placeholder="translations.STATE" font="realist" :required="true" />
                        </div>
                        <div v-if="isOnHold" class="maximized-task-reply-form-row">
                            <div>{{ translations.WAITING_FOR }}:</div>
                            <div style="display: flex; gap: 1rem">
                                <Radio v-model="waitingFor" :label="translations.WAITING_FOR_AUTHOR" :value="'author'" font="realist"/>
                                <Radio v-model="waitingFor" :label="translations.WAITING_FOR_SOLVER" :value="'solver'" font="realist"/>
                            </div>
                        </div>
                        <div v-if="isOnHold" class="maximized-task-reply-form-row">
                            <div>{{ translations.ON_HOLD_REASON }}:</div>
                            <Select :options="onHoldOptions" v-model="onHoldType" font="realist" :required="true" />
                        </div>
                        <div class="maximized-task-reply-form-row attachment-upload-area">
                            <div v-if="!files.length" @click="fileInput.click()">{{ translations.CHOOSE_FILES }}</div>
                            <div v-else>
                                <span v-for="(file, index) in files" :key="index" class="selected-file" @click="removeSelectedFile(index)">{{ file.name }}<span v-if="index < files.length - 1">, </span></span>
                            </div>
                        </div>
                        <div class="maximized-task-reply-form-row">
                            <Checkbox class="right" v-model="sendEmail" :label="translations.SEND_EMAIL" />
                        </div>
                        <div class="send-reply" @click="sendReply">
                            <div>{{ translations.SEND_REPLY }}</div>
                        </div>
                    </div>
                </template>
            </Modal>
        </div>
    </div>
</template>

<style scoped>
    .task-reply-form {
        gap: 4px;
        font-size: 12px;
        padding: 8px 16px;
        position: relative;

        .show-form-button {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .task-reply-form-container {
            display: flex;
            align-items: start;
            justify-content: start;
            gap: 4px;
            width: 100%;

            @media(max-width: 768px) {
                flex-direction: column;

                .task-reply-form-editor {
                    width: 100%;
                }

                .task-reply-form-column {
                    width: 100%;
                }
            }
        }

        &.loading, &.drop-zone-active {
            overflow: hidden;
        }

        &.drop-zone-active:after {
            position: absolute;
            content: "";
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            background-color: #24C58644;
            border: 2px dashed #24C586;
            z-index: 6000;
        }

        &.loading:after {
            position: absolute;
            content: "";
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            backdrop-filter: blur(10px);
            background: linear-gradient(90deg, transparent 20%, #24C58633 50%, transparent 80%);
            animation: task-reply-loading 1s linear infinite;
            background-size: 200% 100%;
            z-index: 6000;
        }

        .task-reply-form-editor {
            flex-grow: 1;
        }

        .task-reply-form-column {
            flex-basis: 25%;
            display: flex;
            flex-direction: column;
            gap: 8px;
            height: 100%;

            .task-reply-form-column-row {
                & > div:first-child {
                    min-width: 50px;
                }

                display: flex;
                align-items: center;
                justify-content: start;
                gap: 8px;
            }
        }
    }

    .send-reply {
        font-size: 14px;
        flex-basis: auto;
        background-color: #24c586;
        color: #fff;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: auto;
    }

    .attachment-upload-area {
        display: flex;
        align-items: center;
        border: 1px dashed #24C586;
        border-radius: 8px;
        padding: 6px 16px;
        text-align: center;
        cursor: pointer;
        text-decoration: underline;
        font-weight: 500;
        background-color: #fff;

        .selected-file {
            text-decoration: none;
            font-weight: 400;
            cursor: pointer;

            &:hover {
                text-decoration: line-through;
            }
        }

        input {
            display: none
        }
    }

    .maximized-task-reply-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        position: relative;
        margin: -13px -28px;
        padding: 13px 28px;

        &.loading, &.drop-zone-active {
            overflow: hidden;
        }

        &.drop-zone-active:after {
            position: absolute;
            content: "";
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            background-color: #24C58644;
            border: 2px dashed #24C586;
        }

        &.loading:after {
            position: absolute;
            content: "";
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            backdrop-filter: blur(10px);
            background: linear-gradient(90deg, transparent 20%, #24C58633 50%, transparent 80%);
            animation: task-reply-loading 1s linear infinite;
            background-size: 200% 100%;
        }

        .right {
            margin-left: auto;
            width: fit-content;
        }

        .send-reply {
            margin-left: auto;
            width: 20%;
        }
    }

    .is-listening-container {
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: 600;
        color: #24C586;

        .pulse-circle {
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background-color: #e22;
            animation: pulse 1s infinite;
        }
    }

    html.prefer-dark, html.dark-theme {
        .attachment-upload-area {
            background-color: #2b3f5e;
        }

        .task-reply-form {
            .task-reply-form-editor {
                &:deep(.compact-editor) {
                    .tox-tinymce {
                        border: 1px solid #152234;
                    }
                }
            }

            .task-reply-form-column {
                .task-reply-form-column-row {
                    &:deep(.input-wrapper) {
                        border: 1px solid #2b3f5e;
                        background-color: #2b3f5e !important;
                        color: #d5dbea !important;

                        .input, svg {
                            color: #d5dbea !important;
                        }
                    }

                    &:deep(.input) {
                        background-color: #2b3f5e !important;
                    }
                }
            }
        }

        .maximized-task-reply-form:deep(.compact-editor) {
            .tox-tinymce {
                border: 1px solid #152234;
            }
        }

        .maximized-task-reply-form {
            .maximized-task-reply-form-row {
                &:deep(.input-wrapper) {
                    border: 1px solid #2b3f5e;
                    background-color: #2b3f5e !important;
                    color: #d5dbea !important;

                    .input, svg {
                        color: #d5dbea !important;
                    }
                }

                &:deep(.input) {
                    background-color: #2b3f5e !important;
                }
            }
        }
    }

    @keyframes task-reply-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>