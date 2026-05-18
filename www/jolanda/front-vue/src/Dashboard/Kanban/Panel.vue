<script setup>
    import { ref, computed, watch } from 'vue';
    import { useTranslations } from "@/Composables/useTranslation.js";
    import { VueDraggable } from 'vue-draggable-plus';
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore.js";

    import Task from "@/Dashboard/Kanban/Task.vue";

    import Tooltip from "@/Components/Other/Tooltip.vue";


    const props = defineProps({
        config: Object,
        panel: Object,
        dragHighlight: Boolean,
    });

    const { translations } = useTranslations();
    const emit = defineEmits(['drop', 'drag-panel']);
    const dashboardStore = useDashboardStore(window.pinia);

    const sortDirections = {
        desc: 'bottom',
        asc: 'top'
    };

    const sortColumns = {
        dashboardOrder: 'Dashboard',
        dateUpdated: translations.DATE_UPDATED,
        dateCreated: translations.DATE_CREATED,
        title: translations.TITLE
    };

    const icons = {
        [dashboardStore.states?.new.value]: 'to-do',
        [dashboardStore.states?.solutionRuns.value]: 'currently-solving',
        [dashboardStore.states?.onHold.value]: 'on-hold',
        [dashboardStore.states?.amended.value]: 'amended',
        [dashboardStore.states?.awaitingApproval.value]: 'awaiting-approval'
    }

    const help = {
        [dashboardStore.states?.new.value]: translations.TO_DO_HELP,
        [dashboardStore.states?.solutionRuns.value]: translations.ON_HOLD_HELP,
        [dashboardStore.states?.onHold.value]: translations.AMENDED_HELP,
        [dashboardStore.states?.amended.value]: translations.CURRENTLY_SOLVING_HELP,
        [dashboardStore.states?.awaitingApproval.value]: translations.AWAITING_APPROVAL_HELP,
    }

    const sortDirection = ref('desc');
    const sortColumn = ref('dashboardOrder');

    const tasksSorted = computed(() => {
        if(sortColumn.value === 'dashboardOrder')
            return props.panel?.tasks;

        return props.panel?.tasks?.slice().sort((a, b) => {
            const direction = sortDirection.value === 'asc' ? 1 : -1;
            const valueA = a[sortColumn.value];
            const valueB = b[sortColumn.value];

            if (valueA < valueB) return -1 * direction;
            if (valueA > valueB) return 1 * direction;

            return 0;
        });
    });

    function flipSortDirection() {
        if(sortColumn.value === 'dashboardOrder')
            return;

        const index = Object.keys(sortDirections).indexOf(sortDirection.value);
        if(index >= Object.keys(sortDirections).length - 1) {
            sortDirection.value = Object.keys(sortDirections)[0];
        } else sortDirection.value = Object.keys(sortDirections)[index + 1];
    }

    function changeSortColumn() {
        const index = Object.keys(sortColumns).indexOf(sortColumn.value);
        if(index >= Object.keys(sortColumns).length - 1) {
            sortColumn.value = Object.keys(sortColumns)[0];
        } else sortColumn.value = Object.keys(sortColumns)[index + 1];
    }

    const dragItem = ref(null);
    const dragHighlight = ref(0);
    function onMove() {
        return false;
    }

    function onDragEnter() {
        dragHighlight.value++;
        if(dragHighlight.value === 1)
            emit('drag-panel', props.panel.id);
    }

    function onDragLeave() {
        dragHighlight.value--;
        if(dragHighlight.value === 0)
            emit('drag-panel', null);
    }

    function onDragStart(event) {
        dragItem.value = tasksSorted.value[event.oldIndex];
    }

    function onDragEnd() {
        emit('drop', dragItem.value);
        dragItem.value = null;
        dragHighlight.value = 0;
        emit('drag-panel', null);
    }

    watch(() => props.dragHighlight, (toggleDragHighlight) => {
        if(!toggleDragHighlight)
            dragHighlight.value = 0;
    })
</script>

