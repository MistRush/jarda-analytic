<script setup>
    import {computed} from 'vue';
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import { useTranslations } from "@/Composables/useTranslation.js";
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore.js";
    import Tooltip from "@/Components/Other/Tooltip.vue";
    import {useHelper} from "@/Composables/useHelper.js";

    const props = defineProps({
        config: Object,
        task: Object
    });

    const { translations } = useTranslations();
    const modalStore = useModalStore(window.pinia);
    const dashboardStore = useDashboardStore(window.pinia);
    const helper = useHelper();

    const dateCreatedString = computed(() => {
        if(!props.task.dateCreated)
            return '';

        const dateParts = props.task.dateCreated.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    });

    const dateUpdatedString = computed(() => {
        if(!props.task.dateUpdated)
            return '';

        const dateParts = props.task.dateUpdated.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    });

    const dateUpdatedDays = computed(() => {
        if(!props.task.dateUpdated)
            return null;

        const dateParts = props.task.dateUpdated.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        const days = (new Date()).getTime() - date.getTime();

        return Math.round(days / (1000 * 60 * 60 * 24));
    });

    const expectedReturnString = computed(() => {
        let tooltip = '';
        if(props.task.expectedReturnFinance && props.task.expectedReturnFinance > 0) {
            tooltip += '<div>' + helper.numberFormat(props.task.expectedReturnFinance, 0, ',', ' ') + ' kč</div>';
        }

        if(props.task.expectedReturn && props.task.expectedReturn.length > 0) {
            tooltip += '<div>' + props.task.expectedReturn + '</div>';
        }

        return tooltip;
    });

    const expectedReturnColor = computed(() => {
        if(props.task.expectedHours >= 20 && ((!props.task.expectedReturnFinance || props.task.expectedReturnFinance <= 0) && (!props.task.expectedReturn || props.task.expectedReturn.length === 0))) {
            return '#e22';
        }

        if(props.task.expectedReturnFinance && props.task.expectedReturnFinance > 0) {
            if(props.task.expectedReturnFinance >= 500000)
                return '#24C586';
            else if(props.task.expectedReturnFinance >= 100000)
                return '#8ae0be';
            else return '#a6e3cb';
        }

        return '#abd';
    });

    function toggleActive() {
        const modal = modalStore.openedModalsByType['task-detail'].find(modal => modal.id === props.task.id);
        if(modal) {
            if(modal.minimized)
                modalStore.maximizeModal('task-detail', props.task.id);
            else modalStore.closeModal(props.task.id);
        } else modalStore.openModal('task-detail', props.task.id, props.task);
    }
</script>

