<script setup>
import { DataGrid } from "@/DataGrid/js/DataGrid";
import { computed, ref, onMounted, onUnmounted, watch, inject } from "vue";
import Tooltip from "@/Components/Other/Tooltip.vue";
import draggable from "vuedraggable";

const props = defineProps();

const dataGrid = inject("__dataGrid", null);
const theme = inject("__dataGrid_theme", null);

const handleClick = (column) => {
    if (isResizing.value) {
        return;
    }

    if (!column.orderable) {
        return;
    }

    if (!column.order) {
        column.order = "desc";
    } else {
        if (column.order === DataGrid.ORDER_DESC) {
            column.order = "asc";
        } else {
            column.order = "desc";
        }
    }

    if (column.dataGrid.ajax) {
        column.dataGrid.ajax.reload(null, true);
    }
};

const indexes = computed(() => {
    const result = {};

    dataGrid.columns.forEach((column, index) => {
        result[column.position] = index;
    });

    return result;
});

let oldVisibleColumns = [];
const visibleColumns = computed(() => {
    if (physicalMovingIndex.value === null) {
        const result = [];

        const list = indexes.value;
        if (!indexes.value) {
            return [];
        }

        Object.entries(list).forEach((item) => {
            const col = dataGrid.columns[item[1]];

            if (col.visible) {
                result.push(col);
            }
        });

        oldVisibleColumns = result;
        return result;
    } else {
        return oldVisibleColumns;
    }
});

const isResizing = ref(false);
const startX = ref(0);
const currentColumn = ref(null);

const handleMouseDown = (event, column) => {
    event.preventDefault();
    isResizing.value = true;
    startX.value = event.clientX;
    currentColumn.value = column;
};

const handleMouseMove = (event) => {
    if (!isResizing.value || !currentColumn.value) {
        return;
    }

    const delta = event.clientX - startX.value;
    currentColumn.value.width = Math.max(currentColumn.value.currentWidth + delta);
    startX.value = event.clientX;
};

const handleMouseUp = () => {
    setTimeout(() => {
        const oldIsResizing = isResizing.value;

        isResizing.value = false;
        currentColumn.value = null;

        if (oldIsResizing === true) {
            dataGrid.presetManager?.triggerSave();
        }
    }, 0);
};

onMounted(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
});

onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
});

const resizeHandleHover = ref(false);
const resizeHandleCurrentColumn = ref(null);

const onMoveCol = (draggable, event) => {
    const cols = [...visibleColumns.value].sort((a, b) => {
        return a["position"] - b["position"];
    });
    let column = visibleColumns.value[draggable.draggedContext.index];

    if (column.className && column.className.includes("select-checkbox")) {
        return false;
    }

    if (column.data === "Action") {
        return false;
    }

    const futureIndex = draggable.draggedContext.futureIndex > draggable.draggedContext.index ? (draggable.willInsertAfter ? draggable.draggedContext.futureIndex : draggable.draggedContext.futureIndex - 1) : draggable.willInsertAfter ? draggable.draggedContext.futureIndex + 1 : draggable.draggedContext.futureIndex;

    if (cols.length > 0 && ((cols[cols.length - 1].data === "Action" && futureIndex === cols.length - 1) || (cols[0].className?.includes("select-checkbox") && futureIndex === 0))) {
        return false;
    }

    column.position = cols[futureIndex].position;
};

const physicalMovingIndex = ref(null);
const start = (event) => {
    physicalMovingIndex.value = event.oldIndex;
};

const end = (event) => {
    physicalMovingIndex.value = null;

    dataGrid.presetManager?.triggerSave();
};

const isAllRowsSelected = ref(false);

watch(
    () => dataGrid.rows({ selected: true }).count(),
    (newSelectedRows) => {
        isAllRowsSelected.value = dataGrid.rows().count() > 0 && dataGrid.rows().count() === newSelectedRows;
    },
    // { immediate: true, deep: true }, // Volitelné možnosti
);
</script>

