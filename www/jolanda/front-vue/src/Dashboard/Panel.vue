<script setup>
import {computed, nextTick, ref} from "vue";
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import {useTranslations} from "@/Composables/useTranslation.js";

    import TaskList from "@/Dashboard/TaskList.vue";
    import Tooltip from "@/Components/Other/Tooltip.vue";

    const props = defineProps({
        config: Object,
        panel: Object,
    });

    const { translations } = useTranslations();
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);
    const emit = defineEmits(['open-kanban', 'open-gantt']);

    function toggleMinimize() {
        props.panel.minimized = !props.panel.minimized;
    }

    const panelEl = ref(null);
    function toggleMaximize() {
        props.panel.maximized = !props.panel.maximized;

        if(props.panel.maximized) {
            nextTick(() => {
                if (panelEl.value) {
                    const dashboardEl = panelEl.value.closest('.dashboard-area-inner');
                    if (dashboardEl)
                        dashboardEl.scrollLeft = panelEl.value.offsetLeft - 10;
                }
            });
        }
    }

    function createTask() {
        modalStore.openModal('task-create', 'task-create', {
            solver: {
                id: props.panel.id,
                name: props.panel.title,
            }
        });
    }

    const isMobile = computed(() => {
        return screen.width <= 768;
    });
</script>

<template>
    <div
        v-show="panel.isVisible"
        ref="panelEl"
        class="panel-dashboard"
        :class="[{
            'minimized': panel.minimized,
            'maximized': panel.maximized,
        }]"
    >
        <div
            class="header"
            @click.stop="toggleMinimize"
        >
            <div class="panel-drag-handle">
                <Icon icon="drag" :width="20" :height="20" color="#fff" />
            </div>
            <div class="user">
                <Icon class="user-icon" icon="user-photo" color="#fff" :width="28" :height="28" :photo-path="panel.icon" />
                <div class="title">{{ panel.title }}</div>
            </div>
            <Tooltip v-if="!isMobile &&config.allowedFeatures.includes('kanban')" text="Kanban" class="open-kanban" @click.stop="emit('open-kanban', panel.id)">
                <Icon icon="columns" :width="20" :height="20" color="#fff" />
            </Tooltip>
            <Tooltip v-if="!isMobile" class="open-gantt" text="Gantt" @click.stop="emit('open-gantt', panel.id)">
                <Icon icon="list" :width="20" :height="20" color="#0000" />
            </Tooltip>
            <div class="new-task" @click.stop="createTask">
                <Icon icon="plus" color="#fff" :width="16" :height="16" />
                {{ translations.NEW_TASK }}
            </div>
            <div v-if="!isMobile" class="maximize" @click.stop="toggleMaximize">
                <Icon icon="arrow" color="#fff" :width="12" :height="21" :direction="panel.maximized ? 'left' : 'right'" />
            </div>
        </div>
        <div class="tasks-container">
            <TaskList
                v-for="taskList in panel.taskLists"
                :key="taskList.id"
                :config="config"
                :panel-id="panel.id"
                :panel-type="panel.type"
                :panel-maximized="panel.maximized"
                :task-list="taskList"
            />
        </div>
    </div>
</template>

<style scoped>
    .panel-dashboard {
        min-width: 680px;
        max-width: 680px;
        max-height: 100%;
        border-radius: 8px;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: min-width .15s, max-height .15s;

        @media (max-width: 768px) {
            min-height: 600px;
            min-width: 100%;
            width: 100%;

            &.minimized {
                min-height: 36px;
            }
        }

        &.minimized {
            min-width: 300px;
            max-height: 36px;

            .header {
                .user {
                    overflow: hidden;
                }

                .open-kanban, .maximize, .open-gantt {
                    overflow: hidden;
                    max-width: 0;
                    opacity: 0;
                    pointer-events: none;
                }
            }

            .tasks-container {
                overflow: hidden;
                max-width: 0;
                opacity: 0;
            }
        }

        &.maximized:not(.minimized) {
            min-width: 1500px;
            max-width: 100%;
        }

        &:not(.disable-drag) {
            .panel-drag-handle {
                cursor: grab;

                &:active {
                    cursor: grabbing;
                }
            }
        }

        .header {
            border-radius: 8px 8px 0 0;
            padding: 8px;
            color: #fff;
            background-color: v-bind('panel.color');
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            min-height: 36px;
            max-height: 36px;
            cursor: pointer;

            .user {
                display: flex;
                align-items: center;
                gap: 8px;

                .user-icon {
                    min-width: 28px;
                    min-height: 28px;
                }

                .title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .new-task {
                transition: opacity .15s, max-width .15s;
                max-width: 100px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                padding-right: 8px;
                text-decoration: underline;
                margin-left: auto;
                white-space: nowrap;
            }

            .maximize {
                background-color: #152234;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }

        .tasks-container {
            transition: opacity .15s, max-width .15s;
            max-width: 100%;
            padding: 0 4px;
            overflow-x: hidden;
            overflow-y: auto;
            scrollbar-color: #abd #cde;
            scrollbar-width: thin;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    }

    html.prefer-dark, html.dark-theme {
        .panel-dashboard {
            background-color: #273752;

            .tasks-container {
                scrollbar-color: #506485 #273752;
            }
        }
    }
</style>