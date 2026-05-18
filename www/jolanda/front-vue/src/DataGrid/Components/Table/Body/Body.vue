<script setup>
import { VirtualList } from "vueuc";
import { ref, watch, computed, inject } from "vue";
import { Row as RowObj } from "@/DataGrid/js/Row/Row";
import { createCell } from "@/DataGrid/Components/Table/Body/useCell";
import { createRow } from "@/DataGrid/Components/Table/Body/useRow";
import ContextMenu from "@/DataGrid/Components/Table/ContextMenu/ContextMenu.vue";
import OverflowPreview from "@/DataGrid/Components/Table/OverflowPreview/OverflowPreview.vue";
import { OverflowPreview as OverflowPreviewObj } from "@/DataGrid/js/OverflowPreview/OverflowPreview";

const props = defineProps();
const virtualListRef = ref(null);

const dataGrid = inject("__dataGrid", null);
const theme = inject("__dataGrid_theme", null);

const onScroll = (e) => {
    dataGrid.scroller.onScroll(e);
};

watch(virtualListRef, (value, oldValue) => {
    if (value !== oldValue) {
        dataGrid.scroller.virtualListRef = value;

        if (!oldValue && value && dataGrid.ajax) {
            dataGrid.ajax.reload(null, true);
        }
    }
});

//VirtualList X-Scroll
const cols = computed(() => {
    // if(viewportRows.value && typeof viewportRows.value === "object"){
    //     Object.entries(viewportRows.value).forEach(([index, value]) => {
    //         value._cells = null;
    //     });
    // }
    return dataGrid.columns
        .filter((column) => column.visible)
        .map((column) => {
            return {
                key: column.position,
                width: column.currentWidth,
                column: column,
            };
        })
        .sort((a, b) => a.column.position - b.column.position);
});

let _viewportRows = {};
const viewportRows = computed(() => {
    if (!virtualListRef.value) return {};
    let start = null;

    _viewportRows = virtualListRef.value.viewportItems.reduce((acc, item) => {
        if (!start) {
            start = item;
        }

        acc[item] = _viewportRows[item] ? _viewportRows[item] : new RowObj(dataGrid, item);

        return acc;
    }, {});

    return {
        viewportRows: _viewportRows,
        start: start,
        length: _viewportRows.length,
    };
});

const renderCell = ({ column, item, left }) => {
    if (!column) {
        return;
    }

    const vr = viewportRows.value;
    const row = vr.viewportRows[item];
    const cell = row.getCellByPosition(column.key);
    const i = item - vr.start;
    // const i = item;

    const cellsCache = rowsCache.data[i]?.cells;

    if (cellsCache && cellsCache.hasOwnProperty(column.key)) {
        const renderedCell = cellsCache[column.key];
        // debugger;
        //
        // renderedCell.props.left = left;
        // renderedCell.props.cell = cell;

        renderedCell.props.left = left;
        renderedCell.props.cell = cell;

        return renderedCell.cellComponent();
    }

    const renderedCell = createCell({
        cell: cell,
        left: left,
        overflowPreview: overflowPreview,
    });

    rowsCache.data[i].cells[column.key] = renderedCell;

    return rowsCache.data[i].cells[column.key].cellComponent();
};

//TODO CACHE, teoreticky nemusím řešit indexy řádku ale jen mi stačí to řešit podle viewportRows a sloučit s cells cache
// const rowsCache = reactive({data: {}});
const rowsCache = { data: {} };

if (dataGrid.ajax) {
    // watch(() => dataGrid.ajax._loadedRows, (newVal) => {
    //     Object.entries(rowsCache.data).forEach(([key, value]) => {
    //         if(!newVal.includes(key)){
    //             delete rowsCache.data[key];
    //         }
    //     });
    // });
}

