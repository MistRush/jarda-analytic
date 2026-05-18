<script setup>
import {computed, nextTick, onMounted, ref, onBeforeUpdate} from 'vue';
import moment from 'moment';

import Tooltip from '@/Components/Other/Tooltip.vue';

const props = defineProps({
        items: Array,
        height: {
            type: Number,
            default: 400,
        },
        useGroups: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(['update-item'])

    const daysVisible = ref(30);
    const cellWidth = ref(0);
    const chartEl = ref(null);
    const currentDayLineEl = ref(null);
    const headerCellEls = ref(null);
    const currentStartDate = ref(moment().subtract(Math.round(daysVisible.value / 2) - 1, 'days'));

    const gridStyle = computed(() => ({
        gridTemplateColumns: `repeat(${ daysVisible.value }, 1fr)`,
    }));

    const visibleDates = computed(() => {
        const dates = [];
        const start = currentStartDate.value.clone();
        for (let i = 0; i < daysVisible.value; i++)
            dates.push(start.clone().add(i, 'days'));

        return dates;
    })

    const previewItems = ref([]);
    const mergedItems = computed(() => {
        const overrides = new Map(previewItems.value.map(item => [item.id, item]));
        return props.items.map(item => overrides.get(item.id) || item);
    });

    const visibleItems = computed(() => {
        const rangeStart = currentStartDate.value.clone();
        const rangeEnd = currentStartDate.value.clone().add(daysVisible.value, 'days');

        const visibleItems = mergedItems.value.filter(item => {
            const start = moment(item.dateFrom);
            const end = moment(item.dateTo);

            return end.isSameOrAfter(rangeStart, 'day') && start.isBefore(rangeEnd, 'day');
        });

        const idToItem = new Map();
        for (const item of visibleItems)
            idToItem.set(item.id, item);

        const graph = new Map();
        const inDegree = new Map();
        for (const item of visibleItems) {
            graph.set(item.id, []);
            inDegree.set(item.id, 0);
        }

        for (const item of visibleItems) {
            if (item.requirements) {
                for (const depId of item.requirements) {
                    if (idToItem.has(depId)) {
                        graph.get(depId).push(item.id);
                        inDegree.set(item.id, inDegree.get(item.id) + 1);
                    }
                }
            }
        }

        const queue = [];
        for (const [id, degree] of inDegree.entries()) {
            if (degree === 0)
                queue.push(id);
        }

        const sortedIds = [];
        const visited = new Set();

        while (sortedIds.length < visibleItems.length) {
            if (queue.length === 0) {
                for (const [id] of idToItem) {
                    if (!visited.has(id)) {
                        queue.push(id);
                        break;
                    }
                }
            }

            const id = queue.shift();
            if (visited.has(id))
                continue;

            visited.add(id);
            sortedIds.push(id);

            for (const neighbor of graph.get(id)) {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0)
                    queue.push(neighbor);
            }
        }

        return sortedIds.map(id => idToItem.get(id));
    });

    const groupedRowsMap = computed(() => {
        const groupMap = new Map();
        const visibleItemsIds = visibleItems.value.map(item => item.id);

        const groups = [];
        for (const item of mergedItems.value) {
            const groupKey = props.useGroups ? ((item.group instanceof Object ? item.group?.id : item.group) || item.id) : item.id;
            if (!groups.find(g => g.id === groupKey)) {
                groups.push({
                    id: groupKey,
                    name: item.group instanceof Object ? item.group?.name : item.group,
                });
            }

            if (!groupMap.has(groupKey))
                groupMap.set(groupKey, []);

            if(visibleItemsIds.includes(item.id)) {
                const groupRows = groupMap.get(groupKey);
                groupRows.push(item);
            }
        }

        for(const [groupKey, groupItems] of groupMap) {
            if(groupItems.length === 0) {
                groupMap.delete(groupKey);

                const groupIndex = groups.findIndex(g => g.id === groupKey);
                if(groupIndex !== -1)
                    groups.splice(groupIndex, 1);
            }
        }

        return {
            rows: groupMap,
            groups: groups
        };
    });

    onMounted(() => {
       if(chartEl.value) {
           chartEl.value.addEventListener('wheel', function(event) {
               if(event.shiftKey === true) {
                   event.preventDefault();
                   const delta = event.deltaY || event.detail || event.wheelDelta
                   if(delta > 0)
                       daysVisible.value = Math.min(90, daysVisible.value + 1)
                   else daysVisible.value = Math.max(5, daysVisible.value - 1)

                   updateCellWidth();
                   updateCurrentDayLinePosition();
                   updateDependencies();

                   if(props.useGroups)
                       updateGroupDimensions();
               }
           });

           updateCellWidth();
           updateCurrentDayLinePosition();
           updateDependencies();

           if(props.useGroups)
               updateGroupDimensions();
       }
    });

    const updateCellWidth = () => {
        if(chartEl.value)
            cellWidth.value = chartEl.value.querySelector('.gantt-header .header-cell').offsetWidth;
    }

    const updateCurrentDayLinePosition = () => {
        nextTick(() => {
            if(currentDayLineEl.value) {
                const currentDayIndex = visibleDates.value.findIndex((d) => d.isSame(moment(), 'day'));
                if(currentDayIndex === -1) {
                    currentDayLineEl.value.style.display = 'none';
                } else {
                    currentDayLineEl.value.style.display = 'block';

                    if(headerCellEls.value) {
                        const headerCellEl = headerCellEls.value.find(headerCellEl => headerCellEl.classList.contains('current'))
                        if(headerCellEl)
                            currentDayLineEl.value.style.left = (headerCellEl.offsetLeft + Math.round(headerCellEl.offsetWidth / 2) - 1) + 'px';
                    }

                    if(chartEl.value) {
                        currentDayLineEl.value.style.height = 0;
                        currentDayLineEl.value.style.height = chartEl.value.querySelector('.gantt-rows').scrollHeight + 'px';
                    }
                }
            }
        });
    }

    const groupElements = ref(null);
    const updateGroupDimensions = () => {
        nextTick(() => {
            groupElements.value.forEach(groupElement => {
                if(chartEl.value && groupElement.dataset?.group) {
                    const gridEls = chartEl.value.querySelectorAll(`.gantt-rows [data-group="${groupElement.dataset.group}"]`);
                    if(gridEls.length > 0) {
                        let top;
                        let bottom;
                        gridEls.forEach(gridEl => {
                            const rect = gridEl.getBoundingClientRect();
                            if(!top || top > rect.y)
                                top = rect.y;

                            if(!bottom || bottom < (rect.y + rect.height))
                                bottom = rect.y + rect.height;
                        });

                        groupElement.style.height = (bottom - top + 4) + 'px';
                    }
                }
            })
        });
    }

    const blockElements = ref([]);
    const setBlockElement = (el) => {
        if(el)
            blockElements.value.push(el);
    };

    onBeforeUpdate(() => {
        blockElements.value = [];
    });

    const updateDependencies = () => {
        nextTick(() => {
            if(chartEl.value) {
                const dependencyArrows = chartEl.value.querySelectorAll('.gantt-dependency-arrow');
                dependencyArrows.forEach(dependencyArrow => {
                    dependencyArrow.remove();
                });
            }

            blockElements.value.forEach(blockElement => {
                if(blockElement.dataset.dependents) {
                    const dependents = blockElement.dataset.dependents?.split(',');
                    if(chartEl.value && dependents.length > 0) {
                        dependents.forEach(dependent => {
                            const dependentElement = chartEl.value.querySelector(`.gantt-rows [data-block-id="${ dependent }"]`);
                            if(dependentElement) {
                                const dependencyArrowElement = document.createElement('div');
                                dependencyArrowElement.classList.add('gantt-dependency-arrow');

                                const top = dependentElement.offsetTop + dependentElement.offsetHeight;
                                const height = (blockElement.offsetTop + (blockElement.offsetHeight / 2)) - top;
                                const left = dependentElement.offsetLeft + (dependentElement.offsetWidth / 2);
                                const width = blockElement.offsetLeft - left;

                                dependencyArrowElement.style.top = top + 'px';
                                dependencyArrowElement.style.height = height + 'px';
                                dependencyArrowElement.style.left = left + 'px';
                                dependencyArrowElement.style.width = width + 'px';

                                blockElement.after(dependencyArrowElement);
                            }
                        });
                    }
                }
            });
        });
    }

    function getBlockSegment(item) {
        const start = moment(item.dateFrom);
        const end = moment(item.dateTo);

        let colStart = visibleDates.value.findIndex((d) => d.isSameOrAfter(start, 'day'));
        let colEnd = visibleDates.value.findIndex((d) => d.isAfter(end, 'day'));

        let overflowStart = false;
        if(colStart <= 0) {
            colStart = 0;
            overflowStart = true;
        }

        let overflowEnd = false;
        if(colEnd === -1) {
            colEnd = daysVisible.value;
            overflowEnd = true;
        }

        return {
            column: `${colStart + 1} / ${colEnd + 1}`,
            overflowStart: overflowStart,
            overflowEnd: overflowEnd
        };
    }

    const isDragging = ref(false);
    const dragStartX = ref(0);
    const accumulatedDrag = ref(0);
    function startDrag(e) {
        isDragging.value = true;
        dragStartX.value = e.clientX;
        accumulatedDrag.value = 0;

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    function handleDrag(e) {
        if (!isDragging)
            return;

        const deltaX = e.clientX - dragStartX.value;
        accumulatedDrag.value += deltaX;
        const daysToShift = Math.floor(accumulatedDrag.value / cellWidth.value);
        if (daysToShift !== 0) {
            currentStartDate.value = currentStartDate.value.clone().subtract(daysToShift, 'days');
            accumulatedDrag.value -= daysToShift * cellWidth.value;
            updateCurrentDayLinePosition();
            updateDependencies();

            if(props.useGroups)
                updateGroupDimensions();
        }

        dragStartX.value = e.clientX;
    }

    function stopDrag() {
        isDragging.value = false;
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
    }

    const interaction = ref({
        type: null,
        item: null,
        originalX: 0,
        originalStart: null,
        originalEnd: null,
    });
    function startInteraction(e, type, item) {
        e.stopPropagation();

        interaction.value = {
            type,
            item,
            originalX: e.clientX,
            originalStart: moment(item.dateFrom),
            originalEnd: moment(item.dateTo),
        };

        document.addEventListener('mousemove', handleInteraction);
        document.addEventListener('mouseup', stopInteraction);
    }

    function handleInteraction(e) {
        if (!interaction.value.type)
            return;

        const deltaX = e.clientX - interaction.value.originalX;
        const daysDelta = Math.round(deltaX / cellWidth.value);
        const { item, originalStart, originalEnd } = interaction.value;
        const updated = { ...item };

        let limitDateFrom = null;
        if(item.requirements && item.requirements.length > 0) {
            if(props.useGroups)
                limitDateFrom = moment(Math.max(...props.items.filter(requiredItem => (item.group instanceof Object ? item.group?.id : item.group) === (requiredItem.group instanceof Object ? requiredItem.group?.id : requiredItem.group) && item.requirements.includes(requiredItem.id)).map(item => moment(item.dateTo).unix() * 1000)));
            else limitDateFrom = moment(Math.max(...props.items.filter(requiredItem => item.requirements.includes(requiredItem.id)).map(item => moment(item.dateTo).unix() * 1000)));
        }

        let changed = false;
        if (interaction.value.type === 'move') {
            const proposedStart = originalStart.clone().add(daysDelta, 'days');
            const proposedEnd = originalEnd.clone().add(daysDelta, 'days');

            if (limitDateFrom && proposedStart.isSameOrBefore(limitDateFrom)) {
                if (daysDelta <= 0)
                    return;
            }


            if(updated.dateFrom !== proposedStart.format('YYYY-MM-DD')) {
                updated.dateFrom = proposedStart.format('YYYY-MM-DD');
                changed = true;
            }

            if(updated.dateTo !== proposedEnd.format('YYYY-MM-DD')) {
                updated.dateTo = proposedEnd.format('YYYY-MM-DD');
                changed = true;
            }
        } else if (interaction.value.type === 'resize-start') {
            const proposedStart = originalStart.clone().add(daysDelta, 'days');
            if (proposedStart.isAfter(originalEnd) || proposedStart.isSameOrBefore(limitDateFrom))
                return;

            if(updated.dateFrom !== proposedStart.format('YYYY-MM-DD')) {
                updated.dateFrom = proposedStart.format('YYYY-MM-DD');
                changed = true;
            }
        } else if (interaction.value.type === 'resize-end') {
            const proposedEnd = originalEnd.clone().add(daysDelta, 'days');
            if (proposedEnd.isBefore(originalStart))
                return;

            if(updated.dateTo !== proposedEnd.format('YYYY-MM-DD')) {
                updated.dateTo = proposedEnd.format('YYYY-MM-DD');
                changed = true;
            }
        }

        previewItems.value = [
            ...previewItems.value.filter(i => i.id !== updated.id),
            updated,
        ];

        if(changed)
            updateDependencies();
    }

    function stopInteraction() {
        if (interaction.value.item) {
            const previewed = previewItems.value.find(i => i.id === interaction.value.item.id);
            const original = interaction.value.item;

            const changed = previewed &&
                (previewed.dateFrom !== original.dateFrom || previewed.dateTo !== original.dateTo);

            if (changed) {
                emit('update-item', previewed, () => {
                    previewItems.value = [];
                });
            } else {
                previewItems.value = [];
            }
        }
        document.removeEventListener('mousemove', handleInteraction);
        document.removeEventListener('mouseup', stopInteraction);
        interaction.value = {
            type: null,
            item: null,
            originalX: 0,
            originalStart: null,
            originalEnd: null,
        };
    }
</script>

<template>
    <div
        class="gantt-chart"
        :style="{
            height: height + 'px',
        }"
    >
        <div v-if="useGroups" class="chart-groups">
            <div class="groups-header">Skupiny</div>
            <div class="groups">
                <div
                    v-for="group of groupedRowsMap.groups"
                    class="group"
                    :data-group="group.id"
                    ref="groupElements"
                >
                    <Tooltip :text="group.name">{{ group.name }}</Tooltip>
                </div>
            </div>
        </div>
        <div
            class="chart"
            ref="chartEl"
            @mousedown="startDrag"
        >
            <div class="gantt-header" :style="gridStyle">
                <div
                    v-for="(date, index) in visibleDates"
                    :key="index"
                    class="header-cell"
                    :class="{ current: date.isSame(moment(), 'day') }"
                    ref="headerCellEls"
                >
                    <span>{{ date.format('MMM') }}</span>
                    <br>
                    <span>{{ date.format('D') }}</span>
                </div>
            </div>

            <div class="gantt-rows" :style="gridStyle">
                <div class="line" ref="currentDayLineEl"></div>
                <template v-if="!useGroups" v-for="item in visibleItems" :key="item.id">
                    {{ (block = getBlockSegment(item), null) }}
                    <div
                        :ref="setBlockElement"
                        class="gantt-block"
                        :class="{
                            'overflow-start': block.overflowStart,
                            'overflow-end': block.overflowEnd,
                        }"
                        :style="{
                            gridColumn: block.column,
                        }"
                        :data-block-id="item.id"
                        :data-dependents="item.requirements"
                    >
                        <div
                            class="resize-handle left"
                            @mousedown.stop.prevent="(e) => startInteraction(e, 'resize-start', item)"
                        ></div>
                        <Icon
                            icon="drag"
                            :width="16"
                            :height="16"
                            color="#152234"
                            class="move-handle"
                            @mousedown.stop.prevent="(e) => startInteraction(e, 'move', item)"
                        />
                        <div class="gantt-block-content">
                            <slot name="block" :item="item">
                                {{ item.name }}
                            </slot>
                        </div>

                        <div
                            class="resize-handle right"
                            @mousedown.stop.prevent="(e) => startInteraction(e, 'resize-end', item)"
                        ></div>
                    </div>
                    <div class="group-separator-line visible"></div>
                </template>
                <template v-else v-for="[groupKey, groupItems] in groupedRowsMap.rows">
                    <template
                        v-for="item in groupItems"
                        :key="item.id"
                    >
                        {{ (block = getBlockSegment(item), null) }}
                        <div
                            :ref="setBlockElement"
                            class="gantt-block"
                            :class="{
                                'overflow-start': block.overflowStart,
                                'overflow-end': block.overflowEnd,
                            }"
                            :style="{
                                gridColumn: block.column,
                            }"
                            :data-group="groupKey"
                            :data-block-id="item.id"
                            :data-dependents="item.requirements"
                        >
                            <div
                                class="resize-handle left"
                                @mousedown.stop.prevent="(e) => startInteraction(e, 'resize-start', item)"
                            ></div>
                            <Icon
                                icon="drag"
                                :width="16"
                                :height="16"
                                color="#152234"
                                class="move-handle"
                                @mousedown.stop.prevent="(e) => startInteraction(e, 'move', item)"
                            />
                            <div class="gantt-block-content">
                                <slot name="block" :item="item">
                                    {{ item.name }}
                                </slot>
                            </div>

                            <div
                                class="resize-handle right"
                                @mousedown.stop.prevent="(e) => startInteraction(e, 'resize-end', item)"
                            ></div>
                        </div>
                        <div class="group-separator-line" :data-group="groupKey"></div>
                    </template>
                    <div class="group-separator-line visible" :data-group="groupKey"></div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .gantt-chart {
        background: #F4F7FF;
        border-radius: 6px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: #DCE5F7 transparent;
        position: relative;
        display: flex;
        border-top: 1px solid #CFDDE5;

        .chart-groups {
            display: flex;
            flex-direction: column;
            min-width: 150px;
            max-width: 150px;

            .groups-header {
                min-height: 54px;
                max-height: 54px;
                border-bottom: 1px solid #CFDDE588;
                border-right: 1px solid #CFDDE5;
                font-weight: 600;
                display: flex;
                align-items: center;
                padding: 8px 4px;
                position: sticky;
                top: 0;
                background: #F4F7FF;
            }

            .groups {
                background-color: #fff;
                flex-grow: 1;
                border-right: 1px solid #CFDDE5;

                .group {
                    border-bottom: 1px solid #CFDDE588;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    padding: 8px 4px;

                    div {
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }

        .chart {
            user-select: none;
            flex-grow: 1;
            cursor: grab;
        }

        .gantt-header {
            position: sticky;
            top: 0;
            display: grid;
            background: #F4F7FF;
            z-index: 2;

            .header-cell {
                height: 54px;
                text-align: center;
                font-weight: 600;
                font-size: 12px;
                padding: 8px 4px;
                border-bottom: 1px solid #CFDDE588;
                overflow: hidden;

                &:not(:last-child) {
                    border-right: 1px solid #CFDDE588;
                }

                &.current {
                    background-color: #24C586;
                    color: #fff;
                    border-top: 1px solid #24C586;
                    border-bottom: 1px solid #24C586;
                }
            }
        }

        .gantt-rows {
            display: grid;
            column-gap: 4px;
            grid-auto-rows: min-content;
            padding: 0 4px;
            position: relative;
            height: calc(100% - 54px);

            .line {
                position: absolute;
                content: '';
                width: 2px;
                background-color: #24C586;
                top: 0;
                height: 100%;
            }

            .group-separator-line {
                grid-column: 1 / -1;
                margin: 0 -4px;

                &.visible {
                    height: 1px;
                    background-color: #CFDDE5;
                }
            }

            &:deep(.gantt-dependency-arrow) {
                position: absolute;
                border-left: 2px solid #152234;
                border-bottom: 2px solid #152234;
                border-bottom-left-radius: 1rem;
                pointer-events: none;
                z-index: 0;

                &::before {
                    content: '';
                    display: block;
                    width: 10px;
                    height: 10px;
                    border-right: 2px solid #152234;
                    border-top: 2px solid #152234;
                    transform: rotate(45deg);
                    position: absolute;
                    bottom: -6px;
                    right: 2px;
                }
            }

            .gantt-block {
                border-radius: 4px;
                background: #FFF;
                box-shadow: 0 0 4px #CFDDE588;
                position: relative;
                padding: 4px 8px;
                display: flex;
                align-items: center;
                min-width: 0;
                margin: 4px 0;
                z-index: 1;

                &.overflow-start {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    margin-left: -4px;
                    border-left: 2px solid #24C586;
                }

                &.overflow-end {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                    margin-right: -4px;
                    border-right: 2px solid #24C586;
                }

                .gantt-block-content {
                    overflow: hidden;
                }

                .move-handle {
                    min-width: 16px;
                    min-height: 16px;
                    margin-right: 4px;
                    cursor: move;
                }

                .resize-handle {
                    display: none;
                    position: absolute;
                    top: calc(50% - 6px);
                    height: 12px;
                    width: 6px;
                    cursor: ew-resize;
                    border-right: 2px solid #152234;
                    border-left: 2px solid #152234;

                    &.left {
                        left: -3px;
                    }

                    &.right {
                        right: -3px;
                    }
                }

                &:hover {
                    &:not(.overflow-start) {
                        .resize-handle.left {
                            display: block;

                            &:hover {
                                display: block;
                            }
                        }
                    }

                    &:not(.overflow-end) {
                        .resize-handle.right {
                            display: block;

                            &:hover {
                                display: block;
                            }
                        }
                    }
                }
            }
        }
    }
</style>