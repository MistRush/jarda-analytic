import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';

const modalStack = ref([
    { type: 'task-detail', modals: [] },
    { type: 'task-create', modals: [] },
    { type: 'task-reply', modals: [] },
    { type: 'help', modals: [] },
    { type: 'task-create-editor', modals: [] },
    { type: 'kanban-reply', modals: [] }
]);

const openModals = ref([]);

export const useModalStore = defineStore('modalStore', () => {
    function openModal(type, id, props) {
        const stack = modalStack.value.find((stack) => stack.type === type);
        const modal = stack.modals.find((modal) => modal.id === id);
        if(modal) {
            modal.props = props;
        } else {
            if(stack.modals.length >= 5)
                closeFirstOpenedModal();

            stack.modals.push({id: id, minimized: false, props: props});
            openModals.value.push(id);
        }

        maximizeModal(stack.type, id);
    }

    function closeModal(id) {
        let task = null;
        modalStack.value.forEach((stack) => {
            if(stack.type === 'task-detail') {
                task = stack.modals.find((modal) => modal.id === id)?.props;
                if(task && task.active)
                    task.active = false;
            }

            stack.modals = stack.modals.filter((modal) => modal.id !== id);

            return stack;
        });

        openModals.value = openModals.value.filter((modalId) => modalId !== id);
    }

    function closeLastOpenedModal() {
        const id = openModals.value.pop();
        if(!id)
            return;

        closeModal(id);
    }

    function closeFirstOpenedModal() {
        const id = openModals.value.shift();
        if(!id)
            return;

        closeModal(id);
    }

    function maximizeModal(type, id) {
        const stack = modalStack.value.find((stack) => stack.type === type);
        stack.modals.forEach((modal) => {
            modal.minimized = modal.id !== id;

            if(type === 'task-detail') {
                if(modal.id === id)
                    modal.props.active = true;
                else if(modal.props.active)
                    modal.props.active = false;
            }

            return modal;
        });

        if(type === 'task-detail')
            scrollToActiveTask(id);
    }

    function minimizeModal(type, id) {
        const stack = modalStack.value.find((stack) => stack.type === type);
        const modal = stack.modals.find((modal) => modal.id === id);

        modal.minimized = true;
        if(type === 'task-detail')
            modal.props.active = false;
    }

    function clearStore() {
        modalStack.value = [
            { type: 'task-detail', modals: [] },
            { type: 'task-create', modals: [] },
            { type: 'task-reply', modals: [] },
            { type: 'help', modals: [] },
            { type: 'task-create-editor', modals: [] },
            { type: 'kanban-reply', modals: [] }
        ];

        openModals.value = [];
    }

    function scrollToActiveTask(id) {
        nextTick(() => {
            const taskEl = document.querySelector(`.task[data-task-id="${ id }"]`);
            if (taskEl) {
                const panelEl = taskEl.closest('.tasks-container');
                if (panelEl) {
                    const dashboardEL = panelEl.closest('.dashboard-area-inner');
                    if (dashboardEL) {
                        dashboardEL.scrollLeft = panelEl.offsetLeft - 10;
                    }
                }
            }
        });
    }

    const openedModalsByType = computed(() => {
        const modalMap = {};
        modalStack.value.forEach((stack) => {
            modalMap[stack.type] = stack.modals;
        });

        return modalMap;
    });

    const openedModalIdsByType = computed(() => {
        const modalMap = {};

        for(const [type, modals] of Object.entries(openedModalsByType.value))
            modalMap[type] = modals.map(modal => modal.id);

        return modalMap;
    })

    return {
        openModal,
        closeModal,
        closeLastOpenedModal,
        minimizeModal,
        maximizeModal,
        clearStore,
        scrollToActiveTask,
        openedModalsByType,
        openedModalIdsByType,
    };
});