const renderRow = ({ item, cells, index }) => {
    const vr = viewportRows.value;
    const row = vr.viewportRows[item];
    const i = item - vr.start;
    // const i = item;

    if (rowsCache.data.hasOwnProperty(i)) {
        const renderedRow = rowsCache.data[i].renderedRow;

        renderedRow.props.row = row;
        renderedRow.props.cells = cells;
        renderedRow.props.key = index;

        return renderedRow.rowComponent();
    }

    const renderedRow = createRow({
        row: row,
        cells: cells,
        key: index,
        old: theme === "old",
    });

    rowsCache.data[i] = { renderedRow, cells: {} };

    return renderedRow.rowComponent();
};

const overflowPreview = ref(new OverflowPreviewObj());

const data = computed(() => {
    return dataGrid._data;
});

const dataLength = computed(() => {
    return data.value.length;
});
</script>

<template>
    <div
        class="dataGrid-body"
        :class="{
            oldTheme: theme === 'old',
            newTheme: theme === 'new',
            'bg-white dark:bg-dark border-b border-outline dark:border-light/30 pb-1': theme === 'new',
        }"
    >
        <VirtualList :item-size="dataGrid.settings.row.height" :items="data" :on-scroll="onScroll" ref="virtualListRef" :columns="cols" :renderCell="renderCell" :item-as-key="true" :style="{ height: dataGrid.settings.height, maxHeight: dataGrid.settings.height }">
            <template v-slot="{ item, cells, index }">
                <component :is="renderRow({ item: item, cells: cells, index: index })" />
            </template>
        </VirtualList>
        <div v-if="!dataLength" class="empty-table">Tabulka neobsahuje žádná data</div>
        <ContextMenu v-if="dataGrid.contextMenu && dataGrid.contextMenu.visible" :context-menu="dataGrid.contextMenu"></ContextMenu>
        <OverflowPreview v-if="overflowPreview.visible" :overflow-preview="overflowPreview"></OverflowPreview>
    </div>
</template>

