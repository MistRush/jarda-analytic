<script setup>
    import {computed} from "vue";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useTranslations} from "@/Composables/useTranslation.js";

    import Tooltip from "@/Components/Other/Tooltip.vue";

    const props = defineProps({
        config: Object,
        subTask: Object,
    });

    const {translations} = useTranslations();
    const modalStore = useModalStore(window.pinia);
    const dashboardStore = useDashboardStore(window.pinia);

    const userIsAdmin = computed(() => {
        return props.config.permissions.includes('admin');
    });

    const userIsAuthor = computed(() => {
        return userIsAdmin.value || props.config.currentUser == props.subTask.author?.id || props.config.currentUserSubUsers.includes(props.subTask.author?.id)
    });

    const dateStartString = computed(() => {
        if(!props.subTask.dateStart)
            return '';

        const dateParts = props.subTask.dateStart.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    });

    const dateDeadlineString = computed(() => {
        if(!props.subTask.dateDeadline)
            return '';

        const dateParts = props.subTask.dateDeadline.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    });

    const dateUpdatedString = computed(() => {
        if(!props.subTask.dateUpdated)
            return '';

        const dateParts = props.subTask.dateUpdated.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        const now = new Date();
        const difference = now.getTime() - date.getTime();
        return Math.round(difference / (1000 * 60 * 60 * 24)) + ' dní';
    });

    const stateClass = computed(() => {
        return {
            'light-green': props.subTask.state === dashboardStore.states?.new.value || props.subTask.state === dashboardStore.states?.solutionRuns.value || props.subTask.state === dashboardStore.states?.onHold.value || props.subTask.state === dashboardStore.states?.amended.value,
            'green': props.subTask.state === dashboardStore.states?.completed.value,
            'yellow': props.subTask.state === dashboardStore.states?.awaitingApproval.value,
            'red': props.subTask.state === dashboardStore.states?.canceled.value,
        }
    });

    const statesTranslated = {
        [dashboardStore.states?.new.value]: dashboardStore.states?.new.name,
        [dashboardStore.states?.onHold.value]: dashboardStore.states?.onHold.name,
        [dashboardStore.states?.amended.value]: dashboardStore.states?.amended.name,
        [dashboardStore.states?.solutionRuns.value]: dashboardStore.states?.solutionRuns.name,
        [dashboardStore.states?.awaitingApproval.value]: dashboardStore.states?.awaitingApproval.name,
        [dashboardStore.states?.completed.value]: dashboardStore.states?.completed.name,
        [dashboardStore.states?.canceled.value]: dashboardStore.states?.canceled.name,
    }

    const priorityMap = {
        [dashboardStore.priorities?.low.value]: 'low',
        [dashboardStore.priorities?.medium.value]: 'medium',
        [dashboardStore.priorities?.high.value]: 'high',
    };

    async function deleteTask() {
        if(!confirm(translations.CONFIRM_DELETE_TASK))
            return;

        await dashboardStore.deleteTask(props.config.endpoints.updateTask, props.subTask);
    }

    async function markCompleted() {
        await dashboardStore.completeTask(props.config.endpoints.updateTask, props.subTask);
    }

    function toggleActive() {
        const modal = modalStore.openedModalsByType['task-detail'].find(modal => modal.id === props.subTask.id);
        if(modal) {
            if(modal.minimized)
                modalStore.maximizeModal('task-detail', props.subTask.id);
            else modalStore.closeModal(props.subTask.id);
        } else modalStore.openModal('task-detail', props.subTask.id, props.subTask);
    }
</script>

<template>
    <div class="sub-task" @click.stop="toggleActive" :class="{ 'loading': subTask.loading }">
        <div class="actions">
            <Tooltip v-if="userIsAuthor" :text="translations.MARK_COMPLETE">
                <Icon icon="checkmark-circle" :width="16" :height="16" color="#36557F" @click.stop="markCompleted" />
            </Tooltip>
            <Tooltip v-if="userIsAuthor" :text="translations.MARK_DELETE">
                <Icon icon="delete" :width="16" :height="16" color="#36557F" @click.stop="deleteTask" />
            </Tooltip>
        </div>
        <div class="priority" :class="priorityMap[subTask.priority]">
            <div class="priority-point" />
            <div class="priority-point" />
            <div class="priority-point" />
        </div>
        <div class="error-reporting">
            <Icon icon="exclamation-mark" v-show="subTask.errorFlag" color="#e22" />
        </div>
        <div class="title">{{ subTask.title }}</div>
        <Tooltip class="solver" :text="translations.SOLVER">
            <Icon icon="user-photo" color="#36557F" :width="24" :height="24" :photo-path="subTask.solver?.icon" />
            <div class="name">{{ subTask.solver?.name }}</div>
        </Tooltip>
        <Tooltip class="date-start" :text="translations.DATE_START">
            <Icon icon="clock-arrow" v-if="dateStartString !== ''" color="#36557F" :width="16" :height="16"/>
            <div>{{ dateStartString }}</div>
        </Tooltip>
        <Tooltip class="date-deadline" :text="translations.DATE_DEADLINE">
            <Icon icon="calendar-checkmark" v-if="dateDeadlineString !== ''" color="#36557F" :width="16" :height="16"/>
            <div>{{ dateDeadlineString }}</div>
        </Tooltip>
        <div class="state-container">
            <div class="state" :class="stateClass">
                {{ statesTranslated[subTask.state] ?? subTask.state }}
            </div>
            <div>{{ dateUpdatedString }}</div>
        </div>
    </div>
