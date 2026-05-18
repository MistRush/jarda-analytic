<script setup>
    import { computed } from "vue";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import axios from "axios";

    import Tooltip from '@/Components/Other/Tooltip.vue'
    import {useAlerts} from "@/Composables/useAlerts.js";

    const props = defineProps({
        config: Object,
        task: Object,
    });

    const modalStore = useModalStore(window.pinia);
    const alerts = useAlerts();

    const statesTranslated = {
        [props.config.states.new.value]: props.config.states.new.name,
        [props.config.states.onHold.value]: props.config.states.onHold.name,
        [props.config.states.amended.value]: props.config.states.amended.name,
        [props.config.states.solutionRuns.value]: props.config.states.solutionRuns.name,
        [props.config.states.awaitingApproval.value]: props.config.states.awaitingApproval.name,
        [props.config.states.completed.value]: props.config.states.completed.name,
        [props.config.states.canceled.value]: props.config.states.canceled.name,
    }

    const stateClass = computed(() => {
        return {
            'light-green': props.task.state === props.config.states.new.value || props.task.state === props.config.states.solutionRuns.value || props.task.state === props.config.states.onHold.value || props.task.state === props.config.states.amended.value,
            'green': props.task.state === props.config.states.completed.value,
            'yellow': props.task.state === props.config.states.awaitingApproval.value,
            'red': props.task.state === props.config.states.canceled.value,
        }
    });

    const allAttachments = computed(() => {
        const allAttachments = [];

        props.task.attachments?.forEach((attachment) => {
            allAttachments.push(attachment);
        });

        props.task.replies?.forEach((reply) => {
            reply.attachments.forEach((attachment) => {
                allAttachments.push(attachment);
            });
        });

        return allAttachments;
    });

    async function copyNumber() {
        await navigator.clipboard.writeText(props.task.number);
        alerts.alert(translations.COPY_TO_CLIPBOARD, 'success');
    }

    function downloadFile(attachmentId, attachmentName) {
        axios({
            method: 'post',
            url: props.config.endpoints.downloadAttachment,
            data: {
                ID: attachmentId,
            },
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(response => {
            if(response.status === 200) {
                const blob = new Blob([response.data]);
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = attachmentName;
                link.click();
                link.remove();
                window.URL.revokeObjectURL(blobUrl);
            } else {
                alerts.alert(translations.DOWNLOAD_FILE_ERROR, 'error');
            }
        }).catch(error => {
            alerts.alert(translations.DOWNLOAD_FILE_ERROR, 'error');
        });
    }

    function taskDetail() {
        const modal = modalStore.openedModalsByType['task-detail'].find(modal => modal.id === props.task.id);
        if(modal) {
            if(modal.minimized)
                modalStore.maximizeModal('task-detail', props.task.id);
            else modalStore.closeModal(props.task.id);
        } else modalStore.openModal('task-detail', props.task.id, props.task);
    }
</script>

<template>
    <div class="task-attachment">
        <div class="header">
            <div class="priority" :class="task.priority">
                <div class="priority-point"></div>
                <div class="priority-point"></div>
                <div class="priority-point"></div>
            </div>
            <Tooltip :text="task.author?.name" class="author">
                {{ task.author?.initials }}
            </Tooltip>
            <Tooltip :text="task.solver?.name" class="solver">
                {{ task.solver?.initials }}
            </Tooltip>
            <div class="number" @click="copyNumber">
                <Icon icon="copy" :width="16" :height="16" color="black" />
                {{ task.number }}
            </div>
            <div class="state" :class="stateClass">{{ statesTranslated[state] ?? '' }}</div>
            <div class="title" @click="taskDetail">{{ task.title }}</div>
        </div>
        <div class="content">
            <div class="attachment-container">
                <div class="attachment-container-title">{{ translations.LINKS }}:</div>
                <div class="links">
                    <div class="link" v-for="link in task.links">
                        <a target="_blank" :href="link">{{ link }}</a>
                    </div>
                </div>
            </div>
            <div class="attachment-container">
                <div class="attachment-container-title">{{ translations.ATTACHMENTS }}:</div>
                <div class="files">
                    <div class="file" v-for="attachment in allAttachments" @click.stop="downloadFile(attachment.id, attachment.name)">
                        <Icon icon="file" :width="16" :height="16" color="#000" />
                        <div class="file-name">{{ attachment.name }}</div>
                        <div class="file-size">{{ attachment.fileSize > 1000000 ? ((Math.round(attachment.fileSize / 100000) / 10) + ' MB') : ((Math.round(attachment.fileSize / 100) / 10) + ' kB') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .task-attachment {
        background-color: #fff;
        border: 1px solid #cde;
        border-radius: .25rem;
        padding: .25rem .5rem;

        &:not(:last-child) {
            margin-bottom: .25rem;
        }

        .header {
            display: flex;
            align-items: center;
            gap: .5rem;

            .priority {
                width: .25rem;
                min-width: .25rem;
                height: 21px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;

                .priority-point {
                    width: .25rem;
                    height: .25rem;
                    border-radius: 50%;
                    background-color: #cde;
                }

                &.low {
                    .priority-point:nth-child(3) {
                        background-color: #24C586;
                    }
                }

                &.medium {
                    .priority-point:nth-child(3), .priority-point:nth-child(2) {
                        background-color: #fb3;
                    }
                }

                &.high {
                    .priority-point {
                        background-color: #e22;
                    }
                }
            }

            .author {
                color: #24C586;
                font-weight: 600;
            }

            .solver {
                color: #16f;
                font-weight: 600;
            }

            .number {
                font-weight: 600;
                display: flex;
                align-items: center;
                cursor: pointer;
            }

            .state {
                padding: 0 .5rem;
                border-radius: .5rem;
                color: #fff;

                &.light-green {
                    background-color: #dfd;
                    color: #24c586;
                }

                &.green {
                    background-color: #24c586;
                }

                &.yellow {
                    background-color: #fb3;
                }

                &.red {
                    background-color: #e22;
                }
            }

            .title {
                cursor: pointer;
            }
        }

        .content {
            display: flex;
            justify-content: space-between;
            gap: 1rem;

            .attachment-container {
                flex-basis: 50%;

                .attachment-container-title {
                    font-weight: 600;
                    border-bottom: 1px solid #cde;
                    margin-bottom: .25rem;
                }

                a {
                    color: #26e;
                }

                .files {
                    display: flex;
                    flex-wrap: wrap;
                    gap: .25rem;

                    .file {
                        width: fit-content;
                        display: flex;
                        gap: 1rem;
                        align-items: center;
                        border: 1px solid #cde;
                        border-radius: .25rem;
                        padding: .125rem .25rem;
                        cursor: pointer;

                        &:hover {
                            background-color: #cde;
                        }

                        .file-size {
                            color: #abd;
                        }
                    }
                }
            }
        }
    }
</style>