<template>
    <!--    TODO hlavička ať může mít offsetzprava, u starých není až dokonce ale je tam offset, proč?-->
    <div
        class="header-wrapper"
        :class="{
            oldTheme: theme === 'old',
            newTheme: theme === 'new',
            'bg-white text-medium dark:bg-dark dark:text-light border-b border-outline dark:border-light/30': theme === 'new',
        }"
    >
        <div class="relative dataGrid-headRow items-center">
            <draggable :list="visibleColumns" tag="div" item-key="id" style="display: flex" :move="onMoveCol" @start="start" @end="end">
                <template #item="{ element: column, index }">
                    <Tooltip @click="handleClick(column)" :class="{ sorting_asc: column.order === DataGrid.ORDER_ASC, sorting_desc: column.order === DataGrid.ORDER_DESC, sorting: column.order }" class="dataGrid-headCol" :style="{ maxWidth: column.currentWidth + 'px', width: column.currentWidth + 'px' }" :text="column.labelTooltip || (column.label && typeof column.label === 'string' ? column.label : '')" preferred-position="above" :key="index">
                        <div
                            v-if="index > 0"
                            class="resize-handle before"
                            @mousedown="handleMouseDown($event, visibleColumns[index - 1])"
                            :class="{
                                active: isResizing ? currentColumn === visibleColumns[index - 1] : resizeHandleHover && resizeHandleCurrentColumn === visibleColumns[index - 1],
                                [column.className]: true,
                            }"
                            @mouseover="
                                resizeHandleHover = true;
                                resizeHandleCurrentColumn = visibleColumns[index - 1];
                            "
                            @mouseleave="
                                resizeHandleHover = false;
                                resizeHandleCurrentColumn = null;
                            "
                        ></div>
                        <template v-if="column.className && column.className.includes('select-checkbox')">
                            <input type="checkbox" @click="dataGrid.toogleSelectAllRows()" class="select-all-checkbox" :checked="isAllRowsSelected" />
                        </template>
                        <template v-else>
                            <template v-if="typeof column.label === 'function'">
                                <component :is="column.label" />
                            </template>
                            <template v-else>
                                {{ column.label ?? "" }}
                            </template>
                        </template>
                        <div
                            class="resize-handle after"
                            @mousedown="handleMouseDown($event, column)"
                            :class="{ active: isResizing ? currentColumn === column : resizeHandleHover && resizeHandleCurrentColumn === column }"
                            @mouseover="
                                resizeHandleHover = true;
                                resizeHandleCurrentColumn = column;
                            "
                            @mouseleave="
                                resizeHandleHover = false;
                                resizeHandleCurrentColumn = null;
                            "
                        ></div>
                    </Tooltip>
                </template>
            </draggable>
            <div class="padding-fix" :style="{ maxWidth: '19px', width: '19px' }"></div>
        </div>
    </div>
</template>

