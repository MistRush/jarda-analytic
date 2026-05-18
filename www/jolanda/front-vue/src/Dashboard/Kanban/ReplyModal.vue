<script setup>
    import {computed, ref} from 'vue';
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore";
    import {useModalStore} from "@/Dashboard/stores/modalStore";
    import { useTranslations } from "@/Composables/useTranslation.js";

    import Modal from '@/Components/Modal/Modal.vue';
    import Checkbox from "@/Components/Inputs/Checkbox.vue";
    import TinyMCE from "@/Components/Inputs/TinyMCE.vue";
    import Slider from "@/Components/Inputs/Slider.vue";
    import Radio from "@/Components/Inputs/Radio.vue";
    import Select from "@/Components/Inputs/Select.vue";

    const props = defineProps({
        show: Boolean,
        config: Object,
        data: Object
    });
    const {translations} = useTranslations();
    const emit = defineEmits(['close']);
    const dashboardStore = useDashboardStore(window.pinia);
    const modalStore = useModalStore(window.pinia);

    const onHoldOptions = [
        { value: dashboardStore.onHoldTypes?.missingAssignment.value, text: dashboardStore.onHoldTypes?.missingAssignment.name },
        { value: dashboardStore.onHoldTypes?.otherPriorities.value, text: dashboardStore.onHoldTypes?.otherPriorities.name },
    ];

    const isOnHold = computed(() => {
        return props.data.state === dashboardStore.states?.onHold.value;
    });

    const percentProgress = ref(props.data.task.percentProgress);
    const sendEmail = ref(true);
    const content = ref('');
    const waitingFor = ref('author');
    const onHoldType = ref(dashboardStore.onHoldTypes?.missingAssignment.value);

    function sendReply() {
        dashboardStore.updateTask(props.config.endpoints.updateTask, props.config.endpoints.updateTaskOrder, props.data.task, {
            percentProgress: percentProgress.value,
            reply: {
                state: props.data.state,
                sendEmail: sendEmail.value,
                content: content.value,
                waitingFor: waitingFor.value,
                onHoldType: onHoldType.value,
                userId: props.config.currentUser,
            },
            filterOut: props.data.state === dashboardStore.states?.completed.value || props.data.state === dashboardStore.states?.canceled.value,
        });

        modalStore.closeModal('kanban-reply');
    }
</script>

<template>
    <Modal
        :isVisible="show"
        size="small"
        @update:is-visible="emit('close')"
    >
        <template v-slot:header>
            {{ translations.SEND_REPLY }}
        </template>
        <template v-slot:body>
            <div class="kanban-reply" :class="{ 'loading': data.task.loading }">
                <div>
                    <TinyMCE v-model="content" :compact="true" :height="175" />
                </div>
                <div style="margin-top: .5rem">{{ translations.PERCENT_PROGRESS }}:</div>
                    <Slider :min="0" :max="100" :step="1" v-model="percentProgress" />
                <div v-if="isOnHold" style="margin-top: .5rem; display: flex;">
                    <div style="flex-grow: 1; flex-basis: 50%">
                        <div>{{ translations.WAITING_FOR }}:</div>
                        <div style="display: flex; gap: 1rem">
                            <Radio class="task-filter-checkbox" v-model="waitingFor" :label="translations.WAITING_FOR_AUTHOR" :value="'author'" font="realist"/>
                            <Radio class="task-filter-checkbox" v-model="waitingFor" :label="translations.WAITING_FOR_SOLVER" :value="'solver'" font="realist"/>
                        </div>
                    </div>
                    <div style="flex-grow: 1; flex-basis: 50%">
                        <div>{{ translations.ON_HOLD_REASON }}:</div>
                        <Select size="small" :options="onHoldOptions" v-model="onHoldType" font="realist" :required="true" />
                    </div>
                </div>
                <div class="send-row">
                    <Checkbox v-model="sendEmail" :label="translations.SEND_EMAIL" />
                    <div class="send-reply" @click="sendReply">
                        <div>{{ translations.SEND_REPLY }}</div>
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .kanban-reply {
        position: relative;

        &.loading {
            overflow: hidden;
        }

        &.loading:after {
            position: absolute;
            content: "";
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 6000;
            backdrop-filter: blur(10px);
            background: linear-gradient(90deg, transparent 20%, #24C58633 50%, transparent 80%);
            animation: kanban-reply-loading 1s linear infinite;
            background-size: 200% 100%;
        }
    }

    .send-row {
        margin-top: .5rem;
        display: flex;
        align-items: center;
        width: 100%;

        & > * {
            flex-grow: 1;
            flex-basis: 50%;
        }

        .send-reply {
            background-color: #24c586;
            color: #fff;
            padding: .5rem 1rem;
            border-radius: .25rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    @keyframes kanban-reply-loading {
        0% {
            background-position: 200% 0
        }
        100% {
            background-position: 0 0
        }
    }
</style>