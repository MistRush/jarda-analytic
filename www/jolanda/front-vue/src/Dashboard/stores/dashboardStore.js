import { defineStore } from 'pinia';
import { ref, reactive,  watch } from 'vue';
import { useModalStore } from "@/Dashboard/stores/modalStore";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";
import { useTranslations } from "@/Composables/useTranslation.js";
import { useCookies } from "@/Composables/useCookies";
import { useAjax } from "@/Composables/useAjax.js";
import {debounce} from "lodash";

export const useDashboardStore = defineStore('dashboardStore', () => {
    const modalStore = useModalStore(window.pinia);
    const { translations } = useTranslations();
    const alertStore = useAlertStore(window.pinia);
    const cookies = useCookies();
    const { post, get, postForm } = useAjax();

    const users = ref([]);
    const departments = ref([]);
    const projects = ref([]);
    const projectMilestones = ref([]);
    const categories = ref([]);
    const states = ref({});
    const priorities = ref({});
    const onHoldTypes = ref({});

    const contextMenuVisible = ref(false);
    const contextMenuTask = ref(null);
    const contextMenuX = ref(0);
    const contextMenuY = ref(0);

    const panelFilters = reactive({
        department: null,
        user: null,
        panelType: 'solver',
    });

    const showProgressBar = ref(false);
    const dashboardPanels = ref(null);
    const dashboardSubTasks = ref(null);

    const taskFilters = reactive({
        showDeferred: false,
        showOnlyNotViewed: false,
        showOnlySolutionRuns: false,
        category: null,
        expectedHoursFrom: null,
        expectedHoursTo: null,
        expectedReturnFrom: null,
        expectedReturnTo: null,
        search: '',
    });

    const updateShown  = () => {
        const searchTerms = taskFilters.search ? taskFilters.search.toLowerCase().split(',').filter(term => term.length > 0) : [];
        const hasFilters = (
            searchTerms.length > 0 ||
            taskFilters.showOnlyNotViewed ||
            taskFilters.showOnlySolutionRuns ||
            taskFilters.category ||
            taskFilters.expectedHoursFrom ||
            taskFilters.expectedHoursTo ||
            taskFilters.expectedReturnFrom ||
            taskFilters.expectedReturnTo
        );

        dashboardPanels.value?.forEach(panel => {
            let isPanelVisible = false;

            panel.taskLists?.forEach(taskList => {
                if(!taskFilters.showDeferred && taskList.id === 'deferred') {
                    taskList.isVisible = false;
                    return;
                }

                const visibleTasks = (taskList.tasks || []).filter(task => {
                    const meetsFilters = (
                        (!taskFilters.showOnlyNotViewed || !task.viewedFlag) &&
                        (!taskFilters.showOnlySolutionRuns || task.state === states.value.solutionRuns.value) &&
                        (!taskFilters.category || (task.categories?.length > 0 && task.categories?.map(category => category.id).includes(taskFilters.category))) &&
                        (!taskFilters.expectedHoursFrom || (task.expectedHours && task.expectedHours >= taskFilters.expectedHoursFrom)) &&
                        (!taskFilters.expectedHoursTo || (task.expectedHours && task.expectedHours <= taskFilters.expectedHoursTo)) &&
                        (!taskFilters.expectedReturnFrom || (task.expectedReturnFinance && task.expectedReturnFinance >= taskFilters.expectedReturnFrom)) &&
                        (!taskFilters.expectedReturnTo || (task.expectedReturnFinance && task.expectedReturnFinance <= taskFilters.expectedReturnTo))
                    );

                    const meetsSearch = !searchTerms.length || searchTerms.some(term => task.searchString.toLowerCase().includes(term));

                    task.isVisible = meetsFilters && meetsSearch;
                    return task.isVisible;
                });

                taskList.isVisible = visibleTasks.length > 0 || (!hasFilters && ['default', 'priority'].includes(taskList.id));
                if (taskList.isVisible)
                    isPanelVisible = true;
            });

            panel.isVisible = isPanelVisible;
        });
    };

    const debouncedUpdateShown = debounce(updateShown, 250);
    watch(taskFilters, debouncedUpdateShown, { deep: true });

    const clearFilters = (taskFiltersOnly = false) => {
        taskFilters.showDeferred = false;
        taskFilters.showOnlyNotViewed = false;
        taskFilters.showOnlySolutionRuns = false;
        taskFilters.category = null;
        taskFilters.expectedHoursFrom = null;
        taskFilters.expectedHoursTo = null;
        taskFilters.expectedReturnFrom = null;
        taskFilters.expectedReturnTo = null;
        taskFilters.search = '';

        if(taskFiltersOnly)
            return false;

        let panelFiltersChanged = false;
        if(panelFilters.department !== null || panelFilters.user !== null || panelFilters.panelType !== 'solver')
            panelFiltersChanged = true;

        panelFilters.department = null;
        panelFilters.user = null;
        panelFilters.panelType = 'solver';

        return panelFiltersChanged;
    }

    const fetchAllData = async(panelsEndpoint, subTasksEndpoint, usersEndpoint, departmentsEndpoint, projectsEndpoint, projectMilestonesEndpoint, categoriesEndpoint, statesEndpoint, prioritiesEndpoint, onHoldTypesEndpoint) => {
        await fetchPanels(panelsEndpoint);
        await fetchSubTasks(subTasksEndpoint);
        await fetchUsers(usersEndpoint);
        await fetchDepartments(departmentsEndpoint);
        await fetchProjects(projectsEndpoint);
        await fetchProjectMilestones(projectMilestonesEndpoint);
        await fetchCategories(categoriesEndpoint);
        await fetchStates(statesEndpoint);
        await fetchPriorities(prioritiesEndpoint);
        await fetchOnHoldTypes(onHoldTypesEndpoint);
    }

    const fetchPanels = async (panelsEndpoint) => {
        await post(panelsEndpoint, panelFilters).then(response => {
            if(response.response.status === 200) {
                let panels = [];
                let panelOrder = cookies.getCookie('dashboard-panel-order');
                if (panelOrder)
                    panelOrder = JSON.parse(panelOrder);

                if(panelOrder && panelOrder[panelFilters.panelType] && panelOrder[panelFilters.panelType].length > 0) {
                    panelOrder[panelFilters.panelType].forEach((id) => {
                        const found = response.data.find(panel => panel.id === id);
                        if (found)
                            panels.push(found)
                    });

                    response.data.forEach(panel => {
                        if (!panelOrder[panelFilters.panelType].find(id => id === panel.id))
                            panels.push(panel);
                    });
                } else panels = response.data;

                dashboardPanels.value = panels;
                updateShown();
            } else {
                alertStore.error(translations.GET_DATA_ERROR);
            }
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR, error);
        });
    };

    const fetchSubTasks = async (subTasksEndpoint) => {
        await post(subTasksEndpoint, panelFilters).then(response => {
            if(response.response.status === 200) {
                dashboardSubTasks.value = response.data;
            } else {
                alertStore.error(translations.GET_DATA_ERROR);
            }
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const fetchUsers = async (usersEndpoint) => {
        await get(usersEndpoint).then(response => {
            if(response.response.status === 200)
                users.value = response.data;
            else alertStore.error(translations.GET_DATA_ERROR);
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const fetchDepartments = async (departmentsEndpoint) => {
        await get(departmentsEndpoint).then(response => {
            if(response.response.status === 200)
                departments.value = response.data;
            else alertStore.error(translations.GET_DATA_ERROR);
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const fetchProjects = async (projectsEndpoint) => {
        await get(projectsEndpoint).then(response => {
            if(response.response.status === 200)
                projects.value = response.data;
            else alertStore.error(translations.GET_DATA_ERROR);
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const fetchProjectMilestones = async (projectMilestonesEndpoint) => {
        await get(projectMilestonesEndpoint).then(response => {
            if(response.response.status === 200)
                projectMilestones.value = response.data;
            else alertStore.error(translations.GET_DATA_ERROR);
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const fetchCategories = async (categoriesEndpoint) => {
        await get(categoriesEndpoint).then(response => {
            if(response.response.status === 200)
                categories.value = response.data;
            else alertStore.error(translations.GET_DATA_ERROR);
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const fetchStates = async (statesEndpoint) => {
        await get(statesEndpoint).then(response => {
            if(response.response.status === 200)
                states.value = response.data;
            else alertStore.error(translations.GET_DATA_ERROR);
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const fetchPriorities = async (prioritiesEndpoint) => {
        await get(prioritiesEndpoint).then(response => {
            if(response.response.status === 200)
                priorities.value = response.data;
            else alertStore.error(translations.GET_DATA_ERROR);
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const fetchOnHoldTypes = async (onHoldTypesEndpoint) => {
        await get(onHoldTypesEndpoint).then(response => {
            if(response.response.status === 200)
                onHoldTypes.value = response.data;
            else alertStore.error(translations.GET_DATA_ERROR);
        }).catch(error => {
            alertStore.error(translations.GET_DATA_ERROR);
        });
    }

    const openContextMenu = (task, x, y) => {
        contextMenuVisible.value = true;
        contextMenuTask.value = task;
        contextMenuX.value = x;
        contextMenuY.value = y;
    }

    const closeContextMenu = () => {
        contextMenuVisible.value = false;
        contextMenuTask.value = null;
        contextMenuX.value = 0;
        contextMenuY.value = 0;
    }

    const updateTask = (endpoint, taskOrderEndpoint, task, updatedTaskData, movedToTaskListId, movedToPanelId) => {
        const originalTask = JSON.parse(JSON.stringify(task));
        const tempUpdateTaskData = JSON.parse(JSON.stringify(updatedTaskData));
        const alert = alertStore.info('Upravuji úkol...', '', null, 20000);

        if(tempUpdateTaskData.filterOut) {
            if(task.parentTaskId) {
                dashboardSubTasks.value = dashboardSubTasks.value.filter(t => t.id !== task.id);
            } else {
                const panel = dashboardPanels.value?.find(panel => panel.id == (movedToPanelId ?? task.panelId));
                const taskList = panel?.taskLists.find(taskList => taskList.id == (movedToTaskListId ?? task.taskListId));

                if (taskList)
                    taskList.tasks = taskList.tasks.filter(t => t.id !== task.id);
            }

            modalStore.closeModal(task.id);
        } else {
            if (tempUpdateTaskData.reply) {
                task.replies.push({
                    id: 'temp-reply-id',
                    timestamp: (new Date()).getTime() / 1000,
                    state: tempUpdateTaskData.reply.state,
                    content: tempUpdateTaskData.reply.content,
                    author: users.value.find(user => user.id === tempUpdateTaskData.reply.userId),
                    attachments: tempUpdateTaskData.reply.attachments?.length > 0 ? Array.apply({}, Array(tempUpdateTaskData.reply.attachments.length)) : null,
                    minimized: false,
                });

                if(tempUpdateTaskData.reply.state === states.value.awaitingApproval.value && task.taskListId !== 'awaitingApproval') {
                    const panel = dashboardPanels.value?.find(panel => panel.id == (movedToPanelId ?? task.panelId));
                    if(panel) {
                        const taskList = panel?.taskLists.find(taskList => taskList.id == (movedToTaskListId ?? task.taskListId));
                        if(taskList) {
                            const taskIndex = taskList?.tasks.findIndex(t => t.id == task.id);
                            const [movedTask] = taskList.tasks.splice(taskIndex, 1);

                            const newTaskList = panel?.taskLists.find(taskList => taskList.id === 'awaitingApproval');
                            if (newTaskList) {
                                movedTask.taskListId = 'awaitingApproval';
                                movedTask.state = states.value.awaitingApproval.value;
                                newTaskList.tasks.unshift(movedTask);
                            }
                        }
                    }
                } else {
                    task.state = tempUpdateTaskData.reply.state;
                }

                delete tempUpdateTaskData.reply;
            }

            if(tempUpdateTaskData.replyComment) {
                const reply = task.replies.find(reply => reply.id === tempUpdateTaskData.replyComment.replyId);

                reply.comments.push({
                    id: 'temp-reply-comment-id',
                    replyId: reply.id,
                    timestamp: (new Date()).getTime() / 1000,
                    content: tempUpdateTaskData.replyComment.content,
                    author: users.value.find(user => user.id === tempUpdateTaskData.replyComment.userId),
                });

                delete tempUpdateTaskData.replyComment;
                tempUpdateTaskData.unminimizeReply = reply.id;
            }

            if (tempUpdateTaskData.attachments?.length > 0) {
                tempUpdateTaskData.attachments.forEach((attachment) => {
                    task.attachments.push({});
                });

                delete tempUpdateTaskData.attachments;
            }

            if (tempUpdateTaskData.category?.id) {
                task.category = categories.value.find(category => category.id === tempUpdateTaskData.category.id);
                delete tempUpdateTaskData.category;
            }

            if (tempUpdateTaskData.addCategory) {
                task.categories.push(categories.value.find(category => category.id === tempUpdateTaskData.addCategory));
                delete tempUpdateTaskData.addCategory;
            }

            if (tempUpdateTaskData.removeCategory) {
                task.categories = task.categories.filter((category) => category.id !== tempUpdateTaskData.removeCategory);
                delete tempUpdateTaskData.removeCategory;
            }

            if (tempUpdateTaskData.department?.id) {
                task.department = departments.value.find(department => department.id === tempUpdateTaskData.department.id);
                if(panelFilters.panelType === 'department') {
                    const oldPanel = dashboardPanels.value?.find(panel => panel.id == task.panelId);
                    if(oldPanel) {
                        const oldTaskList = oldPanel?.taskLists.find(taskList => taskList.id == task.taskListId);
                        if(oldTaskList) {
                            const taskIndex = oldTaskList?.tasks.findIndex(t => t.id == task.id);
                            const [movedTask] = oldTaskList.tasks.splice(taskIndex, 1);

                            const newPanel = dashboardPanels.value?.find(panel => panel.id == task.department.id);
                            if (newPanel) {
                                const newTaskList = newPanel?.taskLists.find(taskList => taskList.id === task.taskListId);
                                if (newTaskList) {
                                    movedTask.panelId = newPanel.id;
                                    movedTask.taskListId = newTaskList.id;
                                    newTaskList.tasks.unshift(movedTask);
                                    updateTaskOrder(taskOrderEndpoint, newPanel.id, newTaskList.id);
                                }
                            }
                        }
                    }
                }

                delete tempUpdateTaskData.department;
            }

            if (tempUpdateTaskData.project?.id) {
                task.project = projects.value.find(project => project.id === tempUpdateTaskData.project.id);
                delete tempUpdateTaskData.project;
            }

            if (tempUpdateTaskData.project?.milestoneId) {
                const projectMilestone = projectMilestones.value.find(projectMilestone => projectMilestone.id === tempUpdateTaskData.project.milestoneId);
                task.project = projects.value.find(project => project.id === projectMilestone.projectId);
                if(panelFilters.panelType === 'project') {
                    const oldPanel = dashboardPanels.value?.find(panel => panel.id == task.panelId);
                    if(oldPanel) {
                        const oldTaskList = oldPanel?.taskLists.find(taskList => taskList.id == task.taskListId);
                        if (oldTaskList) {
                            const taskIndex = oldTaskList?.tasks.findIndex(t => t.id == task.id);
                            const [movedTask] = oldTaskList.tasks.splice(taskIndex, 1);

                            const newPanel = dashboardPanels.value?.find(panel => panel.id == task.project.id);
                            if (newPanel) {
                                const newTaskList = newPanel?.taskLists.find(taskList => taskList.id === task.taskListId);
                                if (newTaskList) {
                                    movedTask.panelId = newPanel.id;
                                    movedTask.taskListId = newTaskList.id;
                                    newTaskList.tasks.unshift(movedTask);
                                    updateTaskOrder(taskOrderEndpoint, newPanel.id, newTaskList.id);
                                }
                            }
                        }
                    }
                }

                delete tempUpdateTaskData.project;
            }

            if (tempUpdateTaskData.solver?.id) {
                task.solver = users.value.find(user => user.id === tempUpdateTaskData.solver.id);
                if(panelFilters.panelType === 'solver') {
                    const oldPanel = dashboardPanels.value?.find(panel => panel.id == task.panelId);
                    if(oldPanel) {
                        const oldTaskList = oldPanel?.taskLists.find(taskList => taskList.id == task.taskListId);
                        if(oldTaskList) {
                            const taskIndex = oldTaskList?.tasks.findIndex(t => t.id == task.id);
                            const [movedTask] = oldTaskList.tasks.splice(taskIndex, 1);

                            const newPanel = dashboardPanels.value?.find(panel => panel.id == task.solver.id);
                            if (newPanel) {
                                const newTaskList = newPanel?.taskLists.find(taskList => taskList.id === task.taskListId);
                                if (newTaskList) {
                                    movedTask.panelId = newPanel.id;
                                    movedTask.taskListId = newTaskList.id;
                                    newTaskList.tasks.unshift(movedTask);
                                    updateTaskOrder(taskOrderEndpoint, newPanel.id, newTaskList.id);
                                }
                            }
                        }
                    }
                }

                delete tempUpdateTaskData.solver;
            }

            if (tempUpdateTaskData.author?.id) {
                task.author = users.value.find(user => user.id === tempUpdateTaskData.author.id);
                if(panelFilters.panelType === 'author') {
                    const oldPanel = dashboardPanels.value?.find(panel => panel.id == task.panelId);
                    if(oldPanel) {
                        const oldTaskList = oldPanel?.taskLists.find(taskList => taskList.id == task.taskListId);
                        if(oldTaskList) {
                            const taskIndex = oldTaskList?.tasks.findIndex(t => t.id == task.id);
                            const [movedTask] = oldTaskList.tasks.splice(taskIndex, 1);

                            const newPanel = dashboardPanels.value?.find(panel => panel.id == task.author.id);
                            const newTaskList = newPanel?.taskLists.find(taskList => taskList.id === task.taskListId);
                            if (newPanel) {
                                const newTaskList = newPanel?.taskLists.find(taskList => taskList.id === task.taskListId);
                                if (newTaskList) {
                                    movedTask.panelId = newPanel.id;
                                    movedTask.taskListId = newTaskList.id;
                                    newTaskList.tasks.unshift(movedTask);
                                    updateTaskOrder(taskOrderEndpoint, newPanel.id, newTaskList.id);
                                }
                            }
                        }
                    }
                }

                delete tempUpdateTaskData.author;
            }

            if (tempUpdateTaskData.addOtherSolver) {
                task.otherSolvers.push(users.value.find(user => user.id === tempUpdateTaskData.addOtherSolver));
                delete tempUpdateTaskData.addOtherSolver;
            }

            if (tempUpdateTaskData.removeOtherSolver) {
                task.otherSolvers = task.otherSolvers.filter((otherSolver) => otherSolver.id !== tempUpdateTaskData.removeOtherSolver);
                delete tempUpdateTaskData.removeOtherSolver;
            }

            if (tempUpdateTaskData.panelId) {
                if (panelFilters.panelType === 'solver') {
                    task.solver = users.value.find(user => user.id === tempUpdateTaskData.panelId);
                } else if (panelFilters.panelType === 'author') {
                    task.author = users.value.find(user => user.id === tempUpdateTaskData.panelId);
                } else if (panelFilters.panelType === 'project') {
                    task.project = projects.value.find(project => project.id === tempUpdateTaskData.panelId);
                } else if (panelFilters.panelType === 'department') {
                    task.department = departments.value.find(department => department.id === tempUpdateTaskData.panelId);
                }

                delete tempUpdateTaskData.panelId;
            }

            if (tempUpdateTaskData.taskListId) {
                if (tempUpdateTaskData.taskListId === 'awaitingApproval') {
                    task.state = states.value[tempUpdateTaskData.taskListId].value;
                    task.priorityFlag = false;
                    task.deferredFlag = false;
                } else if (tempUpdateTaskData.taskListId === 'priority') {
                    task.state = 'default';
                    task.priorityFlag = true;
                    task.deferredFlag = false;
                } else if (tempUpdateTaskData.taskListId === 'deferred') {
                    task.state = 'default';
                    task.priorityFlag = false;
                    task.deferredFlag = true;
                } else {
                    task.state = 'default';
                    task.priorityFlag = false;
                    task.deferredFlag = false;
                }

                delete tempUpdateTaskData.taskListId;
            }

            if(tempUpdateTaskData.state && tempUpdateTaskData.state === states.value.awaitingApproval.value && task.taskListId !== 'awaitingApproval') {
                const panel = dashboardPanels.value?.find(panel => panel.id == (movedToPanelId ?? task.panelId));
                if(panel) {
                    const taskList = panel?.taskLists.find(taskList => taskList.id == (movedToTaskListId ?? task.taskListId));
                    if(taskList) {
                        const taskIndex = taskList?.tasks.findIndex(t => t.id == task.id);
                        const [movedTask] = taskList.tasks.splice(taskIndex, 1);

                        const newTaskList = panel?.taskLists.find(taskList => taskList.id === 'awaitingApproval');
                        if (newTaskList) {
                            movedTask.taskListId = 'awaitingApproval';
                            newTaskList.tasks.unshift(movedTask);
                        }
                    }
                }
            }

            if(tempUpdateTaskData.priorityFlag && task.taskListId !== 'priority') {
                const panel = dashboardPanels.value?.find(panel => panel.id == (movedToPanelId ?? task.panelId));
                if(panel) {
                    const taskList = panel?.taskLists.find(taskList => taskList.id == (movedToTaskListId ?? task.taskListId));
                    if(taskList) {
                        const taskIndex = taskList?.tasks.findIndex(t => t.id == task.id);
                        const [movedTask] = taskList.tasks.splice(taskIndex, 1);

                        const newTaskList = panel?.taskLists.find(taskList => taskList.id === 'priority');
                        if (newTaskList) {
                            movedTask.taskListId = 'priority';
                            newTaskList.tasks.unshift(movedTask);
                        }
                    }
                }
            }

            if(tempUpdateTaskData.deferredFlag && task.taskListId !== 'deferred') {
                const panel = dashboardPanels.value?.find(panel => panel.id == (movedToPanelId ?? task.panelId));
                if(panel) {
                    const taskList = panel?.taskLists.find(taskList => taskList.id == (movedToTaskListId ?? task.taskListId));
                    if(taskList) {
                        const taskIndex = taskList?.tasks.findIndex(t => t.id == task.id);
                        const [movedTask] = taskList.tasks.splice(taskIndex, 1);

                        const newTaskList = panel?.taskLists.find(taskList => taskList.id === 'deferred');
                        if (newTaskList) {
                            movedTask.taskListId = 'deferred';
                            newTaskList.tasks.unshift(movedTask);
                        }
                    }
                }
            }

            if(tempUpdateTaskData.state && tempUpdateTaskData.state === 'default')
                delete tempUpdateTaskData.state;

            Object.assign(task, tempUpdateTaskData);
        }

        updatedTaskData.id = task.id;
        updatedTaskData.panelType = panelFilters.panelType;
        if(updatedTaskData.panelId) {
            if(panelFilters.panelType === 'solver') {
                updatedTaskData.solver = {
                    id: updatedTaskData.panelId
                };
            } else if(panelFilters.panelType === 'author') {
                updatedTaskData.author = {
                    id: updatedTaskData.panelId
                };
            } else if(panelFilters.panelType === 'project') {
                updatedTaskData.projectPanel = {
                    id: updatedTaskData.panelId
                }
            } else if(panelFilters.panelType === 'department') {
                updatedTaskData.department = {
                    id: updatedTaskData.panelId
                }
            }
        }

        if(updatedTaskData.taskListId) {
            if(updatedTaskData.taskListId === 'awaitingApproval') {
                updatedTaskData.stateDashboard = updatedTaskData.taskListId;
                updatedTaskData.priorityFlag = false;
                updatedTaskData.deferredFlag = false;
            } else if(updatedTaskData.taskListId === 'priority') {
                updatedTaskData.stateDashboard = 'default';
                updatedTaskData.priorityFlag = true;
                updatedTaskData.deferredFlag = false;
            } else if(updatedTaskData.taskListId === 'deferred') {
                updatedTaskData.stateDashboard = 'default';
                updatedTaskData.priorityFlag = false;
                updatedTaskData.deferredFlag = true;
            } else {
                updatedTaskData.stateDashboard = 'default';
                updatedTaskData.priorityFlag = false;
                updatedTaskData.deferredFlag = false;
            }
        }

        const data = {
            task: JSON.stringify(updatedTaskData),
        };

        if(updatedTaskData.reply?.attachments?.length > 0) {
            data.replyAttachments = updatedTaskData.reply.attachments;
        }

        if(updatedTaskData.attachments?.length > 0) {
            data.attachments = updatedTaskData.attachments;
        }

        debouncedUpdateShown();
        postForm(endpoint, data).then((response) => {
            if(response.response.status === 200) {
                const updatedTask = response.data.task;
                if(updatedTaskData.filterOut) {
                    if(task.parentTaskId) {
                        dashboardSubTasks.value = dashboardSubTasks.value.filter(t => t.id !== task.id);
                    } else {
                        const panel = dashboardPanels.value?.find(panel => panel.id == (movedToPanelId ?? task.panelId));
                        const taskList = panel?.taskLists.find(taskList => taskList.id == (movedToTaskListId ?? task.taskListId));

                        if (taskList)
                            taskList.tasks = taskList.tasks.filter(t => t.id !== task.id);
                    }

                    modalStore.closeModal(task.id);
                } else {
                    if (!task.parentTaskId && updatedTask.panelId != 0 && dashboardPanels.value && ((!movedToPanelId && updatedTask.panelId != task.panelId) || (!movedToTaskListId && updatedTask.taskListId != task.taskListId))) {
                        const panel = dashboardPanels.value?.find(panel => panel.id == (movedToPanelId ?? task.panelId));
                        const taskList = panel?.taskLists.find(taskList => taskList.id == (movedToTaskListId ?? task.taskListId));
                        const taskIndex = taskList?.tasks.findIndex(t => t.id == task.id);
                        const [movedTask] = taskList.tasks.splice(taskIndex, 1);
                        let newPanel = dashboardPanels.value?.find(panel => panel.id == updatedTask.panelId);
                        if (!newPanel) {
                            dashboardPanels.value.push(response.data.panel);
                            newPanel = dashboardPanels.value?.find(panel => panel.id === updatedTask.panelId);
                        }

                        const newTaskList = newPanel?.taskLists.find(taskList => taskList.id == updatedTask.taskListId);
                        if (newTaskList) {
                            Object.assign(movedTask, updatedTask);
                            newTaskList.tasks.unshift(movedTask);

                            if(tempUpdateTaskData.unminimizeReply) {
                                const reply = movedTask.replies.find(reply => reply.id === tempUpdateTaskData.unminimizeReply);
                                if(reply)
                                    reply.minimized = false;
                            }

                            updateTaskOrder(taskOrderEndpoint, newPanel.id, newTaskList.id);
                        } else {
                            alert.changeToError(translations.UPDATE_TASK_ERROR);
                            return;
                        }
                    } else {
                        Object.assign(task, updatedTask);

                        if(tempUpdateTaskData.unminimizeReply) {
                            const reply = task.replies.find(reply => reply.id === tempUpdateTaskData.unminimizeReply);
                            if(reply)
                                reply.minimized = false;
                        }
                    }
                }

                alert.changeToSuccess(translations.TASK_UPDATED);
            } else {
                Object.assign(task, originalTask);
                alert.changeToError(translations.UPDATE_TASK_ERROR, 'Změny byly vráceny');
            }

            debouncedUpdateShown();
        }).catch(error => {
            Object.assign(task, originalTask);
            alert.changeToError(translations.UPDATE_TASK_ERROR, error.message);
        });
    };

    const updateTaskOrder = (endpoint, panelId, taskListId) => {
        const alert = alertStore.info('Ukládám nové pořadí úkolů...', '', null, 20000);

        const panel = dashboardPanels.value?.find(panel => panel.id == panelId);
        const taskList = panel?.taskLists.find(taskList => taskList.id == taskListId);
        const taskOrder = taskList?.tasks.map(task => task.id);

        if(taskOrder && taskOrder.length > 0) {
            post(endpoint, {
                order: JSON.stringify(taskOrder),
                panelType: panelFilters.panelType,
            }).then(() => {
                alert.changeToSuccess('Pořadí úkolů uloženo');
            }).catch((error) => {
                alert.changeToError('Nepodařilo se uložit pořadí úkolů', error.message);
            });
        } else {
            alert.changeToError('Nepodařilo se uložit pořadí úkolů');
        }
    }

    const addTask = async (endpoint, task, standalone = false) => {
        const alert = alertStore.info('Vytvářím úkol...', '', null, 20000);

        const data = {};
        data.task = JSON.stringify(task);
        if(task.files?.length > 0)
            data.files = task.files;

        return await postForm(endpoint, data).then(response => {
            if (response.response.status === 200) {
                const newPanel = response.data.panel;
                const newTask = response.data.task;

                if(newTask.parentTaskId) {
                    dashboardSubTasks.value.push(newTask);

                    alert.changeToSuccess(translations.TASK_CREATED);
                } else if(standalone) {
                    alert.changeToSuccess(translations.TASK_CREATED);
                    return newTask;
                } else {
                    let panel = dashboardPanels.value?.find(panel => panel.id === newTask.panelId);
                    if (!panel) {
                        dashboardPanels.value.push(newPanel);
                        panel = dashboardPanels.value?.find(panel => panel.id === newTask.panelId);
                    }

                    const taskList = panel?.taskLists.find(taskList => taskList.id === newTask.taskListId);
                    if (taskList) {
                        taskList.tasks.push(newTask);
                        modalStore.openModal('task-detail', newTask.id, newTask);

                        alert.changeToSuccess(translations.TASK_CREATED);
                    } else {
                        alert.changeToError(translations.CREATE_TASK_ERROR);
                    }
                }
            } else {
                alert.changeToError(translations.CREATE_TASK_ERROR);
            }

            debouncedUpdateShown();
        }).catch(error => {
            alert.changeToError(translations.CREATE_TASK_ERROR, error.message);
        });
    };

    const completeTask = (endpoint, task) => {
        const originalTask = JSON.parse(JSON.stringify(task));
        const alert = alertStore.info('Dokončuji úkol...', '', null, 20000);

        if(task.parentTaskId) {
            dashboardSubTasks.value = dashboardSubTasks.value.filter(t => t.id !== task.id);
            modalStore.closeModal(task.id);
        } else {
            const panel = dashboardPanels.value?.find(panel => panel.id === task.panelId);
            const taskList = panel?.taskLists.find(taskList => taskList.id === task.taskListId);

            if (taskList) {
                taskList.tasks = taskList.tasks.filter(t => t.id !== task.id);

                modalStore.closeModal(task.id);
            }
        }

        debouncedUpdateShown();
        postForm(endpoint, {
            task: JSON.stringify({
                id: task.id,
                stateDashboard: 'completed'
            }),
        }).then(response => {
            if (response.response.status === 200) {
                alert.changeToSuccess(translations.TASK_UPDATED);
            } else {
                alert.changeToError(translations.UPDATE_TASK_ERROR, 'Změny byly vráceny');

                const panel = dashboardPanels.value?.find(panel => panel.id === originalTask.panelId);
                const taskList = panel?.taskLists.find(taskList => taskList.id === originalTask.taskListId);
                taskList.tasks.push(originalTask);
            }

            debouncedUpdateShown();
        }).catch(error => {
            alert.changeToError(translations.UPDATE_TASK_ERROR, 'Změny byly vráceny');

            const panel = dashboardPanels.value?.find(panel => panel.id === originalTask.panelId);
            const taskList = panel?.taskLists.find(taskList => taskList.id === originalTask.taskListId);
            taskList.tasks.push(originalTask);
        });
    }

    const deleteTask = (endpoint, task) => {
        const originalTask = JSON.parse(JSON.stringify(task));
        const alert = alertStore.info('Odstraňuji úkol...', '', null, 20000);

        if(task.parentTaskId) {
            dashboardSubTasks.value = dashboardSubTasks.value.filter(t => t.id !== task.id);
            modalStore.closeModal(task.id);
        } else {
            const panel = dashboardPanels.value?.find(panel => panel.id === task.panelId);
            const taskList = panel?.taskLists.find(taskList => taskList.id === task.taskListId);

            if (taskList) {
                taskList.tasks = taskList.tasks.filter(t => t.id !== task.id);
                modalStore.closeModal(task.id);
            }
        }

        debouncedUpdateShown();
        postForm(endpoint, {
            task: JSON.stringify({
                id: task.id,
                stateDashboard: 'canceled'
            }),
        }).then(response => {
            if (response.response.status === 200) {
                alert.changeToSuccess(translations.TASK_DELETED);
            } else {
                alert.changeToError(translations.DELETE_TASK_ERROR, 'Změny byly vráceny');

                const panel = dashboardPanels.value?.find(panel => panel.id === originalTask.panelId);
                const taskList = panel?.taskLists.find(taskList => taskList.id === originalTask.taskListId);
                taskList.tasks.push(originalTask);
            }

            debouncedUpdateShown();
        }).catch(error => {
            alert.changeToError(translations.DELETE_TASK_ERROR, 'Změny byly vráceny');

            const panel = dashboardPanels.value?.find(panel => panel.id === originalTask.panelId);
            const taskList = panel?.taskLists.find(taskList => taskList.id === originalTask.taskListId);
            taskList.tasks.push(originalTask);
        });
    }

    return {
        dashboardPanels,
        dashboardSubTasks,
        users,
        departments,
        projects,
        projectMilestones,
        categories,
        states,
        priorities,
        onHoldTypes,
        taskFilters,
        panelFilters,
        showProgressBar,
        contextMenuVisible,
        contextMenuX,
        contextMenuY,
        contextMenuTask,
        fetchAllData,
        fetchPanels,
        fetchSubTasks,
        fetchUsers,
        fetchDepartments,
        fetchProjects,
        fetchProjectMilestones,
        fetchCategories,
        fetchStates,
        fetchPriorities,
        fetchOnHoldTypes,
        clearFilters,
        openContextMenu,
        closeContextMenu,
        updateTask,
        updateTaskOrder,
        addTask,
        completeTask,
        deleteTask,
    };
});