<style scoped>
.newTheme {
    &.dataGrid-body {
        border-top: none;
        position: relative;
    }

    :deep(.dataGridRow) {
        --rowColor: #0000;
        position: relative;
        font-size: 0.846rem;
        font-weight: 500;
        border-radius: 4px;

        &.odd {
            background: #ecf2ff;
        }

        &.even {
            background: none;
        }

        &.selected {
            background-color: color-mix(in srgb, var(--color-primary-200) 80%, transparent) !important;
        }

        &:hover {
            background-color: color-mix(in srgb, var(--color-primary-200) 40%, transparent) !important;
        }

        &:after {
            position: absolute;
            left: 0;
            content: "";
            background: var(--rowColor, #0000);
            height: 33px;
            width: 5px;
        }
    }

    :deep(.dataGridCell) {
        position: absolute;
        top: 0;
        bottom: 0;
        border-right: 1px dashed var(--color-outline);
        max-height: 100%;
        min-height: 100%;
        height: 100%;
        overflow: hidden;
    }

    :deep(.dataGridCell .dataGridCell-dataWrapper) {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 100%;
        max-height: 100%;
        min-height: 100%;
        padding: 4px 6px;
        display: flex;
        align-items: center;
    }

    :deep(.dataGridCell .dataGridCell-cellWrapper) {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }

    :deep(.dataGridCell .dataGridCell-cellWrapper .dataGridCell-dataWrapper) {
        padding-right: 24px;
    }

    :deep(.dataGridCell .dataGridCell-editIcon) {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.32;
        width: 12px;
        height: 21px;

        &:hover {
            cursor: pointer;
            opacity: 1;
        }
    }

    :deep(.dataGridCell .dataGridCell-editIconWrapper) {
        width: 34px;
        min-width: 34px;
    }

    :deep(.dataGridCell.editable .dataGridCell-dataWrapper) {
        padding-right: 20px;
    }

    :deep(.dataGridCell.isCopied::after) {
        content: "";
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid green;
        opacity: 1;
        pointer-events: none;
    }

    @keyframes pulse-gradient {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    :deep(.dataGridCell.dataGridPlaceholderWrapper) {
        padding: 4px 6px;
    }

    :deep(.dataGridCell .dataGridPlaceholder) {
        width: 100%;
        height: 14px;
        background: linear-gradient(90deg, #0001 33%, #0010 50%, #0001 66%) #dde1e8;
        background-size: 300% 100%;
        animation: l1 0.9s infinite linear;
        margin-top: 5px;
        border-radius: 7px;
    }

    @keyframes l1 {
        0% {
            background-position: right;
        }
    }

    :deep(.dataGridCell .btn-icon) {
        transform: scale(0.7);
        margin: -9px 0 -9px -9px;
    }

    :deep(.dataGridCell.select-checkbox:before) {
        content: " ";
        position: absolute;
        height: 14px;
        width: 14px;
        background: transparent linear-gradient(180deg, #fff 0, #fff 74%, #f9fafb 100%) 0 0 no-repeat padding-box;
        border: 1px solid #c4cdd5;
        border-radius: 2px;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        display: block;
        box-sizing: border-box;
    }

    :deep(.dataGridCell.select-checkbox:after) {
        content: "";
        position: absolute;
        width: 5px;
        height: 8px;
        border-color: var(--color-primary);
        border-style: solid;
        border-width: 0 2px 2px 0;
        transform: translateY(-50%) translateX(-50%) rotate(45deg);
        left: 50%;
        top: 50%;
        margin: 0;
        opacity: 0;
        display: block;
        box-sizing: border-box;
    }

    :deep(.dataGridRow.selected .dataGridCell.select-checkbox:after) {
        opacity: 1;
        text-align: center;
        text-shadow:
            1px 1px #b0bed9,
            -1px -1px #b0bed9,
            1px -1px #b0bed9,
            -1px 1px #b0bed9;
    }

    .empty-table {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 16px;
        opacity: 0.45;
        pointer-events: none;
    }
}

.oldTheme {
    &.dataGrid-body {
        background: #fff;
        border: 1px solid #eee;
        border-top: none;
        position: relative;
    }

    :deep(.dataGridRow) {
        --rowColor: #0000;
        position: relative;
        font-size: 14px;
        font-weight: 300;
        border-bottom: 1px solid rgb(239, 239, 239);

        &.odd {
            background: rgb(249, 250, 252);
        }

        &.even {
            background: none;
        }

        &.selected {
            background-color: rgba(36, 197, 134, 0.22) !important;
        }

        &:hover {
            background-color: rgba(102, 175, 97, 0.1) !important;
        }

        &.customColor {
            &::after {
                background: var(--rowColor, #0000);
            }
        }

        &:after {
            position: absolute;
            left: 0;
            content: "";
            background: transparent;
            height: 33px;
            width: 5px;
        }
    }

    :deep(.dataGridCell) {
        position: absolute;
        top: 0;
        bottom: 0;
        border-right: 1px dashed rgba(188, 188, 188, 0.4);
        max-height: 100%;
        min-height: 100%;
        height: 100%;
        overflow: hidden;
    }

    :deep(.dataGridCell .dataGridCell-dataWrapper) {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 100%;
        max-height: 100%;
        min-height: 100%;
        padding: 4px 6px;
    }

    :deep(.dataGridCell .dataGridCell-editIcon) {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.32;
        width: 14px;
        height: 21px;

        &:hover {
            cursor: pointer;
            opacity: 1;
        }
    }

    :deep(.dataGridCell .dataGridCell-editIcon::after) {
        content: "\f119";
        font-family: cdbicons;
        font-weight: 400;
        font-size: 14px;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);

        &:hover {
            cursor: pointer;
        }
    }

    :deep(.dataGridCell.editable .dataGridCell-dataWrapper) {
        padding-right: 20px;
    }

    :deep(.dataGridCell.isCopied::after) {
        content: "";
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid green;
        opacity: 1;
        pointer-events: none;
    }

    /* Přizpůsobení scrollbar */
    :deep(.v-vl--show-scrollbar::-webkit-scrollbar) {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background: #fff;
    }

    :deep(.v-vl--show-scrollbar::-webkit-scrollbar-thumb) {
        background: #515c6f;
        border-radius: 5px;
    }

    :deep(.v-vl--show-scrollbar::-webkit-scrollbar-corner) {
        background: #fff;
    }

    @keyframes pulse-gradient {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    :deep(.dataGridCell.dataGridPlaceholderWrapper) {
        padding: 4px 6px;
    }

    :deep(.dataGridCell .dataGridPlaceholder) {
        width: 100%;
        height: 14px;
        background: linear-gradient(90deg, #0001 33%, #0010 50%, #0001 66%) #dde1e8;
        background-size: 300% 100%;
        animation: l1 0.9s infinite linear;
        margin-top: 5px;
        border-radius: 7px;
    }

    @keyframes l1 {
        0% {
            background-position: right;
        }
    }

    :deep(.dataGridCell .btn-icon) {
        transform: scale(0.7);
        margin: -9px 0 -9px -9px;
    }

    :deep(.dataGridCell.select-checkbox:before) {
        content: " ";
        position: absolute;
        height: 14px;
        width: 14px;
        background: transparent linear-gradient(180deg, #fff 0, #fff 74%, #f9fafb 100%) 0 0 no-repeat padding-box;
        border: 1px solid #c4cdd5;
        border-radius: 2px;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        display: block;
        box-sizing: border-box;
    }

    :deep(.dataGridCell.select-checkbox:after) {
        content: "";
        position: absolute;
        width: 5px;
        height: 8px;
        border-color: #2be175;
        border-style: solid;
        border-width: 0 2px 2px 0;
        transform: translateY(-50%) translateX(-50%) rotate(45deg);
        left: 50%;
        top: 50%;
        margin: 0;
        opacity: 0;
        display: block;
        box-sizing: border-box;
    }

    :deep(.dataGridRow.selected .dataGridCell.select-checkbox:after) {
        opacity: 1;
        text-align: center;
        text-shadow:
            1px 1px #b0bed9,
            -1px -1px #b0bed9,
            1px -1px #b0bed9,
            -1px 1px #b0bed9;
    }

    .empty-table {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 16px;
        opacity: 0.45;
        pointer-events: none;
    }
}

:deep(.v-vl .v-vl-items) {
    min-width: 100%;
}

:deep(.v-vl) {
    outline: none !important;
}
</style>

<!--TMP DARK MODE řešení-->
<style>
.dark-theme {
    .grid-vue {
        .newTheme {
            &.dataGrid-body {
                .dataGridRow {
                    &.odd {
                        background: var(--color-nav) !important;
                    }

                    &.selected {
                        background-color: color-mix(in srgb, var(--color-primary-500) 40%, transparent) !important;
                    }

                    &:hover {
                        background-color: color-mix(in srgb, var(--color-primary-500) 20%, transparent) !important;
                    }

                    .dataGridCell {
                        border-color: color-mix(in srgb, var(--color-light) 30%, transparent);
                    }
                }
            }
        }
    }
}

html.prefer-dark .grid-vue {
    .oldTheme {
        &.dataGrid-body {
            background-color: #202124;
            border-color: rgba(255, 240, 240, 0.2196078431);

            .dataGridRow {
                border-color: rgba(255, 240, 240, 0.2196078431);

                &.odd {
                    background: rgba(249, 250, 252, 0.0509803922);
                }

                &.even {
                    background: none;
                }

                &.selected {
                    background-color: rgba(26, 177, 86, 0.35) !important;
                }

                &:hover {
                    background-color: rgba(102, 175, 97, 0.1) !important;
                }

                .dataGridCell {
                    border-color: rgba(255, 240, 240, 0.2196078431);

                    .dataGridPlaceholder {
                        background: linear-gradient(90deg, #0001 33%, rgba(255, 255, 255, 0) 50%, #0001 66%) #47474a;
                        background-size: 300% 100%;
                    }
                }
            }

            .v-vl--show-scrollbar::-webkit-scrollbar {
                background-color: #202124;
            }

            .v-vl--show-scrollbar::-webkit-scrollbar-thumb {
                background-color: #19b053;
            }

            .v-vl--show-scrollbar::-webkit-scrollbar-corner {
                background-color: #202124;
            }
        }
    }
}
</style>
