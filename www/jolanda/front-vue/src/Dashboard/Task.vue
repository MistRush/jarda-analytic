<script setup>
    import {computed,ref} from 'vue';
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import {useTranslations} from "@/Composables/useTranslation.js";
    import {useHelper} from "@/Composables/useHelper";

    import Tooltip from "@/Components/Other/Tooltip.vue";
    import DatePicker from "@/Components/Inputs/DatePicker.vue";
    import Select from "@/Components/Inputs/Select.vue";

    const props = defineProps({
        config: Object,
        draggable: Boolean,
        panelMaximized: Boolean,
        task: Object
    });

    const {translations} = useTranslations();
    const helper = useHelper();
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);

    const priorityMap = computed(() => {
        return {
            [dashboardStore.priorities?.low?.value]: 'low',
            [dashboardStore.priorities?.medium?.value]: 'medium',
            [dashboardStore.priorities?.high?.value]: 'high',
        }
    });

    const projectsEnum = computed(() => {
        return dashboardStore.projectMilestones?.map((project) => {
            return { value: project.id, text: project.name };
        });
    });

    const departmentsEnum = computed(() => {
        return dashboardStore.departments?.map((department) => {
            return { value: department.id, text: department.name };
        });
    });

    const usersEnum = computed(() => {
        return dashboardStore.users?.map((user) => {
            return { value: user.id, text: user.name };
        });
    });

    const userIsAdmin = computed(() => {
        return props.config.permissions.includes('admin');
    });

    const userIsAuthor = computed(() => {
        return userIsAdmin.value || props.config.currentUser == props.task.author?.id || props.config.currentUserSubUsers?.includes(props.task.author?.id);
    });

    const userIsSolver = computed(() => {
        return userIsAdmin.value || props.config.currentUser == props.task.solver?.id || props.config.currentUserSubUsers?.includes(props.task.solver?.id);
    });

    const userIsDepartmentManager = computed(() => {
        return userIsAdmin.value || props.task.department?.managerIds?.includes(props.config.currentUser) || props.task.department?.managerIds?.filter(managerId => props.config.currentUserSubUsers?.includes(managerId)).length > 0;
    });

    const userIsProjectManager = computed(() => {
        return userIsAdmin.value || props.task.project?.managerIds?.includes(props.config.currentUser) || props.task.department?.managerIds?.filter(managerId => props.config.currentUserSubUsers?.includes(managerId)).length > 0;
    });

    const userIsCustomPanelUser = computed(() => {
        return userIsAdmin.value || props.task.customPanelUsers?.includes(props.config.currentUser) || props.task.customPanelUsers?.filter(userId => props.config.currentUserSubUsers?.includes(userId)).length > 0;
    });

    const canDrag = computed(() => {
        if(dashboardStore.panelFilters.panelType === 'solver') {
            return userIsSolver.value;
        } else if(dashboardStore.panelFilters.panelType === 'author') {
            return userIsAuthor.value;
        } else if(dashboardStore.panelFilters.panelType === 'project') {
            return userIsProjectManager.value;
        } else if(dashboardStore.panelFilters.panelType === 'department') {
            return userIsDepartmentManager.value;
        } else if(dashboardStore.panelFilters.panelType === 'custom') {
            return userIsCustomPanelUser.value;
        } else return false;
    })

    const taskClasses = computed(() => {
        return {
            'awaiting-approval': props.task.state === dashboardStore.states?.awaitingApproval?.value,
            'solution-runs': props.task.state === dashboardStore.states?.solutionRuns?.value,
            'priority': props.task.priorityFlag,
            'on-hold': props.task.state === dashboardStore.states?.onHold?.value,
            'show-progress-bar': dashboardStore.showProgressBar,
            'active': props.task.active || dashboardStore.contextMenuTask?.id === props.task.id,
            'loading': props.task.loading,
            'draggable-task': props.draggable,
            'maximized': props.panelMaximized,
        };
    });

    const dateCreatedString = computed(() => {
        if(!props.task.dateCreated)
            return '';

        const dateParts = props.task.dateCreated.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    });

    const dateDeadlineString = computed(() => {
        if(!props.task.dateDeadline)
            return '';

        const dateParts = props.task.dateDeadline.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    });

    const deadlineTillDays = computed(() => {
        if(!props.task.dateDeadline)
            return null;

        const dateParts = props.task.dateDeadline.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        const days = date.getTime() - (new Date()).getTime();

        return Math.round(days / (1000 * 60 * 60 * 24));
    });

    const expectedReturnFinanceString = computed(() => {
        if(props.task.expectedReturnFinance)
            return helper.numberFormat(props.task.expectedReturnFinance, 0, ',', ' ') + ' kč';
        else return '';
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

    function deleteTask() {
        if(!confirm(translations.CONFIRM_DELETE_TASK))
            return;

        dashboardStore.deleteTask(props.config.endpoints.updateTask, props.task);
        modalStore.closeModal(props.task.id);
    }

    function markCompleted() {
        dashboardStore.completeTask(props.config.endpoints.updateTask, props.task);
        modalStore.closeModal(props.task.id);
    }

     function markAwaitingApproval() {
        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            state: dashboardStore.states.awaitingApproval.value,
            priorityFlag: false,
            deferredFlag: false,
            viewedFlag: true,
        });
    }

     function togglePriority() {
         dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            priorityFlag: !props.task.priorityFlag,
            deferredFlag: false,
            state: 'default',
            viewedFlag: true,
        });
    }

     function toggleDeferred() {
         dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            deferredFlag: !props.task.deferredFlag,
            priorityFlag: false,
            state: 'default',
            viewedFlag: true,
        });
    }

     function toggleViewed() {
         dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            viewedFlag: !props.task.viewedFlag,
        })
    }

    function taskClick(event) {
        if(isMobile.value)
            showContextMenu(event)
        else toggleActive();
    }

    function toggleActive() {
        const modal = modalStore.openedModalsByType['task-detail'].find(modal => modal.id === props.task.id);
        if(modal) {
            if(modal.minimized)
                modalStore.maximizeModal('task-detail', props.task.id);
            else modalStore.closeModal(props.task.id);
        } else modalStore.openModal('task-detail', props.task.id, props.task);
    }

    const isMobile = computed(() => {
        return screen.width <= 768;
    });

    function showContextMenu(event) {
        dashboardStore.openContextMenu(props.task, event.clientX, event.clientY);
    }

    const editingDateDeadline = ref(false);
    const editDateDeadline = ref(props.task.dateDeadline);
    const updateDateDeadline = () => {
        if(editDateDeadline.value === props.task.dateDeadline) {
            editingDateDeadline.value = false;
            return;
        }

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            dateDeadline: editDateDeadline.value,
        });

        editingDateDeadline.value = false;
    }

    const cancelEditDateDeadline = () => {
        editingDateDeadline.value = false;
        editDateDeadline.value = props.task.dateDeadline;
    }

    const editingProject = ref(false);
    const editProject = ref(props.task.project?.milestoneId);
    const updateProject = () => {
        if(editProject.value === props.task.project?.milestoneId) {
            editingProject.value = false;
            return;
        }

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            project: {
                milestoneId: editProject.value
            }
        });

        editingProject.value = false;
    }

    const cancelEditProject = () => {
        editingProject.value = false;
        editProject.value = props.task.project?.milestoneId;
    }


    const editingDepartment = ref(false);
    const editDepartment = ref(props.task.department?.id);
    const updateDepartment = () => {
        if(editDepartment.value === props.task.department?.id) {
            editingDepartment.value = false;
            return;
        }

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            department: {
                id: editDepartment.value
            }
        });

        editingDepartment.value = false;
    }

    const cancelEditDepartment = () => {
        editingDepartment.value = false;
        editDepartment.value = props.task.department?.id;
    }

    const addingSolver = ref(false);
    const addSolver = ref(null);
    function addOtherSolver() {
        const otherSolverIds = props.task.otherSolvers?.map((solver) => solver.id);

        if(!otherSolverIds.includes(addSolver.value)) {
            dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
                addOtherSolver: addSolver.value
            });
        }

        addSolver.value = null;
        addingSolver.value = false;
    }

    function cancelAddSolver() {
        addSolver.value = null;
        addingSolver.value = false;
    }

    function removeOtherSolver(otherSolver) {
        if(!confirm(translations.CONFIRM_DELETE_SOLVER))
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            removeOtherSolver: otherSolver
        });
    }