</template>

<style scoped>
    .sub-task {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 4px 4px 0;
        cursor: pointer;
        border-bottom: 1px solid #DCE5F7;
        position: relative;
        font-size: 12px;

        &.loading {
            pointer-events: none;

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                content: "";
                height: 100%;
                width: 100%;
                backdrop-filter: blur(2px);
                z-index: 1;
                background: linear-gradient(90deg, transparent 20%, #24C58633 50%, transparent 80%);
                animation: sub-task-loading 1s linear infinite;
                background-size: 200% 100%;
            }
        }

        &:hover {
            background-color: #f0fcf4;
        }

        .actions {
            display: flex;
            align-items: center;
            gap: 2px;
        }

        .author, .solver, .date-start, .date-deadline, .state-container {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .priority {
            width: 4px;
            min-width: 4px;
            height: 21px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;

            .priority-point {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: #cde;
            }

            &.low {
                .priority-point:nth-child(3) {
                    background-color: #24C586;
                }
            }

            &.medium {
                .priority-point:nth-child(2), .priority-point:nth-child(3) {
                    background-color: #fb3;
                }
            }

            &.high {
                .priority-point {
                    background-color: #e22;
                }
            }
        }

        .error-reporting {
            width: 4px;
            min-width: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 250px;
        }

        .author, .solver {
            width: 120px;
            overflow: hidden;

            svg {
                min-width: 24px;
            }

            .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .date-start {
            margin-left: auto;
        }

        .date-start, .date-deadline {
            width: 110px;
        }

        .state-container {
            font-weight: 600;
            white-space: nowrap;

            .state {
                border-radius: 4px;
                padding: 0 6px;
                border: 1px solid #DCE5F7;
                background-color: #f7faff;
                color: #36557F;

                &.light-green {
                    border: 1px solid #24c586;
                    background-color: #dfd;
                    color: #24c586;
                }

                &.green {
                    border: 1px solid #24c586;
                    background-color: #24c586;
                    color: #fff;
                }

                &.yellow {
                    border: 1px solid #EFAD1F;
                    background-color: #fff1db;
                    color: #EFAD1F;
                }

                &.red {
                    border: 1px solid #e22;
                    background-color: #ffd4d4;
                    color: #e22;
                }
            }
        }
    }

    html.prefer-dark, html.dark-theme {
        .sub-task {
            border-bottom: 1px solid #152234;

            svg {
                color: #d5dbea !important;
            }

            &:hover {
                background-color: #2b3f5e;
            }

            .priority {
                .priority-point {
                    background-color: #d5dbea;
                }

                &.low {
                    .priority-point:nth-child(3) {
                        background-color: #24C586;
                    }
                }

                &.medium {
                    .priority-point:nth-child(2), .priority-point:nth-child(3) {
                        background-color: #fb3;
                    }
                }

                &.high {
                    .priority-point {
                        background-color: #e22;
                    }
                }
            }

            .state-container {
                .state {
                    border: 1px solid #152234;
                    background-color: #506485;
                    color: #d5dbea;

                    &.light-green {
                        border: 1px solid #24c586;
                        background-color: #596c59;
                        color: #24c586;
                    }

                    &.green {
                        border: 1px solid #24c586;
                        background-color: #24c586;
                        color: #fff;
                    }

                    &.yellow {
                        border: 1px solid #EFAD1F;
                        background-color: #837662;
                        color: #EFAD1F;
                    }

                    &.red {
                        border: 1px solid #e22;
                        background-color: #835e5e;
                        color: #e22;
                    }
                }
            }
        }
    }

    @keyframes sub-task-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>