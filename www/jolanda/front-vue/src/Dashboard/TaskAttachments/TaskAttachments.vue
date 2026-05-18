<script setup>
import {onMounted, computed, watch} from 'vue';
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";

    import TaskAttachment from '@/Dashboard/TaskAttachments/TaskAttachment.vue';
    import TaskModal from '@/Dashboard/TaskModal/TaskModal.vue';
    import Select from '@/Components/Inputs/Select.vue';
    import InputField from '@/Components/Inputs/InputField.vue';

    const props = defineProps({
        endpoints: Object,
        states: Object,
        priorities: Object,
        categories: Object,
        onHoldTypes: Object,
        user: Number,
        subUsers: Array,
        permissions: Array,
        allowedFeatures: Object,
    });

    const translations = window.translations;
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);

    const categoriesEnum = Object.entries(props.categories).map((category) => {
        return { value: category[0], text: category[1] };
    });

    const tasks = computed(() => {
        let tasks = [];

        dashboardStore.dashboardPanels?.forEach(panel => {
            if(!panel.isVisible)
                return;

            panel.taskLists.forEach(taskList => {
                if(!taskList.isVisible)
                    return;

                taskList.tasks.forEach(task => {
                    if(!task.isVisible)
                        return;

                    if(task.attachments.length > 0) {
                        tasks.push(task);
                        return;
                    }

                    if(task.links.length > 0) {
                        tasks.push(task);
                        return;
                    }

                    let add = false;
                    task.replies.forEach(taskReply => {
                        if(taskReply.attachments.length > 0)
                            add = true;
                    });

                    if(add)
                        tasks.push(task);
                });
            })
        });

        return tasks;
    });

    onMounted(async () => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                e.stopPropagation()
                modalStore.closeLastOpenedModal();
            }
        });

        modalStore.clearStore();
        await dashboardStore.fetchData(props.endpoints.getPanels);
        await dashboardStore.fetchSubTasks(props.endpoints.getSubTasks);
    });

    async function refreshAll() {
        modalStore.clearStore();
        dashboardStore.dashboardPanels = [];
        await dashboardStore.fetchData(props.endpoints.getPanels);
        await dashboardStore.fetchSubTasks(props.endpoints.getSubTasks);
    }

    watch(dashboardStore.panelFilters, async () => {
        await refreshAll();
    });
</script>

<template>
    <div class="task-attachment-filters">
        <InputField
            font="realist"
            size="small"
            class="task-filter-input"
            v-model="dashboardStore.taskFilters.search"
            :placeholder="translations.SEARCH"
            :show-clear="true"
        />
        <Select
            v-if="allowedFeatures.includes('departments') && permissions.includes('switchDepartments')"
            font="realist"
            size="small"
            class="task-filter-select"
            v-model="dashboardStore.panelFilters.department"
            :filterable="true"
            :url="endpoints.departmentDataList"
            :placeholder="translations.DEPARTMENT"
        />
        <Select
            v-if="permissions.includes('showAs') && !(dashboardStore.panelFilters.department && dashboardStore.panelFilters.department !== '0')"
            font="realist"
            size="small"
            class="task-filter-select"
            v-model="dashboardStore.panelFilters.user"
            :filterable="true"
            :url="endpoints.userDataList + '?ForShowAs=1'"
            :placeholder="translations.USER"
            icon="UserDarkIcon"
            icon-color="#36557F"
        />
        <Select
            v-if="permissions.includes('showAs') && !(dashboardStore.panelFilters.department && dashboardStore.panelFilters.department !== '0')"
            font="realist"
            size="small"
            class="task-filter-select"
            v-model="dashboardStore.taskFilters.category"
            :options="categoriesEnum"
            :placeholder="translations.CATEGORY"
            icon="UserDarkIcon"
            icon-color="#36557F"
        />
    </div>

    <div class="task-attachments">
        <TaskAttachment
            v-for="task in tasks"
            :config="props"
            :task="task"
        />
    </div>

    <template
        v-for="modal in modalStore.openedModalsByType['task-detail']"
        :key="modal.id"
    >
        <TaskModal
            :show="!modal.minimized"
            :task="modal.props"
            :config="props"
            :use-v-show="true"
            @close="modalStore.closeModal(modal.id)"
        />
    </template>

    <div class="minimized-task-detail-modals">
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
</template>

<style scoped>
    .task-attachment-filters {
        display: flex;
        gap: .5rem;
        margin-bottom: 1rem;

        & > * {
            flex-basis: 25%;
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