</script>

<template>
    <Tooltip v-show="task.isVisible" @contextmenu.prevent="showContextMenu($event)" @click.stop="taskClick($event)" class="task" :class="taskClasses" :data-task-id="task.id" :text="dateCreatedString" style="display: flex">
        <div class="left-content">
            <div class="icons left">
                <div v-if="draggable && canDrag" class="drag-handle">
                    <Icon icon="drag" color="#cde" :width="16" :height="16" />
                </div>
                <div class="priority" :class="priorityMap[task.priority]">
                    <div class="priority-point" />
                    <div class="priority-point" />
                    <div class="priority-point" />
                </div>
                <div class="error-reporting">
                    <Icon icon="exclamation-mark-alt" :width="3" :height="16" v-show="task.errorFlag" color="#e22" />
                </div>
                <div v-if="dashboardStore.panelFilters.panelType === 'solver' || dashboardStore.panelFilters.panelType === 'custom'" class="author">{{ task.author?.initials }}:</div>
                <div v-else class="solver">{{ task.solver?.initials }}:</div>
            </div>
            <div class="content">
                <div class="title">{{ task.title }}</div>
                <div class="icons inline">
                    <div class="viewed" @click.stop="toggleViewed" :class="{ 'not': !task.viewedFlag }" />
                </div>
            </div>
        </div>
        <div class="extra-content" v-show="panelMaximized">
            <div class="date-deadline" v-if="editingDateDeadline">
                <DatePicker v-model="editDateDeadline" @update:model-value="updateDateDeadline" />
                <Icon icon="close" width="16" height="16" color="#cde" @click.stop="cancelEditDateDeadline"/>
            </div>
            <Tooltip v-else class="date-deadline-tooltip" :text="deadlineTillDays === null ? '' : deadlineTillDays + ' dní'" @click.stop="editingDateDeadline = !editingDateDeadline">
                <Icon icon="calendar-checkmark" v-if="dateDeadlineString !== ''" :color="deadlineTillDays === null ? '#36557F' : (deadlineTillDays > 14 ? '#24C586' : (deadlineTillDays > 0 ? '#EFAD1F' : '#E82121'))" :width="16" :height="16" />
                <div>{{ dateDeadlineString }}</div>
            </Tooltip>
            <div v-if="editingProject" class="project-edit">
                <Select v-model="editProject" :options="projectsEnum" @update:model-value="updateProject" />
                <Icon class="edit-close" icon="close" width="16" height="16" color="#cde" @click.stop="cancelEditProject"/>
            </div>
            <div v-else class="project" @click.stop="editingProject = !editingProject">
                {{ task.project?.name }}
            </div>
            <Tooltip class="categories-count" :class="{ 'non-zero': (task.categories?.length ?? 0) > 0 }" :text="(task.categories?.length ?? 0) > 0 ? task.categories.map(category => category.name).join(', ') : 'Žádné kategorie'">
                <Icon icon="blocks" :width="16" :height="16" color="#36557f" />
                <div>{{ task.categories?.length ?? 0 }}</div>
            </Tooltip>
            <div v-if="editingDepartment" class="department-edit">
                <Select v-model="editDepartment" :options="departmentsEnum" @update:model-value="updateDepartment" />
                <Icon class="edit-close" icon="close" width="16" height="16" color="#cde" @click.stop="cancelEditDepartment"/>
            </div>
            <div v-else class="department"  @click.stop="editingDepartment = !editingDepartment">
                {{ task.department?.name }}
            </div>
            <div class="other-solvers" v-if="!addingSolver">
                <div class="add-solver" @click.stop="addingSolver = !addingSolver">
                    <Icon icon="plus" :width="12" :height="12" />
                </div>
                <Tooltip v-for="otherSolver in task.otherSolvers" :text="otherSolver.name" class="other-solver" :class="{ 'can-remove': userIsAuthor || userIsSolver || userIsProjectManager || userIsDepartmentManager }" @click.stop="removeOtherSolver(otherSolver.id)">
                    <Icon icon="user-photo" color="#36557F" :width="16" :height="16" :photo-path="otherSolver.icon" />
                    <Icon icon="delete" color="#fff" :width="16" :height="16" class="other-solver-delete" />
                </Tooltip>
            </div>
            <div v-else class="other-solvers-add">
                <Select v-model="addSolver" :options="usersEnum" filterable @update:model-value="addOtherSolver" />
                <Icon class="edit-close" icon="close" width="16" height="16" color="#cde" @click.stop="cancelAddSolver" />
            </div>
            <Tooltip class="attachment-count" :class="{ 'non-zero': (task.attachments?.length ?? 0) > 0 }" :text="translations.ATTACHMENTS">
                <Icon icon="clip" :width="16" :height="16" color="#36557f" />
                <div>{{ task.attachments?.length ?? 0 }}</div>
            </Tooltip>
            <Tooltip class="links-count" :class="{ 'non-zero': (task.links?.length ?? 0) > 0 }" :text="translations.LINKS">
                <Icon icon="link"  :width="16" :height="16" color="#36557f" />
                <div>{{ task.links?.length ?? 0 }}</div>
            </Tooltip>
            <Tooltip class="task-reply-count" :class="{ 'non-zero': (task.replies?.length ?? 0) > 0 }" :text="'Odpovědi'">
                <Icon icon="feedback-alt" :width="16" :height="16" color="#24C586" />
                <div>{{ task.replies?.length ?? 0 }}</div>
            </Tooltip>
            <Tooltip class="sub-task-count" :class="{ 'non-zero': task.subTaskCount && task.subTaskCount > 0 }" :text="'Podúkoly'">
                <Icon icon="tasks" :width="16" :height="16" color="#36557f" />
                <div>{{ task.subTaskCount ?? 0 }}</div>
            </Tooltip>
            <Tooltip class="expected-return" :class="{ 'non-zero': task.expectedReturnFinance && props.task.expectedReturnFinance > 0 }" v-if="config.allowedFeatures.includes('expectedReturn')" :html="true" :text="expectedReturnString === '' ? translations.EXPECTED_RETURN_FINANCE : expectedReturnString" max-width="200px">
                <Icon icon="trend-up" :width="16" :height="16" color="#36557f" />
                <div>{{ expectedReturnFinanceString }}</div>
            </Tooltip>
            <Tooltip class="expected-hours" :class="{ 'non-zero': task.expectedHours > 0 }" :text="translations.EXPECTED_HOURS">
                <Icon icon="hourglass" :width="16" :height="16" color="#36557f" />
                <div>{{ task.expectedHours }}h</div>
            </Tooltip>
        </div>
        <div class="icons right">
            <div class="task-actions">
                <Tooltip v-if="task.subTaskCount === 0 && userIsAuthor" :text="translations.MARK_DELETE"><Icon icon="delete" @click.stop="deleteTask" :width="16" :height="16" color="#e22" /></Tooltip>
                <Tooltip v-if="task.subTaskCount === 0 && task.state !== dashboardStore.states?.completed?.value && userIsAuthor" :text="translations.MARK_COMPLETE"><Icon icon="checkmark-square" @click.stop="markCompleted" :width="16" :height="16" color="#24C586" /></Tooltip>
                <Tooltip v-if="task.state !== dashboardStore.states?.awaitingApproval?.value" :text="translations.MARK_AWAITING_APPROVAL"><Icon icon="waiting-approve" @click.stop="markAwaitingApproval" :width="16" :height="16" color="#fb3" /></Tooltip>
                <Tooltip v-if="!task.priorityFlag && (userIsAuthor || userIsSolver)" :text="translations.MARK_PRIORITY"><Icon icon="danger" @click.stop="togglePriority" :width="16" :height="16" color="#e22" /></Tooltip>
                <Tooltip v-if="!task.deferredFlag && (userIsAuthor || userIsSolver)" :text="translations.MARK_DEFERRED"><Icon icon="clock-arrow" @click.stop="toggleDeferred" :width="16" :height="16" color="#7af" /></Tooltip>
            </div>
            <div class="other">
                <Tooltip v-if="config.allowedFeatures.includes('expectedReturn') && ((task.expectedReturn && task.expectedReturn.length > 0) || task.expectedReturnFinance > 0)" :html="true" :text="expectedReturnString" max-width="200px">
                    <Icon icon="euro" :width="16" :height="16" :color="expectedReturnColor" />
                </Tooltip>
                <Tooltip v-show="task.expectedHours > 0" class="expected-hours" :text="translations.EXPECTED_HOURS">
                    {{ task.expectedHours }}h
                </Tooltip>
                <Tooltip :text="translations.ATTACHMENTS" v-show="task.attachments?.length > 0" class="attachment">
                    <Icon icon="clip" :width="16" :height="16" color="#36557F" />
                </Tooltip>
                <Tooltip :text="translations.LINKS" v-show="task.links?.length > 0" class="link">
                    <Icon icon="link" :width="14" :height="14" color="#36557F" />
                </Tooltip>
                <Tooltip :text="'Podúkoly'" v-show="task.subTaskCount > 0" class="sub-tasks">
                    <Icon icon="tasks" :width="14" :height="14" color="#36557f" />
                </Tooltip>
                <Tooltip class="date-deadline" :text="dateDeadlineString === '' ? translations.DATE_DEADLINE : dateDeadlineString">
                    <Icon icon="calendar-checkmark" :width="16" :height="16" :color="deadlineTillDays === null ? '#36557F' : (deadlineTillDays > 14 ? '#24C586' : (deadlineTillDays > 0 ? '#EFAD1F' : '#E82121'))" />
                </Tooltip>
                <Tooltip class="feedback-replies" :text="'Odpovědi'">
                    <Icon icon="feedback-alt" :width="16" :height="16" color="#24C586" />
                    <div>{{ task.replies?.length ?? 0 }}</div>
                </Tooltip>
            </div>
        </div>
    </Tooltip>