<style scoped>
.newTheme {
    &.header-wrapper {
        overflow: hidden;
        border-radius: 6px 6px 0 0;
        background-color: #152234;
    }

    .dataGrid-headRow {
        width: 100%;
        display: flex;
        border-spacing: 0;
        border-collapse: separate !important;
        background-color: #152234;

        .padding-fix {
            flex: none;
            height: 31px;
            min-height: 31px;
            max-height: 31px;
            max-width: 19px;
            width: 19px;
        }

        .dataGrid-headCol {
            flex: none;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            padding: 0.4rem;
            padding-right: 30px;
            background-color: #152234;
            background-size: 1px;
            background-position: 100%;
            background-repeat: repeat-y;
            font-size: 0.846rem;
            font-weight: 500;
            box-sizing: border-box;
            height: 30px;
            min-height: 30px;
            max-height: 30px;
            color: white;
            display: flex;
            align-items: center;

            &:hover {
                cursor: pointer;
            }

            &.sorting {
                &.sorting_desc {
                    &:after {
                        content: "↓";
                        display: block;
                        opacity: 1;
                        top: 6px;
                        right: 5px;
                        font-family: "Font Awesome 5 Free" !important;
                        position: absolute;
                        bottom: 0.9em;
                        font-weight: 600;
                    }
                }

                &.sorting_asc {
                    &:after {
                        content: "↑";
                        display: block;
                        opacity: 1;
                        top: 6px;
                        right: 5px;
                        font-family: "Font Awesome 5 Free" !important;
                        position: absolute;
                        bottom: 0.9em;
                        font-weight: 600;
                    }
                }
            }

            .resize-handle {
                position: absolute;
                height: 100%;
                cursor: col-resize;
                background: none;

                &.active {
                    background: #bbc7d9;
                }

                &.before {
                    top: 0;
                    left: 0;
                    width: 2px;
                }

                &.after {
                    top: 0;
                    right: 0;
                    width: 3px;
                }
            }
        }
    }
}

