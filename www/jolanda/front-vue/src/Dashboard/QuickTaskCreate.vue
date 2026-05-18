<script setup>
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore.js";
    import {computed, ref} from "vue";
    import {useTranslations} from "@/Composables/useTranslation.js";
    import DatePicker from "@/Components/Inputs/DatePicker.vue";
    import Select from "@/Components/Inputs/Select.vue";
    import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";

    const props = defineProps({
        solverId: String,
        priorityFlag: Boolean,
        panelMaximized: Boolean,
        createTaskEndpoint: String,
    });

    const dashboardStore = useDashboardStore(window.pinia);
    const alertStore = useAlertStore(window.pinia);
    const {translations} = useTranslations();

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

    const priority = ref(dashboardStore.priorities?.low.value);
    const errorReporting = ref(false);
    const title = ref('');
    const dateDeadline = ref(null);
    const project = ref(null);
    const categories = ref([]);
    const department = ref(null);
    const otherSolvers = ref([]);

    const submitted = ref(false);
    const loading = ref(false);
    const isValid = computed(() => {
        return title.value && title.value.trim().length >= 3;
    });

    const createTask = async () => {
        submitted.value = true;
        if(!isValid.value) {
            alertStore.error(translations.VALIDATION_ERR);
            return;
        }

        const data = {};
        data.panelType = dashboardStore.panelFilters.panelType;
        data.title = title.value;
        data.solverId = props.solverId;
        data.otherSolverIds = JSON.stringify(otherSolvers.value);
        data.priority = priority.value;
        data.priorityFlag = props.priorityFlag;
        data.dateDeadline = typeof dateDeadline.value === 'object' || dateDeadline.value === 'Invalid date' ? null : dateDeadline.value;
        data.errorFlag = errorReporting.value;
        data.project = project.value;
        data.department = department.value;
        data.categories = JSON.stringify(categories.value);

        loading.value = true;
        await dashboardStore.addTask(props.createTaskEndpoint, data);
        loading.value = false;

        clear();
    }

    const clear = () => {
        submitted.value = false;
        priority.value = dashboardStore.priorities?.low.value;
        errorReporting.value = false;
        title.value = '';
        dateDeadline.value = null;
        project.value = null;
        categories.value = [];
        department.value = null;
        otherSolvers.value = [];
    }
</script>

<template>
    <div class="quick-task-create" :class="{ maximized: panelMaximized, loading: loading }">
        <div class="content">
            <Icon class="create-new-task" icon="plus" :width="16" :height="16" @click="createTask"/>
            <div class="priority" :class="[priority]">
                <div class="priority-point high" @click="priority = dashboardStore.priorities?.high.value" />
                <div class="priority-point medium" @click="priority = dashboardStore.priorities?.medium.value"/>
                <div class="priority-point low" @click="priority = dashboardStore.priorities?.low.value" />
            </div>
            <Icon class="error-reporting" :class="{ set: errorReporting }" icon="exclamation-mark-alt" :width="3" :height="16" @click="errorReporting = !errorReporting" />
            <div class="title" :class="{ invalid: submitted && !isValid }">
                <input type="text" v-model="title" placeholder="Název úkolu" @keyup.enter="createTask" />
            </div>
        </div>
        <div class="extra-content" v-show="panelMaximized">
            <div class="date-deadline">
                <DatePicker v-model="dateDeadline"/>
            </div>
            <div class="project">
                <Select v-model="project" :options="projectsEnum" />
            </div>
            <div class="categories">
                <Select v-model="categories" :options="categoriesEnum" multiple return-object />
            </div>
            <div class="department">
                <Select v-model="department" :options="departmentsEnum" />
            </div>
            <div class="other-solvers">
                <Select v-model="otherSolvers" :options="usersEnum" multiple filterable return-object />
            </div>
        </div>
    </div>
</template>

<style scoped>
    .quick-task-create {
        display: flex;
        gap: 4px;
        padding: 4px;
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
                animation: quick-task-create-loading 1s linear infinite;
                background-size: 200% 100%;
            }
        }

        .content {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-grow: 1;

            .create-new-task {
                color: #cde;
                cursor: pointer;

                &:hover {
                    color: #24C586;
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
                    cursor: pointer;
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

                &:has(.low:hover) {
                    .priority-point {
                        background-color: #cde;
                    }

                    .priority-point:nth-child(3) {
                        background-color: #24C586;
                    }
                }

                &:has(.medium:hover) {
                    .priority-point {
                        background-color: #cde;
                    }

                    .priority-point:nth-child(2), .priority-point:nth-child(3) {
                        background-color: #fb3;
                    }
                }

                &:has(.high:hover) {
                    .priority-point {
                        background-color: #e22;
                    }
                }
            }

            .error-reporting {
                color: #cde;
                cursor: pointer;

                &.set, &:hover {
                    color: #e22;
                }
            }

            .title {
                flex-grow: 1;

                input {
                    appearance: none;
                    outline: none;
                    border: none;
                    box-shadow: none;
                    width: 100%;
                    height: 19px;
                    padding: 0 4px;
                    border-bottom: 1px solid transparent;

                    &:hover, &:focus {
                        border-bottom: 1px solid #cde;
                    }
                }

                &.invalid {
                    input {
                        &:hover, &:focus {
                            border-bottom: 1px solid #e22;
                        }
                    }
                }
            }
        }

        &.maximized {
            .content {
                max-width: 346px;
            }
        }

        .extra-content {
            display: flex;
            flex-grow: 1;
            align-items: end;
            gap: 11px;
            margin-left: 30px;

            .other-solvers {
                flex-grow: 1;
            }
            
            .date-deadline {
                width: 110px;

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

            .project {
                width: 90px;
            }

            .categories {
                width: 70px;
            }

            .department {
                width: 90px;
            }

            .project, .categories, .department, .other-solvers {
                &:deep(.input-wrapper) {
                    min-height: 20px;
                    height: 20px;

                    .input {
                        font-size: 10px;
                    }
                }
            }
        }
    }

    @keyframes quick-task-create-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>