<template>
    <div v-show="task.isVisible" class="kanban-item" :class="{ 'loading': task.loading }">
        <div class="kanban-item-header" @click="toggleActive">
            <Icon icon="drag" v-if="!config.permissions.includes('disableReorder')" class="kanban-item-header-icon kanban-item-drag-handle" :width="16" :height="16" color="#DCE5F7" />
            <Tooltip class="kanban-item-author" :text="translations.AUTHOR + ': ' + task.author?.name">{{ task.author?.initials }}</Tooltip>
            <Tooltip class="kanban-item-title" :class="{ 'bold': task.priorityFlag }" :text="task.title">{{ task.title }}</Tooltip>
            <Tooltip v-if="config.allowedFeatures.includes('expectedReturn') && ((task.expectedReturn && task.expectedReturn.length > 0) || task.expectedReturnFinance > 0)" :html="true" :text="expectedReturnString" >
                <Icon icon="euro" :width="16" :height="16" :color="expectedReturnColor" />
            </Tooltip>
            <div v-if="task.expectedHours > 0" class="expected-hours">
                {{ task.expectedHours }}h
            </div>
            <div class="feedback-replies">
                <Icon icon="chat-bubble" color="#24C586" />
                <div class="reply-count">{{ task.replies.length }}</div>
            </div>
        </div>
        <div class="kanban-item-content">
            <div class="kanban-item-priority">
                <div class="priority-point" :class="task.priority === dashboardStore.priorities?.high.value ? 'red' : ''" />
                <div class="priority-point" :class="task.priority === dashboardStore.priorities?.high.value ? 'red' : (task.priority === dashboardStore.priorities?.medium.value ? 'yellow' : '')" />
                <div class="priority-point" :class="task.priority === dashboardStore.priorities?.high.value ? 'red' : (task.priority === dashboardStore.priorities?.medium.value ? 'yellow' : (task.priority === dashboardStore.priorities?.low.value ? 'green' : ''))" />
            </div>
            <div class="kanban-item-users">
                <Tooltip :text="translations.SOLVER + ': ' + task.solver?.name">
                    <Icon icon="user-photo" color="#9BE3C7" :width="28" :height="28" :photo-path="task.solver?.icon" />
                </Tooltip>
                <Tooltip v-for="otherSolver in task.otherSolvers" :text="otherSolver.name">
                    <Icon icon="user-photo" color="#DCE5F7" :width="20" :height="20" :photo-path="otherSolver.icon" />
                </Tooltip>
            </div>
            <Tooltip v-if="task.dateCreated" class="kanban-item-content-date-created" :text="translations.DATE_CREATED">
                {{ dateCreatedString }}
            </Tooltip>
            <Tooltip v-if="task.dateUpdated" class="kanban-item-content-date-updated" :text="translations.DATE_UPDATED">
                {{ dateUpdatedString }}
            </Tooltip>
            <Tooltip v-if="task.dateUpdated" class="kanban-item-content-date-state" :text="'V tomto stavu již ' + dateUpdatedDays + ' dní'">
                <Icon icon="clock" :width="12" :height="12" color="#abd" />
            </Tooltip>
        </div>
    </div>
</template>

<style scoped>
    .kanban-item {
        display: flex;
        flex-direction: column;
        border: 1px solid #DCE5F7;
        border-radius: .25rem;
        background-color: #fff;
        padding: .25rem .5rem;
        gap: .25rem;
        position: relative;

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
                animation: kanban-task-loading 1s linear infinite;
                background-size: 200% 100%;
            }
        }

        .kanban-item-header {
            display: flex;
            align-items: center;
            gap: .25rem;
            padding-bottom: .25rem;
            border-bottom: 1px dashed #DCE5F7;
            cursor: pointer;

            .kanban-item-header-icon {
                min-width: 1rem;
            }

            .kanban-item-drag-handle {
                cursor: grab;
                transform: rotate(90deg);

                &:active {
                    cursor: grabbing;
                }
            }

            .kanban-item-author {
                font-weight: 600;
                color: #24C586;
            }

            .kanban-item-title {
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                &.bold {
                    font-weight: 700;
                }
            }

            .expected-hours {
                font-weight: 500;
                color: #16f;
                height: 18px;
            }

            .feedback-replies {
                width: 1rem;
                min-width: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                .reply-count {
                    font-weight: normal;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: .75rem;
                    color: #fff;
                }
            }
        }

        .kanban-item-content {
            display: flex;
            align-items: end;
            justify-content: start;
            gap: .5rem;

            .kanban-item-users {
                display: flex;
                align-items: end;
                gap: .125rem;
                overflow: hidden;
                flex-shrink: 1;
            }

            .kanban-item-content-date-created {
                margin-left: auto;
                white-space: nowrap;
                font-size: .75rem;
                color: #24C586;
            }

            .kanban-item-content-date-updated {
                white-space: nowrap;
                font-weight: 600;
                color: #A3B8E8;
            }

            .kanban-item-content-date-state {
                margin: 0 -.25rem .125rem -.25rem;
            }

            .kanban-item-priority {
                width: .25rem;
                min-width: .25rem;
                height: 21px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                align-self: center;

                .priority-point {
                    width: .25rem;
                    height: .25rem;
                    border-radius: 50%;
                    background-color: #cde;

                    &.green {
                        background-color: #24C586;
                    }

                    &.yellow {
                        background-color: #fb3;
                    }

                    &.red {
                        background-color: #e22;
                    }
                }
            }
        }
    }

    @keyframes kanban-task-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>