.oldTheme {
    &.header-wrapper {
        overflow: hidden;
        background: transparent linear-gradient(#3a414d 0, #4a5464 100%) 0 0 no-repeat padding-box;

        table {
            width: 100%;
            table-layout: fixed;
            border-spacing: 0;
            border-collapse: separate !important;
            color: #1c293b;

            th {
                width: 110px;
                position: relative;
                overflow: hidden;
                box-sizing: content-box;
                max-height: 24px;
                white-space: nowrap;
                padding: 0.4rem;
                padding-right: 30px;
                color: #bbc7d9;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGMGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTI4VDA4OjIwOjI1KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0yOFQwODoyMDo1OSswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0yOFQwODoyMDo1OSswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzIzYjExMWUtYmQxNC1jYTQ3LWFlNjItNzQxZGNhYTkwYWY4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTEwYmRlODgtYmM2ZS0zZjQ1LTkzYTEtYmQzOWJmNzViYjY1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTc3ZjU0YzgtNWQ4Ni04NDQwLWFlM2MtNTc3NTZiOWZhNGJkIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNzdmNTRjOC01ZDg2LTg0NDAtYWUzYy01Nzc1NmI5ZmE0YmQiIHN0RXZ0OndoZW49IjIwMjAtMDctMjhUMDg6MjA6MjUrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MjNiMTExZS1iZDE0LWNhNDctYWU2Mi03NDFkY2FhOTBhZjgiIHN0RXZ0OndoZW49IjIwMjAtMDctMjhUMDg6MjA6NTkrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5vbjFqAAAADUlEQVQIHWPYs2dPGgAHBwKbeQk55AAAAABJRU5ErkJggg==);
                background-size: 1px;
                background-position: 1px;
                background-repeat: repeat-y;
                font-size: 12px;
                font-weight: 400;

                &:hover {
                    cursor: pointer;
                }

                &.sorting {
                    &.sorting_desc {
                        &:after {
                            content: "\f107";
                            display: block;
                            opacity: 1;
                            top: 6px;
                            right: 5px;
                            font-family: "Font Awesome 5 Free" !important;
                            position: absolute;
                            bottom: 0.9em;
                            font-weight: 600;
                        }
                    }

                    &.sorting_asc {
                        &:after {
                            content: "\f106";
                            display: block;
                            opacity: 1;
                            top: 6px;
                            right: 5px;
                            font-family: "Font Awesome 5 Free" !important;
                            position: absolute;
                            bottom: 0.9em;
                            font-weight: 600;
                        }
                    }
                }
            }
        }
    }

    &.header-wrapper {
        overflow: hidden;
        background: transparent linear-gradient(#3a414d 0, #4a5464 100%) 0 0 no-repeat padding-box;

        .dataGrid-headRow {
            width: 100%;
            display: flex;
            border-spacing: 0;
            border-collapse: separate !important;
            color: #1c293b;
            background: transparent linear-gradient(#3a414d 0, #4a5464 100%) 0 0 no-repeat padding-box;

            .padding-fix {
                flex: none;
                height: 31px;
                min-height: 31px;
                max-height: 31px;
                max-width: 19px;
                width: 19px;
            }

            .dataGrid-headCol {
                flex: none;
                position: relative;
                overflow: hidden;
                white-space: nowrap;
                padding: 0.4rem;
                padding-right: 30px;
                color: #bbc7d9;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGMGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTI4VDA4OjIwOjI1KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0yOFQwODoyMDo1OSswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0yOFQwODoyMDo1OSswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzIzYjExMWUtYmQxNC1jYTQ3LWFlNjItNzQxZGNhYTkwYWY4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTEwYmRlODgtYmM2ZS0zZjQ1LTkzYTEtYmQzOWJmNzViYjY1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTc3ZjU0YzgtNWQ4Ni04NDQwLWFlM2MtNTc3NTZiOWZhNGJkIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNzdmNTRjOC01ZDg2LTg0NDAtYWUzYy01Nzc1NmI5ZmE0YmQiIHN0RXZ0OndoZW49IjIwMjAtMDctMjhUMDg6MjA6MjUrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MjNiMTExZS1iZDE0LWNhNDctYWU2Mi03NDFkY2FhOTBhZjgiIHN0RXZ0OndoZW49IjIwMjAtMDctMjhUMDg6MjA6NTkrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5vbjFqAAAADUlEQVQIHWPYs2dPGgAHBwKbeQk55AAAAABJRU5ErkJggg==);
                background-size: 1px;
                background-position: 100%;
                background-repeat: repeat-y;
                font-size: 12px;
                font-weight: 400;
                box-sizing: border-box;
                height: 31px;
                min-height: 31px;
                max-height: 31px;

                &:hover {
                    cursor: pointer;
                }

                &.sorting {
                    &.sorting_desc {
                        &:after {
                            content: "\f107";
                            display: block;
                            opacity: 1;
                            top: 6px;
                            right: 5px;
                            font-family: "Font Awesome 5 Free" !important;
                            position: absolute;
                            bottom: 0.9em;
                            font-weight: 600;
                        }
                    }

                    &.sorting_asc {
                        &:after {
                            content: "\f106";
                            display: block;
                            opacity: 1;
                            top: 6px;
                            right: 5px;
                            font-family: "Font Awesome 5 Free" !important;
                            position: absolute;
                            bottom: 0.9em;
                            font-weight: 600;
                        }
                    }
                }

                .resize-handle {
                    position: absolute;
                    height: 100%;
                    cursor: col-resize;
                    background: none;

                    &.active {
                        background: #bbc7d9;
                    }

                    &.before {
                        top: 0;
                        left: 0;
                        width: 2px;
                    }

                    &.after {
                        top: 0;
                        right: 0;
                        width: 3px;
                    }
                }
            }
        }
    }

    .select-all-checkbox {
        appearance: none;
        -webkit-appearance: none; /* Pro Safari */
        width: 16px;
        height: 16px;
        position: relative;
        cursor: pointer;
        border: none;
        background: transparent;
    }

    /* Vzhled obdélníku checkboxu */
    .select-all-checkbox::before {
        content: " ";
        position: absolute;
        height: 14px;
        width: 14px;
        background: transparent linear-gradient(180deg, #fff 0%, #fff 74%, #f9fafb 100%) 0 0 no-repeat padding-box;
        border: 1px solid #c4cdd5;
        border-radius: 2px;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        display: block;
        box-sizing: border-box;
    }

    /* Vzhled fajfky */
    .select-all-checkbox::after {
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
        opacity: 0;
        display: block;
        box-sizing: border-box;
    }

    /* Zobrazení fajfky při zaškrtnutí checkboxu */
    .select-all-checkbox:checked::after {
        opacity: 1;
    }
}
</style>
