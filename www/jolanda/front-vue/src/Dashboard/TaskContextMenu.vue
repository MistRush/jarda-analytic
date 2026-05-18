<script setup>
    import { computed, reactive, ref, onMounted } from "vue";
    import { useDashboardStore } from "@/Dashboard/stores/dashboardStore.js";
    import { useModalStore } from "@/Dashboard/stores/modalStore.js";

    const props = defineProps({
        x: Number,
        y: Number,
        task: Object,
        currentUser: Number,
        currentUserSubUsers: Array,
        endpoints: Object,
        allowedFeatures: Object,
        permissions: Array,
    });

    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);

    const userIsAdmin = computed(() => {
        return props.permissions.includes('admin');
    });

    const userIsDepartmentManager = computed(() => {
        return userIsAdmin.value || props.task.department?.managerIds?.includes(props.currentUser);
    });

    const userIsAuthor = computed(() => {
        return userIsAdmin.value || props.currentUser == props.task.author?.id || props.currentUserSubUsers.includes(props.task.author?.id)
    });

    const userOrSubUserIsSolver = computed(() => {
        return userIsAdmin.value || props.currentUser == props.task.solver?.id || props.currentUserSubUsers.includes(props.task.solver?.id)
    });

    const prioritiesEnum = computed(() => {
        return [
            { value: dashboardStore.priorities?.low.value, text: dashboardStore.priorities?.low.name },
            { value: dashboardStore.priorities?.medium.value, text: dashboardStore.priorities?.medium.name },
            { value: dashboardStore.priorities?.high.value, text: dashboardStore.priorities?.high.name },
        ];
    });

    const statesEnum = computed(() => {
        return  [
            { value: dashboardStore.states?.new.value, text: dashboardStore.states?.new.name },
            { value: dashboardStore.states?.onHold.value, text: dashboardStore.states?.onHold.name },
            { value: dashboardStore.states?.amended.value, text: dashboardStore.states?.amended.name },
            { value: dashboardStore.states?.solutionRuns.value, text: dashboardStore.states?.solutionRuns.name },
            { value: dashboardStore.states?.awaitingApproval.value, text: dashboardStore.states?.awaitingApproval.name },
            { value: dashboardStore.states?.completed.value, text: dashboardStore.states?.completed.name },
            { value: dashboardStore.states?.canceled.value, text: dashboardStore.states?.canceled.name },
        ];
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

    const categoriesEnum = computed(() => {
        return dashboardStore.categories?.map((category) => {
            return { value: category.id, text: category.name };
        });
    });

    const solverSearch = ref("");
    const solversEnum = computed(() => {
        return dashboardStore.users?.filter((user) => {
            return !solverSearch.value || user.name.toLowerCase().includes(solverSearch.value.toLowerCase());
        }).map((user) => {
            return { value: user.id, text: user.name };
        });
    });

    const otherSolverSearch = ref("");
    const otherSolversEnum = computed(() => {
        return dashboardStore.users?.filter((user) => {
            return !otherSolverSearch.value || user.name.toLowerCase().includes(otherSolverSearch.value.toLowerCase());
        }).map((user) => {
            return { value: user.id, text: user.name };
        });
    });

    const actions = reactive([
        {
            action: 'changePriority',
            title: 'Změnit prioritu',
            type: 'select',
            icon: 'priority',
            options: prioritiesEnum,
            active: false,
            value: props.task.priority,
        },
        {
            action: 'changeState',
            title: 'Změnit stav',
            type: 'select',
            icon: 'state',
            options: statesEnum,
            active: false,
            value: props.task.state,
        },
        {
            action: 'changeSolver',
            title: 'Změnit řešitele',
            type: 'select',
            icon: 'user',
            enableSearch: true,
            search: solverSearch,
            options: solversEnum,
            active: false,
            value: props.task.solver.id,
        },
        {
            action: 'toggleOtherSolver',
            title: 'Nastavit další řešitele',
            type: 'select',
            icon: 'user',
            enableSearch: true,
            search: otherSolverSearch,
            options: otherSolversEnum,
            active: false,
            value: props.task.otherSolvers.map((otherSolver) => otherSolver.id),
        },
        {
            action: 'changeProject',
            title: 'Nastavit projekt',
            type: 'select',
            icon: 'case',
            options: projectsEnum,
            active: false,
            value: props.task.project.milestoneId,
        },
        {
            action: 'changeDepartment',
            title: 'Nastavit oddělení',
            type: 'select',
            icon: 'department',
            options: departmentsEnum,
            active: false,
            value: props.task.department.id,
        },
        {
            action: 'toggleCategory',
            title: 'Nastavit kategorie',
            type: 'select',
            icon: 'blocks',
            options: categoriesEnum,
            active: false,
            value: props.task.categories.map((category) => category.id),
        },
    ]);

    const isMobile = computed(() => {
        return screen.width <= 768;
    });

    onMounted(() => {
       if(!userIsAdmin.value && !userOrSubUserIsSolver.value && !userIsAuthor.value && !userIsDepartmentManager.value) {
           for (let i = actions.length - 1; i >= 0; i--) {
               if (actions[i].action !== 'changeState')
                   actions.splice(i, 1);
           }
       } else if(!userIsAuthor.value && !userIsDepartmentManager.value) {
           for (let i = actions.length - 1; i >= 0; i--) {
               if(actions[i].action === 'changePriority' || actions[i].action === 'changeProject' || actions[i].action === 'changeDepartment')
                   actions.splice(i, 1);
           }
       }

       if(isMobile.value) {
           actions.unshift({
               action: 'toggleActive',
               title: 'Zobrazit úkol',
               type: 'button',
           })
       }
    });

    const closeContextMenu = () => {
        dashboardStore.closeContextMenu();
    }

    const openAction = (index) => {
        closeActions();

        actions[index].active = true;
        if(actions[index].enableSearch)
            actions[index].search = null;
    }

    const closeActions = () => {
        for (let i = actions.length - 1; i >= 0; i--) {
            actions[i].active = false;
            if(actions[i].enableSearch)
                actions[i].search = null;
        }
    }

    const doAction = (action, value = null) => {
        if(action === 'changePriority')
            changePriority(value);
        else if(action === 'changeState')
            changeState(value);
        else if(action === 'changeSolver')
            changeSolver(value);
        else if(action === 'toggleOtherSolver')
            toggleOtherSolver(value);
        else if(action === 'changeProject')
            changeProject(value);
        else if(action === 'changeDepartment')
            changeDepartment(value);
        else if(action === 'toggleCategory')
            toggleCategory(value);
        else if(action === 'toggleActive')
            toggleActive();

        closeActions();
        closeContextMenu();
    }

    const changePriority = (priority) => {
        if(props.task.priority === priority)
            return;

        dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
            priority: priority,
        });
    }

    const changeState = (state) => {
        dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
            reply: {
                state: state,
                sendEmail: true,
                content: 'Nastaveno z dashboardu',
                waitingFor: null,
                onHoldType: null,
                userId: props.currentUser
            },
            filterOut: state === dashboardStore.states?.completed.value || state.value === dashboardStore.states?.canceled.value,
        });
    }

    const changeSolver = (solver) => {
        if(!solver || solver == '0' || props.task.solver?.id === solver)
            return;

        dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
            solver: {
                id: solver
            }
        });
    }

    const toggleOtherSolver = (otherSolver) => {
        const otherSolverIds = props.task.otherSolvers?.map((solver) => solver.id);

        if(otherSolverIds.includes(otherSolver)) {
            dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
                removeOtherSolver: otherSolver
            });
        } else {
            dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
                addOtherSolver: otherSolver
            });
        }
    }

    const changeProject = (project) => {
        if(!project || project == '0' || props.task.project?.milestoneId === project)
            return;

        dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
            project: {
                milestoneId: project
            }
        });
    }

    const changeDepartment = (department) => {
        if(!department || department == '0' || props.task.department?.id === department)
            return;

        dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
            department: {
                id: department
            }
        });
    }

    const toggleCategory = (category) => {
        const categoryIds = props.task.categories?.map((category) => category.id);

        if(categoryIds.includes(category)) {
            dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
                removeCategory: category
            });
        } else {
            dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
                addCategory: category
            });
        }
    }

    const toggleActive = () => {
        const modal = modalStore.openedModalsByType['task-detail'].find(modal => modal.id === props.task.id);
        if(modal) {
            if(modal.minimized)
                modalStore.maximizeModal('task-detail', props.task.id);
            else modalStore.closeModal(props.task.id);
        } else modalStore.openModal('task-detail', props.task.id, props.task);
    }

    const actionClick = (index, action) => {
        if(action.type === 'select') {
            if(action.active)
                closeActions();
            else openAction(index);
        } else doAction(action.action);
    }
