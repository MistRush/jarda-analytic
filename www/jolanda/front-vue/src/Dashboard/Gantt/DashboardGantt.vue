<script setup>
    import { ref, computed } from 'vue';
    import { useDashboardStore } from '@/Dashboard/stores/dashboardStore.js';
    import { useModalStore } from '@/Dashboard/stores/modalStore.js';
    import GanttChart from '@/Components/Other/GanttChart.vue';
    import Tooltip from '@/Components/Other/Tooltip.vue';
    import {useAlerts} from "@/Composables/useAlerts.js";

    const props = defineProps({
        config: Object,
        panel: String|Number,
    });

    const emit = defineEmits(['close']);
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);
    const alerts = useAlerts();

    const statesTranslated = {
        [dashboardStore.states?.new.value]: dashboardStore.states?.new.name,
        [dashboardStore.states?.onHold.value]: dashboardStore.states?.onHold.name,
        [dashboardStore.states?.amended.value]: dashboardStore.states?.amended.name,
        [dashboardStore.states?.solutionRuns.value]: dashboardStore.states?.solutionRuns.name,
        [dashboardStore.states?.awaitingApproval.value]: dashboardStore.states?.awaitingApproval.name,
        [dashboardStore.states?.completed.value]: dashboardStore.states?.completed.name,
        [dashboardStore.states?.canceled.value]: dashboardStore.states?.canceled.name,
    }

    const stateClass = {
        [dashboardStore.states?.new.value]: 'light-green',
        [dashboardStore.states?.solutionRuns.value]: 'blue',
        [dashboardStore.states?.onHold.value]: 'grey',
        [dashboardStore.states?.amended.value]: 'purple',
        [dashboardStore.states?.completed.value]: 'green',
        [dashboardStore.states?.awaitingApproval.value]: 'yellow',
        [dashboardStore.states?.canceled.value]: 'red',
    };

    const prioritiesTranslated = {
        [dashboardStore.priorities?.low.value]: dashboardStore.priorities?.low.name,
        [dashboardStore.priorities?.medium.value]: dashboardStore.priorities?.medium.name,
        [dashboardStore.priorities?.high.value]: dashboardStore.priorities?.high.name,
    }

    const priorityClass = {
        [dashboardStore.priorities?.low.value]: 'low',
        [dashboardStore.priorities?.medium.value]: 'medium',
        [dashboardStore.priorities?.high.value]: 'high',
    };

    const ganttItems = computed(() => {
       const panel = dashboardStore.dashboardPanels.find(p => p.id === props.panel);
       if(!panel)
           return [];

       const tasks = panel.taskLists?.reduce((tasks, taskList) => {
           return tasks.concat(taskList.tasks);
       }, []);

       const items = tasks.map(task => {
           const dateFromParts = (task.dateStart ?? task.dateCreated).split('-');
           const dateFrom = new Date(parseInt(dateFromParts[0], 10), parseInt(dateFromParts[1], 10) - 1, parseInt(dateFromParts[2], 10));
           const dateFromString = `${dateFrom.getDate()}. ${dateFrom.getMonth() + 1}. ${dateFrom.getFullYear()}`;

           const dateToParts = (task.dateDeadline ?? (task.dateStart ?? task.dateCreated)).split('-');
           const dateTo = new Date(parseInt(dateToParts[0], 10), parseInt(dateToParts[1], 10) - 1, parseInt(dateToParts[2], 10));
           const dateToString = `${dateTo.getDate()}. ${dateTo.getMonth() + 1}. ${dateTo.getFullYear()}`;

           return {
               ...task,
               dateFrom: task.dateStart ?? task.dateCreated,
               dateTo: task.dateDeadline ?? (task.dateStart ?? task.dateCreated),
               name: task.number,
               group: { id: task.id, name: task.title },
               dateFromString: dateFromString,
               dateToString: dateToString
           }
       });

       const itemsWithSubTasks = [];
       items.forEach(item => {
           const subTasks = dashboardStore.dashboardSubTasks?.filter((subTask) => subTask.parentTaskId === item.id);
           if(subTasks) {
               subTasks.forEach(subTask => {
                   const dateFromParts = (subTask.dateStart ?? subTask.dateCreated).split('-');
                   const dateFrom = new Date(parseInt(dateFromParts[0], 10), parseInt(dateFromParts[1], 10) - 1, parseInt(dateFromParts[2], 10));
                   const dateFromString = `${dateFrom.getDate()}. ${dateFrom.getMonth() + 1}. ${dateFrom.getFullYear()}`;

                   const dateToParts = (subTask.dateDeadline ?? (subTask.dateStart ?? subTask.dateCreated)).split('-');
                   const dateTo = new Date(parseInt(dateToParts[0], 10), parseInt(dateToParts[1], 10) - 1, parseInt(dateToParts[2], 10));
                   const dateToString = `${dateTo.getDate()}. ${dateTo.getMonth() + 1}. ${dateTo.getFullYear()}`;

                   itemsWithSubTasks.push({
                       ...subTask,
                       dateFrom: subTask.dateStart ?? subTask.dateCreated,
                       dateTo: subTask.dateDeadline ?? (subTask.dateStart ?? subTask.dateCreated),
                       name: subTask.number,
                       group: { id: item.id, name: item.title },
                       dateFromString: dateFromString,
                       dateToString: dateToString
                   });

                   if(!item.requirements)
                       item.requirements = [];

                   item.requirements.push(subTask.id);
               });

               itemsWithSubTasks.push(item);
           }
       });

       return itemsWithSubTasks;
    });

    const updatingId = ref(null);
    function updateItem(updatedItem, onUpdateFinish) {
        updatingId.value = updatedItem.id;
        const subTask = dashboardStore.dashboardSubTasks.find(st => st.id === updatedItem.id);
        if(subTask) {
            const update = {
                id: subTask.id,
            };

            if (subTask.dateStart !== updatedItem.dateFrom)
                update.dateStart = updatedItem.dateFrom;

            if (subTask.dateDeadline !== updatedItem.dateTo)
                update.dateDeadline = updatedItem.dateTo;

            dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, subTask, update);
        } else {
            const panel = dashboardStore.dashboardPanels.find(p => p.id === props.panel);
            if (panel) {
                const taskList = panel.taskLists.find(tl => tl.id === updatedItem.taskListId);
                if (taskList) {
                    const task = taskList.tasks.find(t => t.id === updatedItem.id);
                    if (task) {
                        const update = {
                            id: task.id,
                        };

                        if (task.dateStart !== updatedItem.dateFrom)
                            update.dateStart = updatedItem.dateFrom;

                        if (task.dateDeadline !== updatedItem.dateTo)
                            update.dateDeadline = updatedItem.dateTo;

                        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, task, update);
                    }
                }
            }
        }

        updatingId.value = null;
        onUpdateFinish();
    }

    async function copy(text) {
        await navigator.clipboard.writeText(text);
        alerts.alert(translations.COPY_TO_CLIPBOARD, 'success');
    }

    function toggleModal(taskId) {
        const modal = modalStore.openedModalsByType['task-detail'].find(modal => modal.id === taskId);
        if(modal) {
            if(modal.minimized)
                modalStore.maximizeModal('task-detail', taskId);
            else modalStore.closeModal(taskId);
        } else {
            let taskObj = null;
            dashboardStore.dashboardPanels?.forEach((panel) => {
                if(taskObj)
                    return;

                panel.taskLists.forEach((taskList) => {
                    if(taskObj)
                        return;

                    taskObj = taskList.tasks.find((task) => task.id == taskId);
                });
            });

            if(!taskObj)
                taskObj = dashboardStore.dashboardSubTasks?.find((task) => task.id == taskId);

            if(taskObj)
                modalStore.openModal('task-detail', taskId, taskObj);
        }
    }
