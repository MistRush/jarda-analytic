<script setup>
    import { ref, watch, computed, onMounted } from "vue";
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import {useTranslations} from "@/Composables/useTranslation.js";
    import {useHelper} from "@/Composables/useHelper";

    import Modal from "@/Components/Modal/Modal.vue";
    import Tooltip from "@/Components/Other/Tooltip.vue";
    import TaskModalHeaderNode from "@/Dashboard/TaskModal/TaskModalHeaderNode.vue";
    import TaskModalAttachment from "@/Dashboard/TaskModal/TaskModalAttachment.vue";
    import TaskModalReply from "@/Dashboard/TaskModal/TaskModalReply.vue";
    import TaskModalReplyForm from "@/Dashboard/TaskModal/TaskModalReplyForm.vue";
    import TaskModalSubTask from "@/Dashboard/TaskModal/TaskModalSubTask.vue";
    import TaskModalCreateSubTask from "@/Dashboard/TaskModal/TaskModalCreateSubTask.vue";

    import Slider from "@/Components/Inputs/Slider.vue";
    import Checkbox from "@/Components/Inputs/Checkbox.vue";
    import {useAlerts} from "@/Composables/useAlerts.js";
    import InputField from "@/Components/Inputs/InputField.vue";
    import TinyMCE from "@/Components/Inputs/TinyMCE.vue";

    const props = defineProps({
        show: Boolean,
        config: Object,
        task: Object|null,
        useVShow: {
            type: Boolean,
            default: false,
        }
    });

    const emit = defineEmits(['close']);
    const {translations} = useTranslations();
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);
    const helper = useHelper();
    const alerts = useAlerts();

    const subTasks = computed(() => {
        return dashboardStore.dashboardSubTasks?.filter((subTask) => subTask.parentTaskId === props.task.id);
    });

    const userIsAdmin = computed(() => {
        return props.config.permissions.includes('admin');
    });

    const userIsAuthor = computed(() => {
        return userIsAdmin.value || props.config.currentUser == props.task.author?.id || props.config.currentUserSubUsers.includes(props.task.author?.id)
    });

    const userOrSubUserIsSolver = computed(() => {
        return userIsAdmin.value || props.config.currentUser == props.task.solver?.id || props.config.currentUserSubUsers.includes(props.task.solver?.id)
    });

    const userIsDepartmentManager = computed(() => {
        return userIsAdmin.value || props.task.department?.managerIds?.includes(props.config.currentUser);
    });

    const statesTranslated = computed(() => {
        return {
            [dashboardStore.states?.new.value]: dashboardStore.states?.new.name,
            [dashboardStore.states?.onHold.value]: dashboardStore.states?.onHold.name,
            [dashboardStore.states?.amended.value]: dashboardStore.states?.amended.name,
            [dashboardStore.states?.solutionRuns.value]: dashboardStore.states?.solutionRuns.name,
            [dashboardStore.states?.awaitingApproval.value]: dashboardStore.states?.awaitingApproval.name,
            [dashboardStore.states?.completed.value]: dashboardStore.states?.completed.name,
            [dashboardStore.states?.canceled.value]: dashboardStore.states?.canceled.name,
        }
    });

    const stateClass = computed(() => {
        return {
            'light-green': props.task.state === dashboardStore.states?.new.value || props.task.state === dashboardStore.states?.solutionRuns.value || props.task.state === dashboardStore.states?.onHold.value || props.task.state === dashboardStore.states?.amended.value,
            'green': props.task.state === dashboardStore.states?.completed.value,
            'yellow': props.task.state === dashboardStore.states?.awaitingApproval.value,
            'red': props.task.state === dashboardStore.states?.canceled.value,
        }
    });

    const prioritiesTranslated = computed(() => {
        return {
            [dashboardStore.priorities?.low.value]: dashboardStore.priorities?.low.name,
            [dashboardStore.priorities?.medium.value]: dashboardStore.priorities?.medium.name,
            [dashboardStore.priorities?.high.value]: dashboardStore.priorities?.high.name,
        }
    });

    const prioritiesEnum = computed(() => {
        return [
            { value: dashboardStore.priorities?.low.value, text: dashboardStore.priorities?.low.name },
            { value: dashboardStore.priorities?.medium.value, text: dashboardStore.priorities?.medium.name },
            { value: dashboardStore.priorities?.high.value, text: dashboardStore.priorities?.high.name },
        ];
    });

    const categoriesEnum = computed(() => {
        return dashboardStore.categories?.map((category) => {
            return { value: category.id, text: category.name };
        });
    });

    const projectsEnum = computed(() => {
        return dashboardStore.projectMilestones?.map((project) => {
            return { value: project.id, text: project.name };
        });
    });

    const usersEnum = computed(() => {
        return dashboardStore.users?.map((user) => {
            return { value: user.id, text: user.name };
        });
    });

    const departmentsEnum = computed(() => {
        return dashboardStore.departments?.map((department) => {
            return { value: department.id, text: department.name };
        });
    })

    const priorityClass = computed(() => {
        return {
            'high': props.task.priority === dashboardStore.priorities?.high.value,
            'medium': props.task.priority === dashboardStore.priorities?.medium.value,
            'low': props.task.priority === dashboardStore.priorities?.low.value,
        }
    });

    const dateCreatedString = computed(() => {
        if(!props.task.dateCreated)
            return '';

        const dateParts = props.task.dateCreated.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    });

    const dateStartString = computed(() => {
        if(!props.task.dateStart)
            return '';

        const dateParts = props.task.dateStart.split('-');
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

    const dateDeadlineDifference = computed(() => {
        if(!props.task.dateDeadline)
            return '';

        const dateParts = props.task.dateDeadline.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        const now = new Date();
        const difference = now.getTime() - date.getTime();
        return Math.round(difference / (1000 * 60 * 60 * 24));
    });

    const dateUpdatedString = computed(() => {
        if(!props.task.dateUpdated)
            return '';

        const dateParts = props.task.dateUpdated.split('-');
        const date = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
        const now = new Date();
        const difference = now.getTime() - date.getTime();
        return Math.round(difference / (1000 * 60 * 60 * 24)) + ' dní';
    });

    const expectedReturnString = computed(() => {
        if(props.task.expectedReturnFinance && props.task.expectedReturnFinance > 0)
            return helper.numberFormat(props.task.expectedReturnFinance, 0, ',', ' ') + ' kč';
        else return '';
    });

    const taskContent = computed(() => {
        if(!props.task.content || props.task.content.length === 0)
            return props.task.content;

        return props.task.content.replace(
            /<a\s+([^>]*?)(target\s*=\s*(['"])[^>]*?\3)?([^>]*?)>/gi,
            (match, p1, p2, p3, p4) => {
                if (!p2) {
                    return `<a ${p1} target="_blank" ${p4}>`;
                }

                return match;
            }
        );
    });

    const contentRef = ref(null);
    const showMore = ref(false);
    const isTruncated = ref(false);
    const checkTruncation = () => {
        if (contentRef.value)
            isTruncated.value = contentRef.value.scrollHeight > 150;
    };

    onMounted(() => {
        const el = contentRef.value;
        if (!el)
            return;

        const images = el.querySelectorAll('img');
        let loadedImages = 0;

        if (images.length === 0) {
            checkTruncation();
            return;
        }

        const onImageLoad = () => {
            loadedImages++;
            if (loadedImages === images.length)
                checkTruncation();
        };

        images.forEach(img => {
            if (img.complete) {
                onImageLoad();
            } else {
                img.addEventListener('load', onImageLoad);
                img.addEventListener('error', onImageLoad);
            }
        });
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
            state: dashboardStore.states?.awaitingApproval.value,
            priorityFlag: false,
            deferredFlag: false,
            viewedFlag: true,
        });
    }

    function togglePriority() {
         dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            priorityFlag: !props.task.priorityFlag,
            deferredFlag: false,
            state: dashboardStore.states?.new.value,
            viewedFlag: true,
        });
    }

    function toggleDeferred() {
         dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            deferredFlag: !props.task.deferredFlag,
            priorityFlag: false,
            state: dashboardStore.states?.new.value,
            viewedFlag: true,
        });
    }

    const taskApproved = ref(props.task.approved);
    function toggleApproved(approved) {
        if(!userIsDepartmentManager.value)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            approved: approved,
        });
    }

    watch(() => taskApproved.value,  (newValue) => {
        if(props.task.approved !== newValue) {
            toggleApproved(newValue);
            taskApproved.value = props.task.approved;
        }
    })

    function updatePriority(priority) {
        if(props.task.priority === priority)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            priority: priority,
        });
    }

    function addCategory(category) {
        const categoryIds = props.task.categories?.map((category) => category.id);

        if(!categoryIds.includes(category)) {
            dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
                addCategory: category
            });
        }
    }

    function removeCategory(category) {
        if(!userIsAuthor.value && !userOrSubUserIsSolver.value)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            removeCategory: category
        });
    }

    function updateSolver(solverId) {
        if(!solverId || solverId == '0' || props.task.solver?.id === solverId)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            solver: {
                id: solverId
            }
        });

        if(dashboardStore.panelFilters.panelType === 'solver')
            modalStore.scrollToActiveTask(props.task.id);
    }

    function updateAuthor(authorId) {
        if(!authorId || authorId == '0' || props.task.author?.id === authorId)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            author: {
                id: authorId
            }
        });

        if(dashboardStore.panelFilters.panelType === 'author')
            modalStore.scrollToActiveTask(props.task.id);
    }

    function updateDeadline(dateDeadline) {
        if(props.task.dateDeadline === dateDeadline)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            dateDeadline: dateDeadline,
        });
    }

    function updateDateStart(dateStart) {
        if(props.task.dateStart === dateStart)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            dateStart: dateStart,
        });
    }

    function addOtherSolver(otherSolver) {
        const otherSolverIds = props.task.otherSolvers?.map((solver) => solver.id);

        if(!otherSolverIds.includes(otherSolver)) {
            dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
                addOtherSolver: otherSolver
            });
        }
    }

    function removeOtherSolver(otherSolver) {
        if(!userIsAuthor.value && !userOrSubUserIsSolver.value)
            return;

        if(!confirm(translations.CONFIRM_DELETE_SOLVER))
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            removeOtherSolver: otherSolver
        });
    }

    function updateDepartment(departmentId) {
        if(!departmentId || departmentId == '0' || props.task.department?.id === departmentId)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            department: {
                id: departmentId
            }
        });
    }

    function updateProject(projectId) {
        if(!projectId || projectId == '0' || props.task.project?.milestoneId === projectId)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            project: {
                milestoneId: projectId
            }
        });

        if(dashboardStore.panelFilters.panelType === 'project')
            modalStore.scrollToActiveTask(props.task.id);
    }

    function updateExpectedHours(expectedHours) {
        if(props.task.expectedHours === expectedHours)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            expectedHours: expectedHours,
        });
    }

    function updateExpectedReturnFinance(expectedReturnFinance) {
        if(props.task.expectedReturnFinance === expectedReturnFinance)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            expectedReturnFinance: expectedReturnFinance,
        });
    }

    function updateExpectedReturn(expectedReturn) {
        if(props.task.expectedReturn === expectedReturn)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            expectedReturn: expectedReturn,
        });
    }

    const editingTitle = ref(false);
    const editTitle = ref(props.task.title);
    function updateTitle() {
        editingTitle.value = false;
        if(props.task.title === editTitle.value)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            title: editTitle.value,
        });

        editTitle.value = props.task.title;
    }

    const editingContent = ref(false);
    const editContent = ref(props.task.content);
    function updateContent() {
        editingContent.value = false;
        if(props.task.content === editContent.value)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            content: editContent.value,
        });

        editContent.value = props.task.content;
    }

    function updatePercentProgress() {
        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
            percentProgress: props.task.percentProgress,
        });
    }

    const draggingPercentProgress = ref(props.task.percentProgress);
    function updateDraggingPercentProgress(percentProgress) {
        draggingPercentProgress.value = percentProgress;
    }

    const files = ref([]);
    const isDragging = ref(false);
    const fileInput = ref(null);
    function handleDragOver() {
        isDragging.value = true;
    }

    function handleDragLeave(event) {
        if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) {
            return;
        }

        isDragging.value = false;
    }

    function handleDrop(event) {
        isDragging.value = false;
        const droppedFiles = Array.from(event.dataTransfer.files);
        files.value = [...files.value, ...droppedFiles];
        uploadNewFiles();
    }

    function handleFileSelect(event) {
        const selectedFiles = Array.from(event.target.files);
        files.value = [...files.value, ...selectedFiles];
        event.target.value = null;
        uploadNewFiles();
    }

    function uploadNewFiles() {
        if(files.value.length === 0)
            return;

        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.task, {
           attachments: files.value,
        });

        files.value = [];
    }

    function onAttachmentDeleted(attachment) {
        const fileIndex = props.task.attachments.findIndex(a => a.id === attachment.id);
        if (fileIndex !== -1)
            props.task.attachments.splice(fileIndex, 1);
    }

    async function copyNumber() {
        await navigator.clipboard.writeText(props.task.number);
        alerts.alert(translations.COPY_TO_CLIPBOARD, 'success');
    }

    function backToParent() {
        const modal = modalStore.openedModalsByType['task-detail'].find(modal => modal.id === props.task.parentTaskId);
        if(modal) {
            if(modal.minimized)
                modalStore.maximizeModal('task-detail', props.task.parentTaskId);
            else modalStore.closeModal(props.task.parentTaskId);
        } else {
            let foundTask = null;
            dashboardStore.dashboardPanels?.forEach(panel => {
                if(foundTask) return;

                panel.taskLists?.forEach(taskList => {
                    if(foundTask) return;

                    foundTask = taskList.tasks?.find(task => task.id === props.task.parentTaskId);
                });
            });

            if(!foundTask)
                foundTask = dashboardStore.dashboardSubTasks?.find(task => task.id === props.task.parentTaskId);

            modalStore.openModal('task-detail', props.task.parentTaskId, foundTask);
        }
    }

    const isMobile = computed(() => {
        return screen.width <= 768;
    });

    function close() {
        emit('close');
    }
