<script setup>
    import { VueDraggable } from 'vue-draggable-plus'
    import {ref, onMounted, computed,watch} from 'vue';
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import {useTranslations} from "@/Composables/useTranslation.js";
    import {useCookies} from "@/Composables/useCookies";

    import Panel from '@/Dashboard/Panel.vue';
    import HelpModal from '@/Dashboard/HelpModal.vue';
    import TaskModal from '@/Dashboard/TaskModal/TaskModal.vue';
    import TaskCreateModal from '@/Dashboard/TaskModal/TaskCreateModal.vue';
    import Kanban from '@/Dashboard/Kanban/Kanban.vue';
    import DashboardGantt from '@/Dashboard/Gantt/DashboardGantt.vue';

    import Checkbox from '@/Components/Inputs/Checkbox.vue';
    import Radio from '@/Components/Inputs/Radio.vue';
    import Select from '@/Components/Inputs/Select.vue';
    import InputField from '@/Components/Inputs/InputField.vue';
    import TaskContextMenu from "@/Dashboard/TaskContextMenu.vue";

    const props = defineProps({
        initTask: String|Number|null,
        endpoints: Object,
        currentUser: Number,
        currentUserSubUsers: Array,
        permissions: Array,
        allowedFeatures: Array,
    });

    const { translations } = useTranslations();
    const cookies = useCookies();
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);

    const areModalsOpen = computed(() => {
        return !!(modalStore.openedModalsByType['task-detail'].filter((modal) => !modal.minimized).length !== 0 || modalStore.openedModalsByType['task-create'].length !== 0);
    });

    const departmentOptions = computed(() => {
        return dashboardStore.departments?.map((department) => {
            return { value: department.id, text: department.name };
        });
    })

    const categoriesOptions = computed(() => {
        return dashboardStore.categories?.map((category) => {
            return { value: category.id, text: category.name };
        });
    });

    const userOptions = computed(() => {
        if(props.permissions.includes('admin')) {
            return dashboardStore.users?.map((user) => {
                return {value: user.id, text: user.name};
            })
        } else {
            return dashboardStore.users?.filter((user) => {
                return props.currentUserSubUsers.includes(user.id);
            }).map((user) => {
                return {value: user.id, text: user.name};
            })
        }
    });

    const fetchingPanels = ref(false);
    onMounted(async () => {
        document.addEventListener("keydown", (e) => {
            if(e.key === "Escape") {
                e.stopPropagation()
                modalStore.closeLastOpenedModal();
            }
        });

        fetchingPanels.value = true;
        modalStore.clearStore();
        if(props.allowedFeatures.includes('departments')) {
            await dashboardStore.fetchDepartments(props.endpoints.getDepartments);
        }

        if(props.allowedFeatures.includes('projects')) {
            await dashboardStore.fetchProjects(props.endpoints.getProjects);
            await dashboardStore.fetchProjectMilestones(props.endpoints.getProjectMilestones);
        }

        await dashboardStore.fetchCategories(props.endpoints.getCategories);
        await dashboardStore.fetchStates(props.endpoints.getStates);
        await dashboardStore.fetchPriorities(props.endpoints.getPriorities);
        await dashboardStore.fetchOnHoldTypes(props.endpoints.getOnHoldTypes);

        await dashboardStore.fetchPanels(props.endpoints.getPanels);
        await dashboardStore.fetchSubTasks(props.endpoints.getSubTasks);
        await dashboardStore.fetchUsers(props.endpoints.getUsers);
        fetchingPanels.value = false;

        if(props.initTask) {
            let initTaskObj = null;
            dashboardStore.dashboardPanels?.forEach((panel) => {
                if(initTaskObj)
                    return;

                panel.taskLists.forEach((taskList) => {
                    if(initTaskObj)
                        return;

                    initTaskObj = taskList.tasks.find((task) => task.id == props.initTask);
                });
            });

            if(!initTaskObj)
                initTaskObj = dashboardStore.dashboardSubTasks?.find((task) => task.id == props.initTask);

            if(initTaskObj)
                modalStore.openModal('task-detail', initTaskObj.id, initTaskObj);
        }
    })

    function onPanelReorder() {
        const panelOrder = dashboardStore.dashboardPanels.map(panel => panel.id);

        let panelOrderCookie = cookies.getCookie('dashboard-panel-order');
        if(panelOrderCookie)
            panelOrderCookie = JSON.parse(panelOrderCookie);

        if(!panelOrderCookie || typeof panelOrderCookie !== 'object')
            panelOrderCookie = {};

        if(Array.isArray(panelOrderCookie)) {
            panelOrderCookie = {
                [dashboardStore.panelFilters.panelType]: panelOrderCookie
            };
        }

        panelOrderCookie[dashboardStore.panelFilters.panelType] = panelOrder;
        cookies.setCookie('dashboard-panel-order', JSON.stringify(panelOrderCookie), 365);
    }

    function toggleMinimizeAll() {
        const allMinimized = dashboardStore.dashboardPanels.filter(panel => !panel.minimized).length <= 0;
        dashboardStore.dashboardPanels = dashboardStore.dashboardPanels.map(panel => { return { ...panel, minimized: !allMinimized } });
    }

    async function refreshAll() {
        fetchingPanels.value = true;
        modalStore.clearStore();
        dashboardStore.dashboardPanels = [];

        if(props.allowedFeatures.includes('departments')) {
            await dashboardStore.fetchDepartments(props.endpoints.getDepartments);
        }

        if(props.allowedFeatures.includes('projects')) {
            await dashboardStore.fetchProjects(props.endpoints.getProjects);
            await dashboardStore.fetchProjectMilestones(props.endpoints.getProjectMilestones);
        }

        await dashboardStore.fetchCategories(props.endpoints.getCategories);
        await dashboardStore.fetchStates(props.endpoints.getStates);
        await dashboardStore.fetchPriorities(props.endpoints.getPriorities);
        await dashboardStore.fetchOnHoldTypes(props.endpoints.getOnHoldTypes);

        await dashboardStore.fetchPanels(props.endpoints.getPanels);
        await dashboardStore.fetchSubTasks(props.endpoints.getSubTasks);
        await dashboardStore.fetchUsers(props.endpoints.getUsers);

        fetchingPanels.value = false;
    }

    watch(dashboardStore.panelFilters, async () => {
        fetchingPanels.value = true;
        modalStore.clearStore();
        dashboardStore.dashboardPanels = [];

        await dashboardStore.fetchPanels(props.endpoints.getPanels);
        await dashboardStore.fetchSubTasks(props.endpoints.getSubTasks);

        fetchingPanels.value = false;
    });

    const kanbanPanelId = ref(null);
    function openKanban(panelId) {
        kanbanPanelId.value = panelId;
    }

    function closeKanban() {
        kanbanPanelId.value = null;
    }

    const ganttPanelId = ref(null);
    function openGantt(panelId) {
        ganttPanelId.value = panelId;
    }

    function closeGantt() {
        ganttPanelId.value = null;
    }

    const isMobile = computed(() => {
        return screen.width <= 768;
    });

    const filtersVisible = ref(false);

    const totalCount = computed(() => {
        return dashboardStore.dashboardPanels?.filter(panel => panel.isVisible).reduce((acc, panel) => {
            acc += panel.taskLists?.filter(taskList => taskList.isVisible).reduce((acc, taskList) => {
                acc += taskList.tasks?.filter(task => task.isVisible).length;
                return acc;
            }, 0);

            return acc;
        }, 0);
    })