</script>

<template>
    <div class="dashboard-gantt">
        <div class="gantt-header">
            <Icon icon="arrow" class="close-gantt" color="#000" :width="20" :height="20" direction="left" @click="emit('close')" />
        </div>
        <GanttChart
            class="gantt"
            :items="ganttItems"
            :height="700"
            :use-groups="true"
            @update-item="updateItem"
        >
            <template #block="{ item }">
                <div class="dashboard-gantt-block" :class="{ loading: item.id === updatingId }">
                    <div class="header">
                        <div class="title" @click="copy(item.name)" style="cursor: pointer">
                            <Icon icon="copy" :width="16" :height="16" color="#152234" />
                            <div>{{ item.name }}</div>
                        </div>
                        <Tooltip class="sub-title" :text="item.title">{{ item.title }}</Tooltip>
                        <div class="right">
                            <div class="expected-hours">{{ item.expectedHours }}h</div>
                            <div class="percent-progress">{{ item.percentProgress }}%</div>
                            <Icon icon="search" @click.stop="toggleModal(item.id)" style="cursor: pointer" :width="12" :height="12" color="#152234" />
                        </div>
                    </div>
                    <div class="content">
                        <div class="dates">
                            <Icon icon="calendar" color="#36557F" :width="12" :height="12" />
                            <div class="date-created">{{ item.dateFromString }}</div>
                            <div>-</div>
                            <div class="date-end">{{ item.dateToString }}</div>
                        </div>
                        <div class="right">
                            <div class="priority" :class="priorityClass[item.priority]">
                                {{ prioritiesTranslated[item.priority] }}
                            </div>
                            <div class="state" :class="stateClass[item.state]">
                                {{ statesTranslated[item.state] }}
                            </div>
                        </div>

                    </div>
                </div>
            </template>
        </GanttChart>
    </div>