</script>

<template>
    <Modal
        :isVisible="show"
        position="right"
        size="exact"
        :sizeExact="900"
        :block-page="false"
        :full-height="true"
        :use-v-show="useVShow"
        @update:is-visible="close"
    >
        <template v-slot:header>
            <div class="task-modal-header">
                <div class="task-modal-title">
                    <div v-if="task.parentTaskId" class="back-button" @click="backToParent">
                        <Icon icon="arrow" :width="12" :height="12" color="#000" direction="left"/>
                    </div>
                    <Tooltip v-if="!editingTitle" class="title" :class="{ editable: userIsDepartmentManager || userIsAuthor }" :text="task.title" @click="userIsDepartmentManager || userIsAuthor ? editingTitle = true : null">{{ task.title }}</Tooltip>
                    <div v-else class="inline-edit-title">
                        <InputField
                            class="inline-edit-title-input"
                            v-model="editTitle"
                            @blur="updateTitle"
                            @keyup.enter="updateTitle"
                            @keyup.esc.stop="editingTitle = false"
                        />
                        <div class="inline-edit-title-icons">
                            <Icon icon="checkmark-circle" @click="updateTitle" :width="16" :height="16" color="#36557F" />
                            <Icon icon="close" @click="editingTitle = false" :width="16" :height="16" color="#36557F" />
                        </div>
                    </div>
                </div>
                <div v-if="!isMobile" class="task-modal-actions">
                    <Tooltip v-if="task.subTaskCount === 0 && userIsAuthor" :text="translations.MARK_DELETE"><Icon icon="delete" @click.stop="deleteTask" :width="16" :height="16" color="#e22" /></Tooltip>
                    <Tooltip v-if="task.subTaskCount === 0 && userIsAuthor && task.state !== dashboardStore.states?.completed.value" :text="translations.MARK_COMPLETE"><Icon icon="checkmark-square" @click.stop="markCompleted" :width="16" :height="16" color="#24C586" /></Tooltip>
                    <Tooltip v-if="task.state !== dashboardStore.states?.awaitingApproval.value" :text="translations.MARK_AWAITING_APPROVAL"><Icon icon="waiting-approve" @click.stop="markAwaitingApproval" :width="16" :height="16" color="#fb3" /></Tooltip>
                    <Tooltip v-if="(userIsAuthor || userOrSubUserIsSolver) && !task.priorityFlag" :text="translations.MARK_PRIORITY"><Icon icon="danger" @click.stop="togglePriority" :width="16" :height="16" color="#e22" /></Tooltip>
                    <Tooltip v-if="userIsAuthor || userOrSubUserIsSolver && !task.deferredFlag" :text="translations.MARK_DEFERRED"><Icon icon="clock-arrow" @click.stop="toggleDeferred" :width="16" :height="16" color="#7af" /></Tooltip>
                    <Icon icon="minus" @click.stop="modalStore.minimizeModal('task-detail', task.id)" :width="16" :height="16" color="#89A" />
                </div>
            </div>
        </template>
        <template v-slot:body>
            <div
                class="drop-zone"
                :class="[{ 'drop-zone-active': isDragging, 'loading': task.loading }, config.theme]"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
            >
                <div class="task-detail">
                    <div class="task-header">
                        <TaskModalHeaderNode
                            :title="translations.PROJECT"
                            icon="case"
                            :allow-inline-edit="userIsAuthor"
                            :inline-edit-type="'enum'"
                            :inline-edit-default-value="{ value: task.project?.milestoneId, text: task.project?.name }"
                            :inline-edit-enum-options="projectsEnum"
                            @inline-edited="updateProject"
                        >
                            {{ task.project?.name }}
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.EXPECTED_HOURS"
                            icon="hourglass"
                            :allow-inline-edit="userOrSubUserIsSolver"
                            :inline-edit-type="'number'"
                            :inline-edit-default-value="task.expectedHours"
                            @inline-edited="updateExpectedHours"
                        >
                            {{ task.expectedHours === 0 ? '' : task.expectedHours + 'h' }}
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            title="Feedback"
                            icon="feedback-alt"
                        >
                            <Icon icon="copy"  @click="copyNumber" style="cursor: pointer" :width="16" :height="16" color="black" />
                            {{ task.number }}
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.DATE_CREATED"
                            icon="calendar-number"
                        >
                            {{ dateCreatedString }}
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.CATEGORY"
                            icon="blocks"
                            :allow-inline-edit="userIsAuthor || userOrSubUserIsSolver"
                            :inline-edit-type="'enum'"
                            :inline-edit-default-value="null"
                            :inline-edit-enum-options="categoriesEnum"
                            @inline-edited="addCategory"
                        >
                            <Tooltip class="categories" :class="{ 'can-remove': userIsAuthor || userOrSubUserIsSolver }" :text="(task.categories?.length ?? 0) > 0 ? task.categories.map(category => category.name).join(',') : 'Žádné kategorie'">
                                <div v-for="(category, index) in task.categories" class="category" @click="removeCategory(category.id)">
                                    <span>{{ category.name }}</span>
                                    <span class="category-separator">{{ index < task.categories.length - 1 ? ',' : '' }}</span>
                                </div>
                            </Tooltip>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.DATE_START"
                            icon="clock-arrow"
                            :allow-inline-edit="userOrSubUserIsSolver"
                            :inline-edit-type="'date'"
                            :inline-edit-default-value="task.dateStart"
                            @inline-edited="updateDateStart"
                        >
                            {{ dateStartString }}
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.DEPARTMENT"
                            icon="department"
                            :allow-inline-edit="userIsAuthor"
                            :inline-edit-type="'enum'"
                            :inline-edit-default-value="{ value: task.department?.id, text: task.department?.name }"
                            :inline-edit-enum-options="departmentsEnum"
                            @inline-edited="updateDepartment"
                        >
                            <div>{{ task.department?.name }}</div>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.DATE_DEADLINE"
                            icon="calendar-checkmark"
                            :allow-inline-edit="userIsAuthor || userOrSubUserIsSolver"
                            :inline-edit-type="'date'"
                            :inline-edit-default-value="task.dateDeadline"
                            @inline-edited="updateDeadline"
                        >
                            <div style="display: flex; align-items: center; gap: 1rem">
                                <span>{{ dateDeadlineString }}</span>
                                <span v-if="dateDeadlineString.length > 0" :style="dateDeadlineDifference >= 0 ? 'color: #e22' : (dateDeadlineDifference >= -14 ? 'color: #fb3' : 'color: #24C586')">{{ Math.abs(dateDeadlineDifference) }} dní</span>
                            </div>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.AUTHOR"
                            icon="user"
                            :allow-inline-edit="userIsAdmin"
                            :inline-edit-type="'enum'"
                            :inline-edit-default-value="{ value: task.author?.id, text: task.author?.name }"
                            :inline-edit-enum-options="usersEnum"
                            @inline-edited="updateAuthor"
                        >
                            <div class="user">
                                <Icon icon="user-photo" color="#36557F" :width="20" :height="20" :photo-path="task.author?.icon" />
                                <div>{{ task.author?.name }}</div>
                            </div>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.PRIORITY"
                            icon="priority"
                            :allow-inline-edit="userOrSubUserIsSolver"
                            :inline-edit-type="'enum'"
                            :inline-edit-default-value="task.priority"
                            :inline-edit-enum-options="prioritiesEnum"
                            @inline-edited="updatePriority"
                        >
                            <div class="priority" :class="priorityClass">
                                {{ prioritiesTranslated[task.priority] ?? task.priority }}
                            </div>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            v-if="dashboardStore.panelFilters.panelType !== 'custom'"
                            :title="translations.SOLVER"
                            icon="user"
                            :allow-inline-edit="userIsAuthor || userOrSubUserIsSolver"
                            :inline-edit-type="'enum'"
                            :inline-edit-default-value="{ value: task.solver?.id, text: task.solver?.name }"
                            :inline-edit-enum-options="usersEnum"
                            @inline-edited="updateSolver"
                        >
                            <div class="user">
                                <Icon icon="user-photo" color="#36557F" :width="20" :height="20" :photo-path="task.solver?.icon" />
                                <div>{{ task.solver?.name }}</div>
                            </div>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :title="translations.STATE"
                            icon="state"
                        >
                            <div style="display: flex; align-items:center; gap: 0.25rem">
                                <div class="state" :class="stateClass">
                                    {{ statesTranslated[task.state] ?? task.state }}
                                </div>
                                <div>{{ dateUpdatedString }}</div>
                            </div>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            v-if="config.allowedFeatures.includes('otherSolvers') && dashboardStore.panelFilters.panelType !== 'custom'"
                            :title="translations.OTHER_SOLVERS"
                            icon="users-alt"
                            :allow-inline-edit="userIsAuthor || userOrSubUserIsSolver"
                            :inline-edit-type="'enum'"
                            :inline-edit-default-value="null"
                            :inline-edit-enum-options="usersEnum"
                            @inline-edited="addOtherSolver"
                        >
                            <div class="users">
                                <Tooltip v-for="otherSolver in task.otherSolvers" :text="otherSolver.name" class="other-solver" :class="{ 'can-remove': userIsAuthor || userOrSubUserIsSolver }" @click="removeOtherSolver(otherSolver.id)">
                                    <Icon icon="user-photo" color="#36557F" :width="20" :height="20" :photo-path="otherSolver.icon" />
                                    <Icon icon="delete" color="#fff" :width="20" :height="20" class="other-solver-delete" />
                                </Tooltip>
                            </div>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            v-if="config.allowedFeatures.includes('departments')"
                            :title="'Schváleno'"
                            icon="checkmark-square"
                        >
                            <Checkbox :class="{ readonly: !userIsDepartmentManager }" v-model="taskApproved" :label="task.approved ? 'Ano': 'Ne' " />
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            v-if="config.allowedFeatures.includes('expectedReturn')"
                            :title="translations.EXPECTED_RETURN_FINANCE"
                            icon="trend-up"
                            :allow-inline-edit="userIsAuthor"
                            :inline-edit-type="'number'"
                            :inline-edit-default-value="task.expectedReturnFinance"
                            @inline-edited="updateExpectedReturnFinance"
                        >
                            {{ expectedReturnString }}
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :full-width="true"
                            class="full-width"
                            v-if="config.allowedFeatures.includes('expectedReturn')"
                            :title="translations.EXPECTED_RETURN"
                            icon="chat"
                            :allow-inline-edit="userIsAuthor"
                            :inline-edit-type="'textarea'"
                            :inline-edit-default-value="task.expectedReturn"
                            @inline-edited="updateExpectedReturn"
                        >
                            <div>
                                {{ !task.expectedReturn || task.expectedReturn.length === 0 ? '' : task.expectedReturn }}
                            </div>
                        </TaskModalHeaderNode>
                        <TaskModalHeaderNode
                            :full-width="true" class="full-width"
                            :title="translations.PERCENT_PROGRESS"
                            icon="percent"
                        >
                            <div class="flex w-full">
                                <div class="flex-grow">
                                    <Slider :min="0" :max="100" :step="1" :readonly="!(userIsAuthor || userOrSubUserIsSolver)" v-model="task.percentProgress" @change="updatePercentProgress" @input="updateDraggingPercentProgress" />
                                </div>
                                <div>
                                    {{ draggingPercentProgress !== task.percentProgress ? draggingPercentProgress : task.percentProgress }}%
                                </div>
                            </div>
                        </TaskModalHeaderNode>
                    </div>
                    <div class="task-content">
                        <div class="task" :class="{ editable: userIsDepartmentManager || userIsAuthor }" @click="userIsDepartmentManager || userIsAuthor ? editingContent = true : null">{{ translations.TASK_CONTENT }}</div>
                        <div v-if="!editingContent" class="content-wrapper" ref="contentRef" :class="{ 'expanded': showMore, 'truncated': isTruncated }" >
                            <div class="content no-tailwind" v-html="taskContent" />
                        </div>
                        <button class="show-more" v-if="isTruncated && !showMore && !editingContent" @click="showMore = !showMore">
                            <span>Číst více</span>
                            <span class="show-more-button"><Icon icon="plus" :width="12" :height="12" color="#fff" /></span>
                        </button>
                        <div v-if="editingContent" class="inline-edit-content">
                            <TinyMCE
                                compact
                                class="inline-edit-content-input"
                                v-model="editContent"
                            />
                            <div class="inline-edit-content-icons">
                                <Icon icon="checkmark-circle" @click="updateContent" :width="16" :height="16" color="#36557F" />
                                <Icon icon="close" @click="editingContent = false" :width="16" :height="16" color="#36557F" />
                            </div>
                        </div>
                        <div v-if="!task.parentTaskId" class="sub-task-title">Podúkoly</div>
                        <div v-if="!task.parentTaskId" class="sub-tasks">
                            <TaskModalSubTask
                                v-for="subTask in subTasks"
                                :key="subTask.id"
                                :config="config"
                                :sub-task="subTask"
                            />
                            <TaskModalCreateSubTask
                                :key="task.id + '_' + subTasks?.length"
                                :config="config"
                                :parent-task="task"
                            />
                            <div
                                class="new-task"
                                @click.stop="modalStore.openModal('task-create', 'task-create', {
                                    parentTaskId: task.id,
                                    title: task.title,
                                    solver: {
                                        id: task.solver.id,
                                        name: task.solver.name,
                                    }
                                })"
                            >
                                <span class="icon">
                                    <Icon icon="plus" :width="8" :height="8" color="#24C586" />
                                </span>
                                <span>{{ translations.NEW_TASK }}</span>
                            </div>
                        </div>
                        <div class="task-attachments">
                            <div class="task-attachments-title">{{ translations.ATTACHMENTS }}</div>
                            <div class="task-attachment-list">
                                <TaskModalAttachment
                                    v-for="attachment in task.attachments"
                                    :key="attachment.id"
                                    :attachment="attachment"
                                    :endpoints="config.endpoints"
                                    @deleted="onAttachmentDeleted"
                                />
                                <div class="task-attachment-upload-area" @click="fileInput.click()">
                                    <Icon icon="upload" :width="16" :height="16" color="#24C586" />
                                    <span>{{ translations.CHOOSE_FILES }}</span>
                                    <input
                                        type="file"
                                        multiple
                                        class="file-input"
                                        @change="handleFileSelect"
                                        ref="fileInput"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-if="task.links?.length > 0" class="task-links">
                            <div class="task-links-title">{{ translations.LINKS }}</div>
                            <div class="task-link-list">
                                <a v-for="link in task.links" :href="link" target="_blank">{{ link }}</a>
                            </div>
                        </div>
                        <div class="task-replies">
                            <TaskModalReply
                                v-for="reply in task.replies"
                                :key="reply.id"
                                :task="task"
                                :reply="reply"
                                :endpoints="config.endpoints"
                                :states="dashboardStore.states"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="task-detail-footer" :class="config.theme">
                <TaskModalReplyForm
                    :key="task.id + '_' + task.replies?.length + '_' + task.state"
                    :task="task"
                    :endpoints="config.endpoints"
                    :states="dashboardStore.states"
                    :on-hold-types="dashboardStore.onHoldTypes"
                    :current-user="config.currentUser"
                />
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .task-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-top: -8px;

        .task-modal-title {
            overflow: hidden;
            display: flex;
            align-items: center;
            gap: 5px;

            .title {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                &.editable {
                    cursor: pointer;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }

            .inline-edit-title {
                display: flex;
                align-items: center;
                gap: 5px;

                .inline-edit-title-input {
                    flex-grow: 1;
                }

                .inline-edit-title-icons {
                    display: flex;
                    align-items: center;
                    gap: 5px;

                    & > svg {
                        cursor: pointer;
                    }
                }
            }

            .back-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                border: 1px solid #DCE5F7;
                cursor: pointer;
            }
        }

        .task-modal-actions {
            display: flex;
            align-items: center;
            gap: 4px;

            & > div, & > svg {
                cursor: pointer;
            }
        }
    }


    .drop-zone {
        margin: -10px -25px -12px -25px;
        height: calc(100% + 26px);
        position: relative;

        &.loading, &.drop-zone-active {
            .task-detail {
                pointer-events: none;
                overflow: hidden;
            }
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
            pointer-events: none;

            position: absolute;
            content: "";
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            backdrop-filter: blur(10px);
            background: linear-gradient(90deg, transparent 20%, #24C58633 50%, transparent 80%);
            animation: task-modal-loading 1s linear infinite;
            background-size: 200% 100%;
        }
    }

    .task-detail {
        font-size: 12px;
        padding: 0 24px;
        height: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        overflow: auto;
        scrollbar-color: #abd #cde;
        scrollbar-width: thin;

        .task-header {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
            padding: 8px 0;
            border-bottom: 1px solid #DCE5F7;

            @media(max-width: 768px) {
                flex-wrap: nowrap;
                flex-direction: column;
                gap: 6px;
            }

            & > * {
                width: calc(50% - 2px);

                @media(max-width: 768px) {
                    width: 100%;
                }

                &.full-width {
                    width: 100%;
                }
            }

            .priority {
                font-weight: 700;

                &.high {
                    color: #e22;
                }

                &.medium {
                    color: #fb3;
                }

                &.low {
                    color: #24C586;
                }
            }

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

            .user {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .users {
                display: flex;
                align-items: center;

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

            .categories {
                display: flex;
                max-width: 150px;
                white-space: nowrap;
                text-overflow: ellipsis;

                &.can-remove {
                    .category {
                        cursor: pointer;

                        &:hover {
                            text-decoration: line-through;
                        }
                    }
                }
            }

            .readonly {
                color: #abd;
                pointer-events: none;

                &:deep(input) {
                    &:checked {
                        border-color: #abd;
                        background-color: #abd;
                    }
                }
            }
        }

        .task-content {
            .inline-edit-content {
                display: flex;
                align-items: center;
                gap: 5px;

                .inline-edit-content-input {
                    flex-grow: 1;
                }

                .inline-edit-content-icons {
                    display: flex;
                    align-items: center;
                    gap: 5px;

                    & > svg {
                        cursor: pointer;
                    }
                }
            }

            .content-wrapper {
                overflow: hidden;
                max-height: 150px;
                position: relative;

                &.truncated:not(.expanded):after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 100%;
                    height: 50%;
                    background: linear-gradient(0, #fff 0%, transparent 100%);
                }

                &.expanded {
                    max-height: none;
                }
            }

            .content {
                transition: max-height 0.3s ease-in-out;
                color: #36557F;
            }

            .show-more {
                font-weight: 700;
                gap: 8px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 4px;

                .show-more-button {
                    padding: 4px;
                    border-radius: 50%;
                    background-color: #24C586;
                }
            }

            .task-attachments .task-attachments-title, .task-links-title, .task, .sub-task-title {
                font-size: 1rem;
                font-weight: 700;
                padding: 4px 0;
            }

            .task.editable {
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                }
            }

            .sub-tasks {
                font-size: 14px;
                border-top: 1px solid #DCE5F7;

                .new-task {
                    margin-top: 4px;
                    width: fit-content;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    border: 1px solid #E8EFFF;
                    padding: 4px 8px;
                    gap: 4px;
                    cursor: pointer;

                    &:hover {
                        background-color: #E8EFFF;
                    }

                    .icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        border: 1px solid #24C586;
                    }
                }
            }

            .task-attachments {
                margin: .5rem 0;

                .task-attachment-list {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    flex-wrap: wrap;

                    .task-attachment-upload-area {
                        display: flex;
                        align-items: center;
                        border: 1px dashed #24C586;
                        border-radius: 8px;
                        padding: 6px 16px;
                        text-align: center;
                        cursor: pointer;
                        text-decoration: underline;
                        font-weight: 500;
                        gap: 4px;

                        input {
                            display: none
                        }
                    }
                }
            }

            .task-links {
                .task-link-list {
                    display: flex;
                    flex-direction: column;

                    a {
                        width: fit-content;
                    }
                }
            }
        }

        .task-replies {
            margin-top: 1rem;
        }

        .task-content :deep(img) {
            object-fit: scale-down !important;
            height: auto !important;
            max-width: 100% !important;
        }

        .task-content :deep(a) {
            color: #0076BE !important;

            &:hover {
                color: #109af1 !important;
            }
        }
    }

    .task-detail-footer {
        margin: -20px -34px;
        width: calc(100% + 56px);
        padding: 8px;
    }

    html.prefer-dark, html.dark-theme {
        .task-modal-header {
            .task-modal-title {
                .back-button {
                    border: 1px solid #152234;

                    svg {
                        color: #c8c8c8 !important;
                    }
                }
            }
        }

        .task-detail {
            background: #152234;
            scrollbar-color: #506485 #152234;

            .task-header {
                border-bottom: 1px solid #506485;

                svg {
                     color: #c8c8c8 !important;

                     &:deep(path) {
                         stroke-width: 1 !important;
                     }
                }

                .state {
                    border: 1px solid #506485;
                    background-color: #aaa;
                    color: #c8c8c8;

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

                .users {
                    .other-solver {
                        border: 2px solid #506485;

                        .other-solver-delete {
                            background-color: #667ca1;
                        }
                    }
                }
            }

            .task-content {
                .content-wrapper {
                    &.truncated:not(.expanded):after {
                        background: linear-gradient(0, #152234 0%, transparent 100%);
                    }
                }

                .content {
                    color: #d5dbea !important;
                }

                .sub-tasks {
                    border-top: 1px solid #506485;

                    .new-task {
                        border: 1px solid #506485;

                        &:hover {
                            background-color: #506485;
                        }
                    }
                }
            }

            .task-content :deep(a) {
                color: #109af1;

                &:hover {
                    color: #48b0f1;
                }
            }
        }

        .task-detail-footer {
            border-top: 1px solid #152234;
        }
    }

    @keyframes task-modal-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>