</script>

<template>
    <div class="context-menu-overlay" @click="closeContextMenu" @contextmenu.prevent="closeContextMenu" />
    <div
        class="context-menu"
        :style="{ top: y + 'px', left: x + 'px' }"
    >
        <div
            v-for="(action, index) in actions"
            :key="action.action"
            @mouseenter="openAction(index)"
            @mouseleave="closeActions"
            @click="actionClick(index, action)"
            class="context-menu-action"
        >
            <div class="action-title">
                <Icon :icon="action.icon" width="14" height="14" color="#36557F" />
                <span class="title">{{ action.title }}</span>
                <Icon v-if="action.type === 'select'" icon="arrow" direction="right" width="12" height="12" color="#152234"></Icon>
            </div>
            <div
                v-if="action.active"
                class="action-options"
                :class="{ 'select': action.type === 'select' }"
            >
                <template v-if="action.type === 'select'">
                    <div v-if="action.enableSearch" class="search">
                        <input type="text" v-model="action.search" @click.stop="null"  placeholder="Hledat..." />
                    </div>
                    <div class="options">
                        <div
                            v-for="option in action.options"
                            class="option"
                            :class="{ selected: Array.isArray(action.value) ? action.value.includes(option.value) : option.value == action.value }"
                            @click="doAction(action.action, option.value)"
                        >
                            {{ option.text }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .context-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 9999;

        &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }

    .context-menu {
        position: fixed;
        z-index: 10000;
        background-color: #fff;
        border-radius: 6px;
        border: 1px solid #DCE5F7;
        box-shadow: 0 10px 30px 3px rgba(5, 16, 55, 0.15);
        min-width: 150px;
        padding: 4px;

        .context-menu-action {
            padding: 8px;
            cursor: pointer;
            position: relative;

            &:not(:last-child) {
                border-bottom: 1px solid #DCE5F7;
            }

            &:first-child {
                border-radius: 4px 4px 0 0;
            }

            &:last-child {
                border-radius: 0 0 4px 4px;
            }

            &:hover {
                background-color: #24C58620;
            }

            .action-title {
                flex-grow: 1;
                display: flex;
                align-items: center;
                gap: 4px;

                .title {
                    flex-grow: 1;
                }
            }

            .action-options {
                position: absolute;
                top: -5px;
                left: calc(100% + 4px);
                z-index: 10000;
                background-color: #fff;
                border-radius: 6px;
                border: 1px solid #DCE5F7;
                box-shadow: 0 10px 30px 3px rgba(5, 16, 55, 0.15);
                min-width: 150px;
                max-width: 300px;

                &:has(.search) {
                    .options {
                        padding-top: 0;

                        .option {
                            &:first-child {
                                border-radius: 0;
                            }
                        }
                    }
                }

                .options {
                    padding: 4px;

                    .option {
                        padding: 8px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;

                        &:not(:last-child) {
                            border-bottom: 1px solid #DCE5F7;
                        }

                        &:first-child {
                            border-radius: 4px 4px 0 0;
                        }

                        &:last-child {
                            border-radius: 0 0 4px 4px;
                        }

                        &:hover {
                            background-color: #24C58620;
                        }

                        &.selected {
                            background-color: #24C58620;
                        }
                    }
                }

                .search {
                    input {
                        width: 100%;
                        padding: 8px 12px;
                        border-bottom: 1px solid #DCE5F7;
                    }
                }

                &.select {
                    .options {
                        max-height: 250px;
                        overflow-y: auto;
                    }
                }

                &:before {
                    content: '';
                    position: absolute;
                    z-index: 10001;
                    top: 0;
                    left: -5px;
                    width: 5px;
                    height: 100%;
                }
            }
        }
    }

    html.prefer-dark, html.dark-theme {
        .context-menu {
            background-color: #152234;
            border: 1px solid #273752;

            .context-menu-action {
                &:not(:last-child) {
                    border-bottom: 1px solid #273752;
                }

                .action-options {
                    background-color: #152234;
                    border: 1px solid #273752;


                    .options {
                        .option {
                            &:not(:last-child) {
                                border-bottom: 1px solid #273752;
                            }
                        }
                    }

                    .search {
                        input {
                            border-bottom: 1px solid #273752;
                        }
                    }
                }
            }
        }
    }
</style>