</template>

<style scoped>
    .dashboard-gantt {
        .gantt-header {
            padding: .25rem 0;

            .close-gantt {
                cursor: pointer;
                background-color: #fff;
                height: 2rem;
                min-width: 2rem;
                padding: 0 .375rem;
                border-radius: .5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: .25rem;
                border: 1px solid #DCE5F7;

                &:hover {
                    background-color: #DCE5F7;
                }

                span {
                    margin-left: .25rem;
                }
            }
        }

        .gantt {
            &:deep(.gantt-rows) {
                .gantt-block {
                    border-top: 2px solid #24C586;

                    &:has(.blue) {
                        border-top: 2px solid #0575E5;

                        &.overflow-start {
                            border-left: 2px solid #0575E5;
                        }

                        &.overflow-end {
                            border-right: 2px solid #0575E5;
                        }
                    }

                    &:has(.grey) {
                        border-top: 2px solid #9FBBCA;

                        &.overflow-start {
                            border-left: 2px solid #9FBBCA;
                        }

                        &.overflow-end {
                            border-right: 2px solid #9FBBCA;
                        }
                    }

                    &:has(.purple) {
                        border-top: 2px solid #8438e1;

                        &.overflow-start {
                            border-left: 2px solid #8438e1;
                        }

                        &.overflow-end {
                            border-right: 2px solid #8438e1;
                        }
                    }

                    &:has(.yellow) {
                        border-top: 2px solid #EFAD1F;

                        &.overflow-start {
                            border-left: 2px solid #EFAD1F;
                        }

                        &.overflow-end {
                            border-right: 2px solid #EFAD1F;
                        }
                    }

                    &:has(.red) {
                        border-top: 2px solid #E82121;

                        &.overflow-start {
                            border-left: 2px solid #E82121;
                        }

                        &.overflow-end {
                            border-right: 2px solid #E82121;
                        }
                    }

                    &:has(.loading) {
                        pointer-events: none;

                        &::before {
                            position: absolute;
                            top: 0;
                            left: 0;
                            content: "";
                            height: 100%;
                            width: 100%;
                            backdrop-filter: blur(4px);
                            z-index: 1;
                        }
                    }

                    .move-handle {
                        position: absolute;
                        top: .375rem;
                        left: .25rem;
                        margin: 0;
                    }

                    .gantt-block-content {
                        width: 100%;
                    }
                }
            }

            .dashboard-gantt-block {
                display: flex;
                flex-direction: column;
                gap: .125rem;
                white-space: nowrap;

                .header {
                    padding-left: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: .5rem;

                    .title {
                        color: #152234;
                        font-size: 12px;
                        font-weight: 600;

                        display: flex;
                        align-items: center;
                        gap: .125rem;
                    }

                    .sub-title {
                        color: #36557F;
                        font-size: 10px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    .right {
                        display: flex;
                        align-items: center;
                        gap: .5rem;

                        .expected-hours {
                            color: #0575E5;
                            font-size: 12px;
                        }

                        .percent-progress {
                            color: #36557F;
                            font-size: 12px;
                        }
                    }
                }

                .content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: .5rem;

                    .right {
                        display: flex;
                        align-items: center;
                        gap: .5rem;

                        .state {
                            padding: 0 .5rem;
                            border-radius: .25rem;
                            width: fit-content;
                            font-size: 12px;

                            &.light-green {
                                color: #24C586;
                                border: 1px solid #24C586;
                                background: #24C58633;
                            }

                            &.blue {
                                color: #0575E5;
                                border: 1px solid #0575E5;
                                background: #0575E533;
                            }

                            &.grey {
                                color: #9FBBCA;
                                border: 1px solid #9FBBCA;
                                background: #9FBBCA33;
                            }

                            &.purple {
                                color: #8438e1;
                                border: 1px solid #8438e1;
                                background: #8438e133;
                            }

                            &.green {
                                color: #fff;
                                border: 1px solid #24C586;
                                background: #24C586;
                            }

                            &.yellow {
                                color: #EFAD1F;
                                border: 1px solid #EFAD1F;
                                background: #EFAD1F33;
                            }

                            &.red {
                                color: #E82121;
                                border: 1px solid #E82121;
                                background: #E8212133;
                            }
                        }

                        .priority {
                            font-size: 12px;

                            &.low {
                                color: #24C586;
                            }

                            &.medium {
                                color: #EFAD1F;
                            }

                            &.high {
                                color: #E82121;
                            }
                        }
                    }

                    .dates {
                        display: flex;
                        align-items: center;
                        gap: .25rem;
                        color: #36557F;
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>