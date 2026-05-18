<script setup>
    import {ref, computed} from "vue";
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useTranslations} from "@/Composables/useTranslation.js";

    const props = defineProps({
        config: Object,
        parentTask: Object,
    });

    const {translations} = useTranslations();
    const dashboardStore = useDashboardStore(window.pinia);

    const titleInput = ref(null);
    const title = ref('');
    const titleValid = computed(() => {
        return title.value.length > 3;
    });
    const submitted = ref(false);
    const loading = ref(false);

    async function createTask() {
        if(!titleValid.value) {
            submitted.value = true;
            return;
        }

        const data = {};
        data.panelType = dashboardStore.panelFilters.panelType;
        data.title = title.value;
        data.priority = dashboardStore.priorities?.low.value;
        data.solverId = props.parentTask.solver.id;
        data.project = props.parentTask.project?.id;
        data.department = props.parentTask.department?.id;
        data.parentTaskId = props.parentTask.id;

        loading.value = true;
        await dashboardStore.addTask(props.config.endpoints.createTask, data);
        loading.value = false;
    }
</script>

<template>
    <div class="create-sub-task" :class="{ 'loading': loading }">
        <div class="title-input">
            <Icon icon="plus" class="create-button" :width="14" :height="14" color="#36557F" @click="createTask"/>
            <input ref="titleInput" :class="{ 'not-valid': submitted && !titleValid }" type="text" v-model="title" @keyup.enter="createTask"/>
            <Icon icon="arrow" :width="14" :height="14" color="#36557F" direction="right"/>
        </div>
    </div>
</template>

<style scoped>
    .create-sub-task {
        height: 24px;
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-bottom: 1px solid #DCE5F7;
        position: relative;
        background-color: #E8EFFF;

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
                animation: sub-task-create-loading 1s linear infinite;
                background-size: 200% 100%;
            }
        }

        .title-input {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 8px;

            .create-button {
                cursor: pointer;
            }

            input {
                width: 100%;
                background-color: #E8EFFF;

                &.not-valid {
                    border-bottom: 1px solid #e22;
                }

                &:hover:not(.not-valid), &:focus:not(.not-valid) {
                    border-bottom: 1px solid #DCE5F7;
                }
            }
        }
    }

    html.prefer-dark, html.dark-theme {
        .create-sub-task {
            border-bottom: 1px solid #152234;
            background-color: #506485;

            svg {
                color: #d5dbea !important;
            }

            .title-input {
                input {
                    background: #506485 !important;
                    border: 1px solid #506485 !important;

                    &.not-valid {
                        border-bottom: 1px solid #e22 !important;
                    }

                    &:hover:not(.not-valid), &:focus:not(.not-valid) {
                        border-bottom: 1px solid #152234 !important;
                    }
                }
            }
        }
    }

    @keyframes sub-task-create-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>