<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useSpeechRecognition } from '@vueuse/core'
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";

    import {useTranslations} from "@/Composables/useTranslation.js";
    import {useAlerts} from "@/Composables/useAlerts.js";

    const props = defineProps({
        show: Boolean,
        defaultValues: Object,
        endpoints: {
            type: Object,
        },
        allowedFeatures: Array, // otherSolvers, changeAuthor, expectedReturn, departments
        standalone: {
            type: Boolean,
            default: false,
        },
        modalProps: Object,
    });

    const emit = defineEmits(['close', 'task-created']);
    const {translations} = useTranslations();
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);
    const alerts = useAlerts();
    const { isSupported, isListening, result, start, stop } = useSpeechRecognition({
        lang: 'cs-CZ',
        interimResults: true,
        continuous: true,
    });

    const maximizeAction = {
        id: 'maximizeAction',
        tooltip: 'Maximize',
        icon: 'fullscreen',
        action: () => {
            toggleMaximize();
        }
    }

    const speechRecognitionAction = {
        id: 'speechRecognitionAction',
        tooltip: 'Speech recognition',
        icon: 'microphone',
        action: () => {
            toggleSpeechRecognition();
        }
    }

    const tinyMceActions = ref([]);
    const tinyMceMaximizedActions = ref([]);
    const tinyMceInitialize = ref(false);
    onMounted(() => {
        if(isSupported.value) {
            tinyMceActions.value = [maximizeAction, speechRecognitionAction];
            tinyMceMaximizedActions.value = [speechRecognitionAction];
        } else {
            tinyMceActions.value = [maximizeAction];
            tinyMceMaximizedActions.value = [];
        }

        tinyMceInitialize.value = true;
    });

    const editorElement = ref(null);
    const submitted = ref(false);
    const isDragging = ref(false);
    const fileInput = ref(null);
    const loading = ref(false);

    const title = ref(props.defaultValues?.title);
    const solver = ref({value: props.defaultValues?.solver?.id, text: props.defaultValues?.solver?.name});
    const author = ref(null);
    const otherSolvers = ref([]);
    const priority = ref(dashboardStore.priorities?.low?.value);
    const dateDeadline = ref({});
    const errorFlag = ref(false);
    const content = ref('');
    const attachments = ref([]);
    const expectedReturn = ref('');
    const expectedReturnFinance = ref(0);
    const project = ref({value: props.defaultValues?.project?.id, text: props.defaultValues?.project?.name});
    const department = ref(null);
    const categories = ref([]);

    onMounted(async () => {
       if(props.standalone) {
           await dashboardStore.fetchUsers(props.endpoints.getUsers);
           await dashboardStore.fetchCategories(props.endpoints.getCategories);
           await dashboardStore.fetchStates(props.endpoints.getStates);
           await dashboardStore.fetchPriorities(props.endpoints.getPriorities);
           await dashboardStore.fetchProjects(props.endpoints.getProjects);
           await dashboardStore.fetchProjectMilestones(props.endpoints.getProjectMilestones);

           if(props.allowedFeatures.includes('departments'))
               await dashboardStore.fetchDepartments(props.endpoints.getDepartments);

           priority.value = dashboardStore.priorities?.low.value;
       }
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

    const isTitleValid = computed(() => {
        return title.value && title.value.trim().length >= 1;
    });

    const isSolverValid = computed(() => {
        return solver.value && solver.value.value && solver.value.value !== '0'
    });

    const isFormValid = computed(() => {
        return isTitleValid.value && isSolverValid.value;
    });

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
        attachments.value = [...attachments.value, ...droppedFiles];
    }

    function handleFileSelect(event) {
        const selectedFiles = Array.from(event.target.files);
        attachments.value = [...attachments.value, ...selectedFiles];
        event.target.value = null;
    }

    function removeSelectedFile(index) {
        attachments.value.splice(index, 1);
    }

    async function createTask() {
        submitted.value = true;
        if(!isFormValid.value) {
            alerts.alert(translations.VALIDATION_ERR, 'error');
            return;
        }

        const data = {};
        data.panelType = dashboardStore.panelFilters.panelType;
        data.title = title.value;
        data.solverId = solver.value.value;
        data.otherSolverIds = JSON.stringify(otherSolvers.value);
        data.priority = priority.value;
        data.dateDeadline = typeof dateDeadline.value === 'object' || dateDeadline.value === 'Invalid date' ? null : dateDeadline.value;
        data.errorFlag = errorFlag.value;
        data.content = content.value;
        data.expectedReturn = expectedReturn.value;
        data.expectedReturnFinance = expectedReturnFinance.value;
        data.project = project.value?.value;
        data.department = department.value;
        data.categories = JSON.stringify(categories.value);
        if(props.defaultValues?.parentTaskId)
            data.parentTaskId = props.defaultValues?.parentTaskId;
        if(props.allowedFeatures.includes('changeAuthor'))
            data.authorId = author.value?.value;
        if(attachments.value.length > 0)
            data.files = attachments.value;

        loading.value = true;
        if(props.standalone) {
            const newTask = await dashboardStore.addTask(props.endpoints.createTask, data, true);
            emit('task-created', newTask, data);
        } else await dashboardStore.addTask(props.endpoints.createTask, data);
        loading.value = false;

        emit('close');
    }

    function toggleMaximize() {
        modalStore.openModal('task-create-editor', 'task-create-editor', {});
        const buttons = editorElement.value.$el.querySelectorAll('button');
        buttons.forEach(el => el.blur());
    }

    function toggleSpeechRecognition() {
        if(isListening.value)
            stop();
        else start();
    }

    watch(() => result.value, (newValue) => {
        if (newValue?.trim())
            content.value += ` ${newValue}`;
    });

    function close() {
        emit('close');
    }
</script>

<template>
    <Modal
        :isVisible="show"
        :position="props.defaultValues?.parentTaskId ? 'left' : 'right'"
        size="small"
        :block-page="false"
        @update:is-visible="close"
        v-bind="modalProps"
    >
        <template v-slot:header>
            {{ translations.CREATE_TASK }}
        </template>
        <template v-slot:body>
            <div
                class="task-create-form task-create-form-drop-zone"
                :class="{ 'drop-zone-active': isDragging, 'loading': loading }"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
            >
                <div class="task-create-row">
                    <div class="task-create-input">
                        <div class="task-create-input-label">{{ translations.TITLE }}:</div>
                        <InputField v-model="title" font="realist" :class="{ invalid: submitted && !isTitleValid }" />
                    </div>

                    <div class="task-create-input">
                        <Checkbox v-model="errorFlag" :label="translations.ERROR_REPORTING" />
                    </div>
                </div>

                <div class="task-create-row" v-if="allowedFeatures.includes('changeAuthor')">
                    <div class="task-create-input">
                        <div class="task-create-input-label">{{ translations.AUTHOR }}:</div>
                        <Select v-model="author" size="small" :required="true" :returnObject="true" :filterable="true" :options="usersEnum" font="realist" />
                    </div>
                </div>

                <div class="task-create-row">
                    <div class="task-create-input">
                        <div class="task-create-input-label">{{ translations.SOLVER }}:</div>
                        <Select v-model="solver" :required="true" :returnObject="true" :filterable="true" :options="usersEnum"  font="realist" :class="{ invalid: submitted && !isSolverValid }" />
                    </div>

                    <div v-if="allowedFeatures.includes('otherSolvers')" class="task-create-input" style="max-width: 50%;">
                        <div class="task-create-input-label">{{ translations.OTHER_SOLVERS }}:</div>
                        <Select v-model="otherSolvers" :multiple="true" :returnObject="true" :filterable="true" :options="usersEnum"  font="realist" />
                    </div>
                </div>

                <div class="task-create-row">
                    <div class="task-create-input">
                        <div class="task-create-input-label">{{ translations.PRIORITY }}:</div>
                        <div class="task-create-radios">
                            <Radio v-model="priority" :label="dashboardStore.priorities?.low?.name" :value="dashboardStore.priorities?.low?.value" font="realist"/>
                            <Radio v-model="priority" :label="dashboardStore.priorities?.medium?.name" :value="dashboardStore.priorities?.medium?.value" font="realist"/>
                            <Radio v-model="priority" :label="dashboardStore.priorities?.high?.name" :value="dashboardStore.priorities?.high?.value" font="realist"/>
                        </div>
                    </div>

                    <div class="task-create-input">
                        <div class="task-create-input-label">{{ translations.DATE_DEADLINE }}:</div>
                        <DatePicker  v-model="dateDeadline" />
                    </div>
                </div>
                <div class="task-create-row">
                    <div class="task-create-input">
                        <div class="task-create-input-label">{{ translations.PROJECT }}:</div>
                        <Select v-model="project" :required="true" :filterable="true" :return-object="true" :options="projectsEnum" font="realist" />
                    </div>
                    <div class="task-create-input" v-if="allowedFeatures.includes('departments')">
                        <div class="task-create-input-label">{{ translations.DEPARTMENT }}:</div>
                        <Select v-model="department" :filterable="true" :options="departmentsEnum" font="realist" />
                    </div>
                    <div class="task-create-input">
                        <div class="task-create-input-label">{{ translations.CATEGORY }}:</div>
                        <Select v-model="categories" :multiple="true" :returnObject="true" :options="categoriesEnum" font="realist" />
                    </div>
                </div>

                <div class="task-create-row">
                    <div v-if="allowedFeatures.includes('expectedReturn')" class="task-create-input">
                        <div class="task-create-input-label">
                            <span>{{ translations.EXPECTED_RETURN_FINANCE }} ({{ translations.EXPECTED_RETURN_FINANCE_HELP }}):</span>
                        </div>
                        <InputField v-model="expectedReturnFinance" type="number" font="realist" />
                    </div>
                </div>

                <div class="task-create-row">
                    <div v-if="allowedFeatures.includes('expectedReturn')" class="task-create-input">
                        <div class="task-create-input-label">
                            <span>{{ translations.EXPECTED_RETURN }}:</span>
                        </div>
                        <TextArea v-model="expectedReturn" font="realist" :rows="2" :placeholder="translations.EXPECTED_RETURN_HELP" />
                    </div>
                </div>

                <div>
                    <div class="is-listening-container" v-if="isSupported && isListening">
                        <div class="pulse-circle"></div>
                        <div>Naslouchám ...</div>
                    </div>
                    <TinyMCE v-if="tinyMceInitialize" v-model="content" ref="editorElement" :compact="true" :custom-actions="tinyMceActions" :height="200" />
                </div>

                <div class="task-create-row">
                    <div class="attachment-upload-area">
                        <div v-if="attachments.length === 0" @click="fileInput.click()">{{ translations.CHOOSE_FILES }}</div>
                        <div v-else>
                            <span v-for="(attachment, index) in attachments" :key="index" class="selected-file" @click="removeSelectedFile(index)">{{ attachment.name }}<span v-if="index < attachments.length - 1">, </span></span>
                        </div>
                        <input
                            type="file"
                            multiple
                            class="file-input"
                            @change="handleFileSelect"
                            ref="fileInput"
                        />
                    </div>
                    <div class="create-task" @click="createTask">
                        <div>{{ translations.CREATE_TASK }}</div>
                    </div>
                </div>
            </div>
            <Modal
                v-for="modal in modalStore.openedModalsByType['task-create-editor']"
                :isVisible="true"
                size="medium"
                @update:is-visible="modalStore.closeModal(modal.id)"
                :z-index="6000"
            >
                <template v-slot:header>
                    {{ translations.CREATE_TASK }}
                </template>
                <template v-slot:body>
                    <div class="maximized-task-reply-form">
                        <div class="is-listening-container" v-if="isSupported && isListening">
                            <div class="pulse-circle"></div>
                            <div>Naslouchám ...</div>
                        </div>
                        <TinyMCE v-if="tinyMceInitialize" :key="'big-editor-task-create-form'" ref="editorElement" :custom-actions="tinyMceMaximizedActions" v-model="content" :compact="true" :height="400" />
                    </div>
                </template>
            </Modal>
        </template>
    </Modal>
</template>

<style scoped>
    .is-listening-container {
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: 600;
        color: #24C586;

        .pulse-circle {
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background-color: #e22;
            animation: pulse 1s infinite;
        }
    }

    .task-create-form {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        position: relative;

        &.drop-zone-active {
            overflow: hidden;
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
                z-index: 6000;
                background: linear-gradient(90deg, transparent 20%, #24C58633 50%, transparent 80%);
                animation: task-creating 1s linear infinite;
                background-size: 200% 100%;
            }
        }

        .task-create-row {
            display: flex;
            align-items: center;
            gap: 1rem;

            & > * {
                flex-grow: 1;
                flex-basis: 50%;
            }

            .task-create-input {
                font-size: 0;

                & > * {
                    flex-grow: 1;
                }

                .invalid {
                    :deep(input), .input-wrapper {
                        border: 1px solid #e22;
                    }
                }

                .task-create-radios {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .task-create-input-label {
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: .25rem;
                }
            }

            .attachment-upload-area {
                display: flex;
                justify-content: center;
                border: 2px dashed #cde;
                border-radius: .5rem;
                padding: calc(.5rem - 2px) 1rem;
                text-align: center;
                cursor: pointer;
                text-decoration: underline;
                font-weight: 600;
                background-color: #fff;

                .selected-file {
                    text-decoration: none;
                    font-weight: 400;
                    cursor: pointer;

                    &:hover {
                        text-decoration: line-through;
                    }
                }

                input {
                    display: none
                }
            }
        }

        .create-task {
            flex-basis: 20% !important;
            background-color: #24c586;
            color: #fff;
            padding: .5rem 1rem;
            border-radius: .25rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: .5rem;

            &.disabled {
                cursor: not-allowed;
                pointer-events: none;
                background-color: #24c58688;
            }
        }
    }

    .task-create-form .task-create-row .task-create-input .invalid :deep(input),
    .task-create-form .task-create-row .task-create-input .invalid.select :deep(.input-wrapper)
    {
        border: 1px solid #e22;
    }

    html.prefer-dark {
        .task-create-form {
            .task-create-row {
                &:deep(.compact-editor) {
                    .tox-tinymce {
                        border: 1px solid #777;
                    }
                }

                .task-create-input {
                    .invalid {
                        :deep(input), .input-wrapper {
                            border: 1px solid #e22;
                        }
                    }

                    &:deep(.input-wrapper) {
                        border: 1px solid #444;
                        background-color: #444 !important;
                        color: #c8c8c8 !important;

                        .input, svg {
                            color: #c8c8c8 !important;
                        }
                    }

                    &:deep(.input){
                        background-color: #444;
                    }
                }

                .attachment-upload-area {
                    border: 2px dashed #777;
                    background: #333;
                }
            }
        }

        .maximized-task-reply-form {
            &:deep(.compact-editor) {
                .tox-tinymce {
                    border: 1px solid #777;
                }
            }
        }
    }

    html.dark-theme {
        .task-create-form {
            .task-create-row {
                .attachment-upload-area {
                    border: 2px dashed #273752;
                    background: #0c1119;
                }
            }
        }
    }

    @keyframes task-creating {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>