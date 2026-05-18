<script setup>
import { ref, onMounted, provide } from 'vue';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

const props = defineProps({
    options: { type: Object, default: () => ({}) },
});

const gridRef = ref(null);
let grid;

onMounted(() => {
    grid = GridStack.init({
        cellHeight: 80,
        acceptWidgets: true,
        float: false,
        ...props.options
    }, gridRef.value);
});

// Přidání widgetu
function addWidget(el, options = {}) {
    grid.addWidget(el, options);
}

// Odebrání widgetu
function removeWidget(el, removeDOM = true) {
    grid.removeWidget(el, removeDOM);
}

// Vymazání celého gridu
function removeAll() {
    grid.removeAll();
}

// Vrací aktuální layout gridu
function getLayout() {
    return grid.save();
}

// Načtení layoutu
function loadLayout(layout) {
    grid.load(layout);
}

// Exponování metod a instance do parent komponenty
defineExpose({
    getGrid: () => grid,
    addWidget,
    removeWidget,
    removeAll,
    getLayout,
    loadLayout,
});

provide('gridStack', {
    getGrid: () => grid,
    addWidget,
    removeWidget,
    removeAll,
    getLayout,
    loadLayout,
});
</script>

<template>
    <div class="grid-stack" ref="gridRef">
        <slot v-if="$slots.default !== null" />
        <div v-else class="grid-stack-item-content"></div>
    </div>
</template>