</template>

<style scoped>
    .task {
        display: flex;
        gap: 4px;
        padding: 4px;
        cursor: pointer;
        align-items: center;
        position: relative;
        max-width: 100%;

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
                animation: task-loading 1s linear infinite;
                background-size: 200% 100%;
            }
        }

        .left-content {
            display: flex;
            gap: 4px;
            align-items: center;
            flex-grow: 1;
            overflow: hidden;
        }

        .icons {
            display: flex;
            gap: 4px;
            align-items: center;

            &.left {
                .drag-handle {
                    display: flex;
                    align-items: center;
                    cursor: grab;

                    &:active {
                        cursor: grabbing;
                    }
                }

                .priority {
                    width: 4px;
                    min-width: 4px;
                    height: 20px;
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

                .author {
                    color: #24C586;
                    width: fit-content;
                }

                .solver {
                    color: #11acff;
                    width: fit-content;
                }
            }

            &.right {
                margin-left: auto;

                .task-actions {
                    display: none;
                    align-items: center;
                    gap: 4px;
                }

                .other {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .expected-hours {
                    font-weight: 500;
                    color: #16f;
                    height: 18px;
                }

                .date-deadline {
                    width: 16px;
                    min-width: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .feedback-replies {
                    display: flex;
                    align-items: center;
                    color: #36557F;

                    & > div {
                        min-width: 16px;
                        text-align: center;
                    }
                }

                .feedback-replies {
                    color: #24C586;
                }

                .attachment {
                    display: flex;
                    align-items: center;
                    min-width: 16px;
                    height: 16px;
                }

                .link {
                    display: flex;
                    align-items: center;
                    min-width: 16px;
                }
            }

            &.inline {
                flex-shrink: 0;
                display: flex;
                margin-left: 4px;

                .viewed {
                    min-width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #cde;
                    box-shadow: 0 2px 4px #398DD33F;
                    cursor: pointer;

                    &.not {
                        background-color: #16f;
                    }
                }
            }
        }

        .content {
            display: flex;
            flex-grow: 1;
            align-items: center;
            overflow: hidden;

            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .extra-content {
            display: flex;
            align-items: center;
            gap: 11px;
            color: #1c293b;
            font-weight: 500;
            margin-left: 30px;
            font-size: 12px;

            .other-solvers {
                display: flex;
                align-items: center;
                width: 180px;
                overflow: hidden;

                .add-solver {
                    margin-right: 6px;
                    border-radius: 50%;
                    color: #36557f;
                    background-color: #e8efff;
                    cursor: pointer;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .other-solver {
                    position: relative;
                    border-radius: 50%;
                    border: 2px solid #fff;

                    &:not(:first-child) {
                        margin-left: -.5rem;
                    }

                    .other-solver-delete {
                        position: absolute;
                        background-color: #abd;
                        border-radius: 50%;
                        padding: 2px;
                        top: 0;
                        left: 0;
                        display: none;
                    }

                    &.can-remove {
                        &:hover {
                            .other-solver-delete {
                                cursor: pointer;
                                display: block;
                            }
                        }
                    }
                }
            }

            .other-solvers-add {
                font-weight: 600;
                width: 180px;
                display: flex;
                align-items: center;
                gap: 4px;
                height: 16px;

                .edit-close {
                    min-width: 16px;
                }

                &:deep(.input-wrapper) {
                    min-height: 20px;
                    height: 20px;
                    max-width: 160px;

                    .input {
                        font-size: 10px;
                    }
                }
            }

            .date-deadline-tooltip {
                font-weight: 600;
                width: 110px;
                display: flex;
                align-items: center;
                gap: 4px;
                height: 16px;

                &:hover {
                    border-radius: 6px;
                    background-color: #cde;
                }
            }

            .date-deadline {
                font-weight: 600;
                width: 110px;
                display: flex;
                align-items: center;
                gap: 4px;
                height: 16px;

                &:deep(.date-time-wrapper .input-wrapper input) {
                    min-height: 20px;
                    height: 20px;
                    padding: 0 21px 0 21px;
                }

                &:deep(.date-time-wrapper .input-wrapper .dp__input_icon) {
                    padding: 0 4px;
                }

                &:deep(.date-time-wrapper .input-wrapper .dp--clear-btn .dp__icon) {
                    padding: 0 4px;
                }
            }

            .project-edit, .department-edit {
                font-weight: 600;
                width: 90px;
                display: flex;
                align-items: center;
                gap: 4px;
                height: 16px;

                .edit-close {
                    min-width: 16px;
                }

                &:deep(.input-wrapper) {
                    min-height: 20px;
                    height: 20px;
                    max-width: 70px;

                    .input {
                        font-size: 10px;
                    }
                }
            }

            .project,
            .department {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 90px;
                font-weight: 600;
                height: 16px;

                &:hover {
                    border-radius: 6px;
                    background-color: #cde;
                }
            }

            .attachment-count,
            .links-count,
            .sub-task-count,
            .expected-hours,
            .expected-return,
            .categories-count,
            .task-reply-count {
                display: flex;
                align-items: center;
                width: 35px;
                gap: 2px;
                color: #36557f;
                opacity: 0.4;

                svg {
                    min-width: 16px;
                }

                &.non-zero {
                    opacity: 1;
                }
            }

            .categories-count {
                width: 70px;
            }

            .expected-return {
                width: 120px;
            }

            .task-reply-count {
                color: #24C586;
            }
        }

        &:not(.draggable-task) {
            .icons.left .drag-handle {
                display: none;
            }

            .icons.left {
                display: none;
            }
        }

        &.sortable-chosen {
            background-color: #24C58633;
        }

        &.on-hold {
            color: #78a;
        }

        &.priority:not(.awaiting-approval) {
            font-weight: 700;
        }

        &.awaiting-approval {
            color: #fb3;
        }

        &.solution-runs {
            color: #24C586;
        }

        &::after {
            content: "";
            position: absolute;
            display: block;
            max-width: 0;
            width: 100%;
            height: 2px;
            background-color: #24C586;
            left: 0;
            bottom: 0;
            transition: max-width .3s;
        }

        &:hover, &.active {
            background-color: #f0fcf4;

            &::after {
                max-width: v-bind('task.percentProgress + "%"');
            }

            .icons.right .task-actions {
                display: flex;
            }
        }

        &.show-progress-bar {
            &::after {
                max-width: v-bind('task.percentProgress + "%"');
            }
        }

        &:not(:last-child) {
            border-bottom: 1px solid #f4f7ff;
        }

        &.maximized {
            .icons.right .task-actions {
                display: flex;
            }

            .icons.right .other {
                display: none;
            }

            .left-content {
                width: 346px;
                max-width: 346px;
            }
        }
    }

    html.prefer-dark, html.dark-theme {
        .task {
            .icons {
                &.left {
                    svg {
                        color: #c8c8c8 !important;
                    }

                    .priority {
                        .priority-point {
                            background-color: #c8c8c8;
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
                        svg {
                            color: #e22 !important;
                        }
                    }
                }

                &.right {
                    .expected-hours {
                        color: #58e;
                    }

                    .sub-tasks {
                        color: #c8c8c8;
                    }

                    .sub-tasks, .link, .attachment, .date-deadline {
                        svg {
                            color: #c8c8c8 !important;
                        }
                    }

                    .feedback-replies {
                        color: #24C586;

                        svg {
                            color: #24C586 !important;
                        }
                    }
                }

                &.inline {
                    .viewed {
                        &.not {
                            background-color: #58e;
                        }
                    }
                }
            }

            .extra-content {
                color: #c8c8c8;

                .attachment-count,
                .links-count,
                .sub-task-count,
                .expected-hours,
                .expected-return{
                    color: #c8c8c8;

                    svg {
                        color: #c8c8c8 !important;
                    }
                }

                .task-reply-count {
                    color: #24C586;

                    svg {
                        color: #24C586 !important;
                    }
                }
            }

            &.on-hold {
                color: #91a5d0;
            }

            &:hover, &.active {
                background-color: #6f7774;
            }

            &:not(:last-child) {
                border-bottom: 1px solid #555;
            }
        }
    }

    @keyframes task-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>