</script>

<template>
    <div class="dashboard-vue" :class="[{'loading': fetchingPanels}]">
        <div>
            <div v-if="(!allowedFeatures.includes('kanban') || !kanbanPanelId) && !ganttPanelId">
                <div class="filters-button" @click="filtersVisible = !filtersVisible" v-if="isMobile">
                    <Icon icon="filter" color="#36557F" :width="20" :height="20" />
                    <span>Zobrazit filtry</span>
                    <div class="task-count">{{ totalCount }}</div>
                </div>
                <div class="task-filters" v-if="!isMobile || filtersVisible">
                    <div class="task-filters-row">
                        <div class="left">
                            <InputField
                                font="realist"
                                class="task-filter-input"
                                v-model="dashboardStore.taskFilters.search"
                                :placeholder="translations.SEARCH"
                                :show-clear="true"
                            />
                            <Select
                                v-if="allowedFeatures.includes('departments') && permissions.includes('switchDepartments')"
                                font="realist"
                                class="task-filter-select"
                                v-model="dashboardStore.panelFilters.department"
                                :filterable="true"
                                :options="departmentOptions"
                                :placeholder="translations.DEPARTMENT"
                            />
                            <Select
                                v-if="permissions.includes('showAs') && !(dashboardStore.panelFilters.department && dashboardStore.panelFilters.department !== '0')"
                                font="realist"
                                class="task-filter-select"
                                v-model="dashboardStore.panelFilters.user"
                                :filterable="true"
                                :options="userOptions"
                                :placeholder="translations.USER"
                            />
                            <Select
                                font="realist"
                                class="task-filter-select"
                                v-model="dashboardStore.taskFilters.category"
                                :options="categoriesOptions"
                                :placeholder="translations.CATEGORY"
                            />
                            <InputField
                                class="task-filter-input-small"
                                font="realist"
                                type="number"
                                v-model="dashboardStore.taskFilters.expectedHoursFrom"
                                :placeholder="translations.EXPECTED_HOURS_FROM + ':'"
                            />
                            <InputField
                                class="task-filter-input-small"
                                font="realist"
                                type="number"
                                v-model="dashboardStore.taskFilters.expectedHoursTo"
                                :placeholder="translations.EXPECTED_HOURS_TO + ':'"
                            />
                            <InputField
                                v-if="allowedFeatures.includes('expectedReturn')"
                                class="task-filter-input-small"
                                font="realist"
                                type="number"
                                v-model="dashboardStore.taskFilters.expectedReturnFrom"
                                :placeholder="translations.EXPECTED_RETURN_FINANCE_FROM + ':'"
                            />
                            <InputField
                                v-if="allowedFeatures.includes('expectedReturn')"
                                class="task-filter-input-small"
                                font="realist"
                                type="number"
                                v-model="dashboardStore.taskFilters.expectedReturnTo"
                                :placeholder="translations.EXPECTED_RETURN_FINANCE_TO + ':'"
                            />
                        </div>
                    </div>
                    <div class="task-filters-row">
                        <div class="left checkboxes">
                            <div class="task-count-container">
                                <Icon icon="filter" color="#36557F" :width="20" :height="20" />
                                <span>{{ totalCount }}</span>
                                <span class="separator"></span>
                            </div>
                            <span class="task-filter-checkbox">
                                <Checkbox v-model="dashboardStore.taskFilters.showDeferred" label="Odložené" />
                            </span>
                            <span class="task-filter-checkbox">
                                <Checkbox v-model="dashboardStore.taskFilters.showOnlyNotViewed" label="Nepřečtené" />
                                <span class="viewed"></span>
                            </span>
                            <span class="task-filter-checkbox">
                                <Checkbox class="solution-runs" v-model="dashboardStore.taskFilters.showOnlySolutionRuns" label="Aktuálně řešené" />
                            </span>
                            <span class="task-filter-checkbox">
                                <Checkbox v-model="dashboardStore.showProgressBar" :label="translations.SHOW_PROGRESS_BAR" />
                            </span>
                        </div>
                        <div class="right">
                            <div class="task-filters-button" @click="modalStore.openModal('help', 'help', {})">
                                <Icon icon="help" :width="12" :height="12" color="black" />
                            </div>
                            <div class="task-filters-button" @click="toggleMinimizeAll">
                                <Icon icon="minus" :width="12" :height="12" color="black" />
                            </div>
                            <div class="task-filters-button" @click="refreshAll">
                                <Icon icon="refresh" :width="12" :height="12" color="black" />
                            </div>
                            <div class="task-filters-button green" @click.stop="modalStore.openModal('task-create', 'task-create', {})">
                                <span>{{ translations.NEW_TASK }}</span>
                                <Icon icon="plus" :width="12" :height="12" color="#000" />
                            </div>
                        </div>
                    </div>
                    <div class="task-filters-row">
                        <div class="left view-mode">
                            <div class="label" style="font-weight: 600">Zobrazení:</div>
                            <div class="right radio-tabs">
                                <Radio font="realist" v-model="dashboardStore.panelFilters.panelType" value="solver" :label="translations.SOLVERS" />
                                <Radio font="realist" v-model="dashboardStore.panelFilters.panelType" value="author" :label="translations.AUTHORS" />
                                <Radio font="realist" v-model="dashboardStore.panelFilters.panelType" value="project" :label="translations.PROJECTS" />
                                <Radio v-if="allowedFeatures.includes('departments')" font="realist" v-model="dashboardStore.panelFilters.panelType" value="department" :label="translations.DEPARTMENT" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-area-outer">
                    <VueDraggable
                        v-if="dashboardStore.dashboardPanels?.length > 0"
                        ref="el"
                        class="dashboard-area-inner"
                        :class="{ 'dialog-open': areModalsOpen }"
                        v-model="dashboardStore.dashboardPanels"
                        handle=".panel-drag-handle"
                        @end="onPanelReorder"
                        :animation="150"
                    >
                        <Panel
                            v-for="panel in dashboardStore.dashboardPanels"
                            :key="panel.id"
                            :config="props"
                            :panel="panel"
                            @open-kanban="openKanban"
                            @open-gantt="openGantt"
                        />
                    </VueDraggable>
                </div>
            </div>
            <Kanban
                v-if="allowedFeatures.includes('kanban') && kanbanPanelId"
                :init-panel="kanbanPanelId"
                :config="props"
                :from-dashboard="true"
                @close="closeKanban"
            />
            <DashboardGantt
                v-if="ganttPanelId"
                :config="props"
                :panel="ganttPanelId"
                @close="closeGantt"
            />
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
            <TaskCreateModal
                v-for="modal in modalStore.openedModalsByType['task-create']"
                :key="modal.id"
                :show="true"
                :endpoints="endpoints"
                :default-values="modal.props"
                :allowed-features="['otherSolvers', 'departments', 'expectedReturn', permissions.includes('admin') ? 'changeAuthor' : null]"
                @close="modalStore.closeModal(modal.id)"
            />
        </div>
        <div class="minimized-task-detail-modals">
            <template v-for="modal in modalStore.openedModalsByType['task-detail']">
                <div
                    class="minimized-task-detail-modal"
                    :class="{ maximized: !modal.minimized }"
                    @click="modalStore.maximizeModal('task-detail', modal.id)"
                >
                    <div class="author">{{ modal.props?.author?.initials }}:</div>
                    <div class="title">{{ modal.props?.title }}</div>
                    <div class="close" @click.stop="modalStore.closeModal(modal.id)"><Icon icon="close" :width="12" :height="12" color="#000" /></div>
                </div>
            </template>
        </div>
        <HelpModal
            v-for="modal in modalStore.openedModalsByType['help']"
            :key="modal.id"
            :show="true"
            @close="modalStore.closeModal(modal.id)"
        />
        <TaskContextMenu
            v-if="dashboardStore.contextMenuVisible"
            :x="dashboardStore.contextMenuX"
            :y="dashboardStore.contextMenuY"
            :task="dashboardStore.contextMenuTask"
            :current-user="currentUser"
            :current-user-sub-users="currentUserSubUsers"
            :endpoints="endpoints"
            :allowed-features="allowedFeatures"
            :permissions="permissions"
        />
    </div>
