<script setup>
import { inject, nextTick, onMounted, onUnmounted, ref, toRef, useId, watch, provide, computed } from "vue";
import GridStackComponent from "@/Components/Other/GridStack/GridStack.vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: undefined,
    },
    iconPath: {
        type: String,
        default: undefined,
    }
});

const id = useId();
const registerTab = inject("registerTab", null);
const unregisterTab = inject("unregisterTab", null);
const activeTab = inject("activeTab", null);
const editor = inject("editor", null);
const reactiveTitle = toRef(props, "title");
const grid = ref(null);

const registerGrid = (gridToRegister) => {
    if (!grid.value && editor) {
        grid.value = gridToRegister;
    }
};

const unregisterGrid = (id) => {
    if (grid.value && grid.value.id === id) {
        grid.value = null;
    }
};

provide("tab-registerGrid", registerGrid);
provide("tab-unregisterGrid", unregisterGrid);
const inputs = ref({});
provide("tab-inputs", inputs);
const formErrors = inject("form-errors", null);

const tabInputsErrors = computed(() => {
    const inputKeys = Object.keys(inputs.value);
    return formErrors.value.filter((error) => inputKeys.includes(error.path));
});

const gridStack = ref(null);

onMounted(() => {
    if (registerTab) {
        registerTab(id, reactiveTitle, grid, tabInputsErrors, props.icon, props.iconPath);
    }
});

onUnmounted(() => {
    if (unregisterTab) {
        unregisterTab(id);
    }
});

// watch(tabInputsErrors, (newVal) => {});

watch(
    () => activeTab.value,
    async (newValue) => {
        if (gridStack.value?.getGrid() && activeTab.value === id) {
            await nextTick();
            gridStack.value.getGrid().engine.nodes.forEach((node) => {
                gridStack.value.getGrid().resizeToContent(node.el);
            });
        }
    },
);
</script>

<template>
    <section :id="id" class="editor-tab" v-show="activeTab === id">
        <GridStackComponent
            ref="gridStack"
            v-if="editor && editor.dashboard"
            :options="{
                animate: false,
                float: false,
                cellHeight: 20,
                minRow: 1,
                resizable: { handles: 'e,w' },
                disableDrag: false,
                sizeToContent: true,
                acceptWidgets: false,
                column: 4,
                draggable: {
                    handle: '.dashboard-moveable',
                },
                columnOpts: {
                    breakpoints: [
                        { w: 700, c: 1 },
                        { w: 850, c: 4 },
                        { w: 950, c: 4 },
                        { w: 1100, c: 4 },
                    ],
                },
            }"
        >
            <slot />
        </GridStackComponent>
        <slot v-else />
        <!--        <h2>{{ title }}</h2>-->
    </section>
</template>
