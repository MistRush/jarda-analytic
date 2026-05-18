<script setup>
import { inject, ref, watch } from "vue";
import GridStackItem from "@/Components/Other/GridStack/GridStackItem.vue";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    title: {
        type: String,
        default: null,
    },
    collapsible: {
        type: Boolean,
        default: false,
    },
    collapsed: {
        type: Boolean,
        default: false,
    },
    row: {
        type: Boolean,
        default: false,
    },
    container: {
        type: Boolean,
        default: false,
    },
    grid: {
        type: Boolean,
        default: false,
    },
    gridCols: {
        type: Number,
        default: 1,
    },
    help: String,
});

const emit = defineEmits(["collapse"]);

const isCollapsed = ref(props.collapsed);

const gridStack = inject("gridStack", null);
const editor = inject("editor", null);
const isInSideGrid = ref(false);

const toggleCollapse = () => {
    if (props.collapsible) {
        isCollapsed.value = !isCollapsed.value;
    }
};

watch(
    () => isCollapsed.value,
    (newVal) => {
        emit("collapse", newVal);
    },
);

watch(
    () => props.collapsed,
    (newVal) => {
        isCollapsed.value = newVal;
    },
);

function moveToSideGrid(e) {
    if (!editor.sideGridStack?.value?.getGrid() || !gridStack?.getGrid()) {
        return;
    }

    if (!isInSideGrid.value) {
        const widgetEl = e.target.closest(".grid-stack-item");
        const widgetData = gridStack.getGrid().removeWidget(widgetEl, false);

        editor.sideGridStack.value.getGrid().el.appendChild(widgetEl);
        editor.sideGridStack.value.getGrid().makeWidget(widgetEl, { w: 12 });
        isInSideGrid.value = true;
    } else {
        const widgetEl = e.target.closest(".grid-stack-item");
        const widgetData = editor.sideGridStack.value.getGrid().removeWidget(widgetEl, false);

        gridStack.getGrid().el.appendChild(widgetEl);
        gridStack.getGrid().makeWidget(widgetEl, { w: 12 });
        isInSideGrid.value = false;
    }

    // editor.sideGridStack.value.getGrid().addWidget(widget);

    // const widget = grid.makeWidget(widgetEl);
    // editor.sideGridStack.value.getGrid().addWidget(widgetEl, widgetData);
}
</script>

<template>
    <GridStackItem gs-max-gw="4" v-if="editor && editor.dashboard">
        <div class="editor-subsection dark:bg-dark! border-1 border-outline dark:border-dark" :class="{ collapsible, collapsed: isCollapsed }">
            <div
                @click="toggleCollapse"
                v-if="title || collapsible"
                class="header"
                :class="{
                    'border-b border-outline dark:border-medium': !isCollapsed,
                }"
            >
                <div>
                    <h5 v-if="title && !$slots.title" class="font-semibold text-[1.077rem]">
                        {{ title }}
                        <Help v-if="help" :help="help" />
                    </h5>
                    <template v-else-if="$slots.title">
                        <slot name="title"></slot>
                        <Help v-if="help" :help="help" />
                    </template>
                </div>
                <div>
                    <Icon icon="arrow" color="gray" :direction="isCollapsed ? 'bottom' : 'top'" v-if="collapsible" />
                </div>
            </div>
            <div v-show="!isCollapsed || !collapsible" class="content" :class="{ row: props.row, '@container': props.container, grid: props.grid, ['grid-cols-' + props.gridCols]: props.grid, 'gap-4': props.grid }">
                <div @click="moveToSideGrid" class="absolute top-2 right-1 hover:cursor-pointer text-light hover:text-medium">
                    <Icon icon="pin" class="w-[14px]" />
                </div>
                <div class="absolute top-2 right-6 hover:cursor-pointer text-light hover:text-medium dashboard-moveable">
                    <Icon icon="move" class="w-[14px]" />
                </div>
                <slot></slot>
            </div>
        </div>
    </GridStackItem>
    <div v-else class="editor-subsection dark:bg-dark! border-1 border-outline dark:border-dark" :class="{ collapsible, collapsed: isCollapsed }">
        <div
            @click="toggleCollapse"
            v-if="title || collapsible"
            class="header"
            :class="{
                'border-b border-outline dark:border-medium': !isCollapsed,
            }"
        >
            <div>
                <h5 v-if="title && !$slots.title" class="font-semibold text-[1.077rem]">
                    {{ title }}
                </h5>
                <template v-else-if="$slots.title">
                    <slot name="title"></slot>
                </template>
            </div>
            <div>
                <Icon icon="arrow" color="gray" :direction="isCollapsed ? 'bottom' : 'top'" v-if="collapsible" />
            </div>
        </div>
        <div v-show="!isCollapsed || !collapsible" class="content" :class="{ row: props.row, '@container': props.container, grid: props.grid, ['grid-cols-' + props.gridCols]: props.grid, 'gap-4': props.grid }">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.editor-subsection {
    margin-bottom: 1.5rem;
    border-radius: 6px;
    background: rgba(236, 242, 255, 0.5);
}

.grid-stack-item-content {
    margin-bottom: 1.5rem;
}

.content {
    padding: 11px 15px;
}

.header {
    padding: 11px 15px 11px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.editor-subsection.collapsible .header {
    cursor: pointer;
}
</style>