</template>

<style scoped>
    @keyframes dashboard-loading {
        0% { background-position: 200% 0 }
        100% { background-position: 0 0 }
    }

    .loading {
        position: relative;
        pointer-events: none;

        &:after {
            position: absolute;
            top: 0;
            left: 0;
            content: "";
            height: 100%;
            width: 100%;
            backdrop-filter: blur(3px);
            background: linear-gradient(90deg, transparent 20%, #24C58633 50%, transparent 80%);
            animation: dashboard-loading 1s linear infinite;
            background-size: 200% 100%;
        }
    }

    .filters-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        font-weight: 600;
        background-color: #ECF2FF;

        .task-count {
            margin-left: auto;
        }
    }

    .task-filters {
        &:deep(label) {
            cursor: pointer;
        }

        .task-filters-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;

            .left {
                display: flex;
                align-items: center;
                justify-content: start;
                gap: 8px;

                @media (max-width: 1600px) {
                    flex-wrap: wrap;
                }

                @media (max-width: 960px) {
                    width: 100%;
                }

                @media (max-width: 768px) {
                    &.checkboxes {
                        flex-direction: column;
                        align-items: start;
                        justify-content: start;
                    }
                }

                @media (max-width: 500px) {
                    &.view-mode {
                        .label {
                            display: none;
                        }
                    }
                }

                .task-count-container {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 600;

                    @media (max-width: 768px) {
                        display: none;
                    }

                    .separator {
                        margin-left: 4px;
                        width: 1px;
                        height: 16px;
                        background-color: #DCE5F7;
                    }
                }
            }

            .right {
                display: flex;
                align-items: center;
                justify-content: end;
                gap: 8px;

                @media (max-width: 768px) {
                    align-self: end;
                }
            }

            .task-filter-checkbox {
                margin-right: 15px;
                display: flex;
                align-items: center;
                gap: 5px;

                .viewed {
                    display: inline-block;
                    min-width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #16f;
                    box-shadow: 0 2px 4px #398DD33F;
                }

                .solution-runs {
                    color: #24c586;
                }
            }

            .task-filter-select {
                width: 180px;

                @media (max-width: 960px) {
                    width: 100%;
                }
            }

            .task-filter-input {
                width: 180px;

                @media (max-width: 960px) {
                    width: 100%;
                }
            }

            .task-filter-input-small {
                width: 120px;

                @media (max-width: 960px) {
                    width: calc(50% - 4px);
                }
            }

            .task-filters-button {
                padding: 0 .5rem;
            }

            .radio-tabs {
                background-color: #ECF2FF;
                padding: 2px;
                border-radius: 4px;
                gap: 4px;

                @media (max-width: 500px) {
                    flex-direction: column;
                    width: 100%;

                    & > div {
                        width: 100%;
                    }
                }

                & > div {
                    border-radius: 4px;
                    background-color: #ecf2ff;
                    transition: color .15s, background-color .15s;
                    padding: 5px 10px;
                    cursor: pointer;

                    &:deep(input) {
                        display: none;
                    }

                    &:deep(label) {
                        font-weight: 600;
                        margin: 0;
                    }

                    &:deep(.radio-wrapper) {
                        margin: 0;
                    }
                }

                & > div:has(input:checked), & > div:hover {
                    background-color: #24c586;
                    color: #fff;
                }
            }

            .task-filters-button {
                cursor: pointer;
                background-color: #fff;
                height: 26px;
                min-width: 26px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                border: 1px solid #DCE5F7;
                white-space: nowrap;

                &.green {
                    border: 1px solid #24c586;
                }

                &:hover {
                    background-color: #DCE5F7;

                    &.green {
                        background-color: #24c58633;
                    }
                }

                span {
                    margin-left: 4px;
                }
            }

            .task-filter-input:deep(input),
            .task-filter-select:deep(.input-wrapper) {
                border-radius: 4px;
                border: 1px solid #e8efff;
                background-color: #e8efff;
                color: #36557F;
            }

            .task-filter-input:deep(input::placeholder) {
                color: #36557F;
            }

            .task-filter-select:deep(.input) {
                background-color: #e8efff;
                overflow: hidden;

                & > div {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }

    .dashboard-area-outer {
        display: flex;
        border-radius: 15px;
        background: #ECF2FF;
        overflow: hidden;
        position: relative;
        height: 70vh;

        @media (max-width: 768px) {
            border: 2px solid #ECF2FF;
        }

        .dashboard-area-inner {
            border-radius: 15px;
            padding: 8px;
            background: #ECF2FF;
            display: flex;
            gap: 8px;
            flex-grow: 1;
            overflow: auto;
            scrollbar-color: #abd #cde;
            scrollbar-width: thin;

            &.dialog-open {
                padding-right: 900px;
            }

            @media (max-width: 768px) {
                flex-direction: column;
            }
        }
    }

    .minimized-task-detail-modals {
        position: fixed;
        right: 1.5rem;
        bottom: 0;
        display: flex;
        justify-content: end;
        gap: 1rem;
        z-index: 5000;

        .minimized-task-detail-modal {
            display: flex;
            align-items: center;
            width: 250px;
            gap: .25rem;
            cursor: pointer;
            background: #fff;
            padding: .5rem 1rem;
            box-shadow: 0 0 4px 4px rgba(9, 19, 37, 0.10);
            border-radius: .5rem .5rem 0 0;

            &.maximized {
                background: #d7fde3;
            }

            .author {
                color: #24C586;
                font-weight: 600;
            }

            .title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .close {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: auto;
            }
        }
    }

    html.prefer-dark, html.dark-theme {
        .filters-button {
            background-color: #273752;
        }

        .task-filters {
            .task-filters-row {
                .task-filter-input:deep(input),
                .task-filter-select:deep(.input-wrapper) {
                    border: 1px solid #152234;
                    background-color: #152234;
                    color: #fff;
                }

                .task-filter-input-small:deep(input::placeholder),
                .task-filter-input:deep(input::placeholder) {
                    color: #91aed5;
                }

                .task-filter-input-small:deep(input) {
                    border: 1px solid #152234;
                    color: #fff;
                }

                .task-filter-select:deep(.input) {
                    background-color: #152234;
                    color: #91aed5;
                }

                .radio-tabs {
                    background-color: #152234;

                    & > div {
                        background-color: #152234;

                        &:deep(.radio-wrapper) {
                            background-color: #152234;

                            &:hover {
                                background-color: #24c586;
                                color: #fff;
                                border-radius: 4px;

                                &:deep(.radio-wrapper) {
                                    background-color: #24c586;
                                    color: #fff;
                                    border-radius: 4px;
                                }
                            }
                        }
                    }

                    & > div:has(input:checked), & > div:hover {
                        background-color: #24c586;
                        color: #fff;
                    }
                }

                .task-filters-button {
                    cursor: pointer;
                    background-color: #506485;
                    height: 2rem;
                    min-width: 2rem;
                    padding: 0 .5rem;
                    border-radius: .5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .25rem;
                    border: 1px solid #152234;

                    &.green {
                        background-color: #273752;
                        border: 1px solid #24c586;
                    }

                    &:hover {
                        background-color: #6b81a6;

                        &.green {
                            background-color: #24c58633;
                        }
                    }
                }
            }
        }

        .dashboard-area-outer {
            background: #152234;

            @media (max-width: 768px) {
                border: 2px solid #152234;
            }

            .dashboard-area-inner {
                background: #152234;
                scrollbar-color: #506485 #273752;
            }
        }

        .minimized-task-detail-modals {
            .minimized-task-detail-modal {
                background: #273752;

                &.maximized {
                    background: #506485;
                }
            }
        }
    }
</style>