<template>
    <div class="kanban-panel">
        <div class="kanban-panel-header">
            <div class="kanban-panel-title">
                <Tooltip :text="help[panel.id]" max-width="400px">
                    <div class="kanban-panel-header-icon" :class="icons[panel.id]">
                        <Icon icon="clock" v-if="icons[panel.id] === 'awaiting-approval'" :width="20" :height="20" color="#fff" />
                    </div>
                </Tooltip>
                <Tooltip class="kanban-panel-title-text" :text="panel.title">{{ panel.title }}</Tooltip>
                <div class="kanban-panel-counter">{{ tasksSorted.length }}</div>
            </div>
            <div class="kanban-panel-sort">
                <div class="kanban-panel-sort-column" @click="changeSortColumn">{{ sortColumns[sortColumn] }}</div>
                <div class="kanban-panel-sort-direction" @click="flipSortDirection">
                    <Icon icon="filter" color="#A3B8E8" :width="16" :height="16" />
                    <Icon icon="arrow" v-show="sortColumn !== 'dashboardOrder'" color="#A3B8E8" :width="8" :height="8" :direction="sortDirections[sortDirection]" />
                </div>
            </div>
        </div>
        <VueDraggable
            ref="el"
            class="kanban-panel-items"
            :class="dragHighlight > 0 ? 'drag-highlight' : ''"
            v-model="tasksSorted"
            :disabled="config.permissions.includes('disableReorder')"
            group="items"
            :sort="false"
            handle=".kanban-item-drag-handle"
            @move="onMove"
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @start="onDragStart"
            @end="onDragEnd"
            :animation="150"
            :data-task-list-id="panel.id"
        >
            <Task
                v-for="task in tasksSorted"
                :config="config"
                :task="task"
            />
        </VueDraggable>
    </div>
</template>

<style scoped>
    .kanban-panel {
        flex-basis: calc((100% / 5) - .75rem);
        max-width: calc((100% / 5) - .75rem);
        border-radius: .75rem;
        background-color: #F4F7FF;
        padding: .5rem;

        .kanban-panel-header {
            display: flex;
            align-items: center;
            gap: .5rem;
            margin-bottom: .5rem;

            .kanban-panel-title {
                display: flex;
                align-items: center;
                gap: .5rem;
                font-weight: 600;
                overflow: hidden;

                .kanban-panel-title-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .kanban-panel-header-icon {
                width: 1.5rem;
                height: 1.5rem;

                &.to-do {
                    border-radius: 50%;
                    border: 1px dashed #ED11BD;
                }

                &.on-hold{
                    border-radius: 50%;
                    border: 1px solid #EFAD1F;
                    background: linear-gradient(to right, #F4F7FF 50%, transparent 50%), linear-gradient(to bottom, #EFAD1F 50%, #F4F7FF 50%);
                }

                &.amended {
                    border-radius: 50%;
                    border: 1px solid #EFAD1F;
                    background: linear-gradient(to right, transparent 50%, #EFAD1F 50%);
                }

                &.currently-solving {
                    border-radius: 50%;
                    border: 1px solid #EFAD1F;
                    background: linear-gradient(to bottom, transparent 50%, #EFAD1F 50%), linear-gradient(to right, transparent 50%, #EFAD1F 50%);
                }

                &.awaiting-approval {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: #EFAD1F;
                }

                &.done {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: #24C586;
                    padding: 1px 0 0 1px;
                }
            }

            .kanban-panel-sort {
                white-space: nowrap;
                margin-left: auto;
                display: flex;
                align-items: center;
                color: #A3B8E8;

                .kanban-panel-sort-direction {
                    cursor: pointer;

                    * {
                        pointer-events: none;
                    }
                }

                .kanban-panel-sort-column {
                    cursor: pointer;
                }
            }

            .kanban-panel-counter {
                background: #24C58633;
                color: #24C586;
                border-radius: .5rem;
                padding: .125rem .5rem;
                font-size: .75rem;
            }
        }

        .kanban-panel-items {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: .5rem;
            height: 100%;
            max-height: calc(100% - 2rem);
            overflow-y: auto;
            scrollbar-color: #E4E7EE #F4F7FF;
            scrollbar-width: thin;

            &.drag-highlight:after {
                pointer-events: none;
                content: "";
                display: block;
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: #24C58633;
            }
        }
    }
</style>