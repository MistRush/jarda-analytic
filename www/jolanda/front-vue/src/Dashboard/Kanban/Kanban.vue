<script setup>
    import { onMounted, ref, computed } from 'vue';
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import {useTranslations} from "@/Composables/useTranslation.js";

    import TaskModal from '@/Dashboard/TaskModal/TaskModal.vue';
    import ReplyModal from '@/Dashboard/Kanban/ReplyModal.vue';
    import Panel from "@/Dashboard/Kanban/Panel.vue";

    import InputField from '@/Components/Inputs/InputField.vue'

    const props = defineProps({
        initPanel: String|Number|null,
        config: Object,
        fromDashboard: {
            type: Boolean,
            default: false,
        }
    });

    const {translations} = useTranslations();
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);

    const emit = defineEmits(['close'])
    const panel = ref(null);

    const stateByPanel = {
        [dashboardStore.states?.new.name]: dashboardStore.states?.new.value,
        [dashboardStore.states?.onHold.name]: dashboardStore.states?.onHold.value,
        [dashboardStore.states?.amended.name]: dashboardStore.states?.amended.value,
        [dashboardStore.states?.solutionRuns.name]: dashboardStore.states?.solutionRuns.value,
        [dashboardStore.states?.awaitingApproval.name]: dashboardStore.states?.awaitingApproval.value,
    }

    const panelByState = {
        [dashboardStore.states?.new.value]: dashboardStore.states?.new.name,
        [dashboardStore.states?.solutionRuns.value]: dashboardStore.states?.solutionRuns.name,
        [dashboardStore.states?.onHold.value]: dashboardStore.states?.onHold.name,
        [dashboardStore.states?.amended.value]: dashboardStore.states?.amended.name,
        [dashboardStore.states?.awaitingApproval.value]: dashboardStore.states?.awaitingApproval.name,
    }

    const transformedPanel = computed(() => {
        if(!panel.value)
            return null;

        return {
            ...panel.value,
            taskLists: generateNewTaskLists(panel.value.id, panel.value.taskLists)
        };
    });

    function generateNewTaskLists(panelId, originalTaskLists) {
        const newTaskLists = [];
        for(const [name, value] of Object.entries(stateByPanel)) {
            newTaskLists.push({
                id: value,
                panelId: panelId,
                title: name,
                shown: true,
                isVisible: true,
                tasks: [],
            });
        }

        originalTaskLists.forEach(taskList => {
            taskList.tasks.forEach(task => {
                if(task.deferredFlag)
                    return;

                const taskListId = panelByState[task.state] ? task.state : null;
                if (!taskListId)
                    return;

                const newTaskList = newTaskLists.find(taskList => taskList.id === taskListId);
                newTaskList.tasks.push(task);
            });
        });

        return newTaskLists;
    }

    onMounted(async () => {
        if(!props.fromDashboard) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    e.stopPropagation()
                    modalStore.closeLastOpenedModal();
                }
            });
        }

        modalStore.clearStore();
        if(!props.fromDashboard) {
            await dashboardStore.fetchPanels(props.config.endpoints.getPanels);
            await dashboardStore.fetchSubTasks(props.config.endpoints.getSubTasks);
            await dashboardStore.fetchUsers(props.config.endpoints.getUsers);

            if(props.allowedFeatures.includes('departments')) {
                await dashboardStore.fetchDepartments(props.config.endpoints.getDepartments);
            }

            if(props.allowedFeatures.includes('projects')) {
                await dashboardStore.fetchProjects(props.config.endpoints.getProjects);
                await dashboardStore.fetchProjectMilestones(props.config.endpoints.getProjectMilestones);
            }

            await dashboardStore.fetchCategories(props.config.endpoints.getCategories);
            await dashboardStore.fetchStates(props.config.endpoints.getStates);
            await dashboardStore.fetchPriorities(props.config.endpoints.getPriorities);
            await dashboardStore.fetchOnHoldTypes(props.config.endpoints.getOnHoldTypes);
        }

        if(props.initPanel)
            panel.value = dashboardStore.dashboardPanels?.find((panel) => panel.id == props.initPanel);
    });

    const dragPanel = ref(null);
    function onDragPanel(panelId) {
        dragPanel.value = panelId;
    }

    async function onDrop(task) {
        if(dragPanel.value && task) {
            let update = true;
            const taskList = transformedPanel.value.taskLists.find(taskList => taskList.id === dragPanel.value);
            const taskIndex = taskList.tasks.findIndex(t => t.id === task.id);
            if(taskIndex !== -1)
                update = false;

            if(update) {
                modalStore.openModal('kanban-reply', 'kanban-reply', {
                    task: task,
                    state: dragPanel.value,
                });
            }
        }
    }
</script>

<template>
    <div class="kanban">
        <div class="kanban-header">
            <Icon icon="arrow" v-if="fromDashboard" class="close-kanban" color="#A3B8E8" :width="20" :height="20" direction="left" @click="emit('close')" />
            <Icon icon="user-photo" color="#9BE3C7" :width="32" :height="32" :photo-path="panel?.icon" />
            <div>{{ panel?.title }}</div>
            <InputField
                font="realist"
                size="small"
                class="task-filter-input"
                v-model="dashboardStore.taskFilters.search"
                placeholder="Vyhledat"
                :show-clear="true"
            />
        </div>
        <div class="kanban-panels">
            <Panel
                v-for="taskList in transformedPanel?.taskLists"
                :config="config"
                :panel="taskList"
                :drag-highlight="!!dragPanel"
                @drop="onDrop"
                @drag-panel="onDragPanel"
            />
        </div>
        <template
            v-if="!fromDashboard"
            v-for="modal in modalStore.openedModalsByType['task-detail']"
            :key="modal.id"
        >
            <TaskModal
                :show="!modal.minimized"
                :task="modal.props"
                :config="config"
                :use-v-show="true"
                @close="modalStore.closeModal(modal.id)"
            />
        </template>
        <template v-for="modal in modalStore.openedModalsByType['kanban-reply']">
            <ReplyModal
                v-if="!modal.minimized"
                :key="modal.id"
                :show="true"
                :data="modal.props"
                :config="config"
                @close="modalStore.closeModal(modal.id)"
            />
        </template>
        <div v-if="!fromDashboard" class="minimized-task-detail-modals">
            <template v-for="modal in modalStore.openedModalsByType['task-detail']">
                <div
                    v-if="modal.minimized"
                    class="minimized-task-detail-modal"
                    @click="modalStore.maximizeModal('task-detail', modal.id)"
                >
                    {{ modal.props?.title }}
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
    .kanban {
        width: 100%;
        border-radius: 1.25rem;
        background: #fff;
        height: 85vh;

        .kanban-header {
            background-color: #F4F7FF;
            border-radius: 1.25rem 1.25rem 0 0;
            padding: .25rem .5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-weight: 600;

            .close-kanban {
                cursor: pointer;
            }
        }

        .kanban-panels {
            display: flex;
            gap: 1rem;
            padding: .5rem;
            height: 100%;
            max-height: calc(100% - 2.5rem);
        }
    }

    .minimized-task-detail-modals {
        position: fixed;
        max-width: 70vw;
        right: 1.5rem;
        bottom: 0;
        display: flex;
        justify-content: end;
        gap: 1rem;
        z-index: 5000;

        .minimized-task-detail-modal {
            max-width: 20vw;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            background: #fff;
            padding: .25rem 1rem;
            box-shadow: 0 0 4px 4px rgba(9, 19, 37, 0.10);
            border-radius: .5rem .5rem 0 0;
        }
    }
</style>