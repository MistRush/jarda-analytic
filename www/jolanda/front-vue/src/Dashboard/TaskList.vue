<script setup>
    import { VueDraggable } from 'vue-draggable-plus';
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useTranslations} from "@/Composables/useTranslation.js";

    import Task from "@/Dashboard/Task.vue";
    import {ref} from "vue";
    import QuickTaskCreate from "@/Dashboard/QuickTaskCreate.vue";

    const props = defineProps({
        config: Object,
        panelId: undefined,
        panelType: String,
        panelMaximized: Boolean,
        taskList: Object,
    });

    const {translations} = useTranslations();
    const dashboardStore = useDashboardStore(window.pinia);
    const onTaskReorder = async (event) => {
        const taskId = event.item.dataset.taskId;
        const oldTaskListId = event.from.dataset.taskListId;
        const oldPanelId = event.from.dataset.panelId;
        const newTaskListId = event.to.dataset.taskListId;
        const newPanelId = event.to.dataset.panelId;

        const updatedData = {};
        if(oldTaskListId !== newTaskListId)
            updatedData.taskListId = newTaskListId;

        if(oldPanelId !== newPanelId)
            updatedData.panelId = newPanelId;

        if(Object.keys(updatedData).length > 0) {
            const task = dashboardStore.dashboardPanels?.find(panel => panel.id === newPanelId)?.taskLists?.find(taskList => taskList.id === newTaskListId)?.tasks?.find(task => task.id === taskId);
            await dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, task, updatedData, newTaskListId, newPanelId);
        }

        await dashboardStore.updateTaskOrder(props.config.endpoints.updateTaskOrder, newPanelId, newTaskListId);
    };

    function toggleList() {
        props.taskList.shown = !props.taskList.shown;
    }
</script>

<template>
    <div v-show="taskList.isVisible" class="task-list" :class="{ loading: taskList.loading, maximized: panelMaximized }">
        <div
            class="title"
            @click="toggleList"
        >
            <div class="title-content">
                <div v-if="taskList.shown" class="sign">-</div>
                <div v-else class="sign">+</div>
                <div>{{ taskList.title }}</div>
                <div class="counter">{{ taskList.tasks.length }}</div>
                <div class="counter viewed">{{ taskList.tasks.filter(task => !task.viewedFlag).length }}</div>
                <div class="hours-counter">{{ taskList.tasks.reduce((sum, task) => sum + (task.expectedHours ?? 0), 0) }}h</div>
            </div>

            <div class="maximized-titles">
                <div class="date">{{ translations.DATE_DEADLINE }}</div>
                <div class="project">{{ translations.PROJECT }}</div>
                <div class="category">{{ translations.CATEGORY }}</div>
                <div class="department">{{ translations.DEPARTMENT }}</div>
                <div class="solvers">{{ translations.OTHER_SOLVERS }}</div>
            </div>
        </div>
        <VueDraggable
            v-show="taskList.shown"
            ref="el"
            class="tasks"
            v-model="taskList.tasks"
            :disabled="config.permissions.includes('disableReorder')"
            group="tasks"
            handle=".drag-handle"
            @end="onTaskReorder"
            :animation="150"
            :data-task-list-id="taskList.id"
            :data-panel-id="panelId"
        >
            <Task
                v-for="task in taskList.tasks"
                :draggable="!config.permissions.includes('disableReorder')"
                :key="task.id"
                :config="config"
                :task="task"
                :panel-maximized="panelMaximized"
            />
        </VueDraggable>
        <QuickTaskCreate
            v-if="dashboardStore.panelFilters.panelType === 'solver' && ['default', 'priority'].includes(taskList.id)"
            :solver-id="panelId"
            :priority-flag="taskList.id === 'priority'"
            :panel-maximized="panelMaximized"
            :create-task-endpoint="config.endpoints.createTask"
        />
    </div>
</template>

<style scoped>
    .task-list:last-child {
        flex-grow: 1;
    }

    .task-list {
        position: relative;

        &.loading {
            pointer-events: none;

            &::after {
                position: absolute;
                top: 0;
                left: 0;
                content: "";
                height: 100%;
                width: 100%;
                backdrop-filter: blur(2px);
                z-index: 1;
                background: linear-gradient(90deg, transparent 20%, #24C58633 50%, transparent 80%);
                animation: task-list-loading 1s linear infinite;
                background-size: 200% 100%;
            }
        }

        &.maximized {
            .title {
                .title-content {
                    width: 380px;
                }

                .maximized-titles {
                    display: flex;
                    align-items: center;
                    font-size: 10px;
                    gap: 11px;
                    color: #36557F;

                    & > div {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .date {
                        width: 110px;
                    }

                    .solvers {
                        width: 180px;
                    }

                    .project, .department {
                        width: 90px;
                    }

                    .category {
                        width: 70px;
                    }
                }
            }
        }
    }

    .title {
        display: flex;
        align-items: center;
        cursor: pointer;
        gap: 4px;
        padding: 8px 0;

        &:hover {
            background-color: #f0fcf4;

            &.deferred {
                background-color: #eef;
            }

            &.priority  {
                background-color: #fee;
            }
        }

        .title-content {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
        }

        .maximized-titles {
            display: none;
        }

        .sign {
            background-color: #f0f0ff;
            width: 15px;
            height: 15px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }

        .counter {
            color: #24C586;
            background-color: #f0fcf4;
            padding: 0 6px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;

            &.deferred {
                color: #8ab;
                background-color: #f0f0ff;
            }

            &.viewed {
                color: #16f;
                background-color: #e9f2ff;
            }

            &.priority  {
                color: #e22;
                background-color: #fee;
            }
        }

        .hours-counter {
            color: #16f;
            font-weight: 500;
            font-size: 12px;
        }
    }

    .tasks {
        &.priority {
            font-weight: 700;
        }

        &.deferred {
            color: #567;
        }
    }

    html.prefer-dark, html.dark-theme {
        .task-list {
            &.maximized {
                .title {
                    .maximized-titles {
                        color: #c8c8c8;
                    }
                }
            }
        }

        .title {
            &:hover {
                background-color: #506485;
            }

            .sign {
                background-color: #152234;
            }

            .counter {
                color: #24C586;
                background-color: #152234;


                &.viewed {
                    color: #58e;
                    background-color: #152234;
                }

            }

            .hours-counter {
                color: #58e;
            }
        }
    }

    @keyframes task-list-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>