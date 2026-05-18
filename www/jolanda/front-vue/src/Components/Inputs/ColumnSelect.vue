<script setup>
    import { ref, computed, watch } from 'vue';
    import InputField from '@/Components/Inputs/InputField.vue';

    const props = defineProps({
        options: Array,
        modelValue: Array,
        label: String,
        filterable: {
            type: Boolean,
            default: false,
        },
        groupedOptions: {
            type: Boolean,
            default: false,
        },
        returnObject: {
            type: Boolean,
            default: false,
        },
        selectedColumn: {
            type: Boolean,
            default: false,
        },
    });

    const emit = defineEmits(['update:modelValue']);

    const dragging = ref(false);
    const draggingState = ref(null);
    const draggingStartOptionIndex = ref(null);
    const draggingStartGroupIndex = ref(null);

    const optionsSearch = ref('');
    const selectedSearch = ref('');

    const options = ref(props.options);
    const selected = ref(props.modelValue);

    const preSelected = ref([]);
    const preUnselected = ref([]);

    const unselectedOptions = computed(() => {
        if(props.groupedOptions) {
            return options.value.map(group => {
                return {
                    ...group,
                    options: group.options.filter(option => {
                        if (props.selectedColumn) {
                            if (props.returnObject)
                                return !selected.value.map(v => v.value).includes(option.value) && (props.filterable && optionsSearch.value.length > 0 ? option.name.toLowerCase().includes(optionsSearch.value.toLowerCase()) : true);
                            else return !selected.value.includes(option.value) && (props.filterable && optionsSearch.value.length > 0 ? option.name.toLowerCase().includes(optionsSearch.value.toLowerCase()) : true);
                        } else {
                            if (props.filterable && optionsSearch.value.length > 0)
                                return option.name.toLowerCase().includes(optionsSearch.value.toLowerCase());
                            else return options;
                        }
                    })
                };
            }).filter(group => group.options.length > 0);
        } else {
            if (props.selectedColumn) {
                if (props.returnObject)
                    return options.value.filter(option => !selected.value.map(v => v.value).includes(option.value) && (props.filterable && optionsSearch.value.length > 0 ? option.name.toLowerCase().includes(optionsSearch.value.toLowerCase()) : true));
                else return options.value.filter(option => !selected.value.includes(option.value) && (props.filterable && optionsSearch.value.length > 0 ? option.name.toLowerCase().includes(optionsSearch.value.toLowerCase()) : true));
            } else {
                if (props.filterable && optionsSearch.value.length > 0)
                    return options.value.filter(option => option.name.toLowerCase().includes(optionsSearch.value.toLowerCase()));
                else return options.value;
            }
        }
    });

    const selectedOptions = computed(() => {
        if(props.groupedOptions) {
            return options.value.map(group => {
                return {
                    ...group,
                    options: group.options.filter(option => {
                        if (props.returnObject)
                            return selected.value.map(v => v.value).includes(option.value) && (props.filterable && selectedSearch.value.length > 0 ? option.name.toLowerCase().includes(selectedSearch.value.toLowerCase()) : true);
                        else return selected.value.includes(option.value) && (props.filterable && selectedSearch.value.length > 0 ? option.name.toLowerCase().includes(selectedSearch.value.toLowerCase()) : true);
                    })
                };
            }).filter(group => group.options.length > 0);
        } else {
            if (props.returnObject)
                return options.value.filter(option => selected.value.map(v => v.value).includes(option.value) && (props.filterable && selectedSearch.value.length > 0 ? option.name.toLowerCase().includes(selectedSearch.value.toLowerCase()) : true));
            else return options.value.filter(option => selected.value.includes(option.value) && (props.filterable && selectedSearch.value.length > 0 ? option.name.toLowerCase().includes(selectedSearch.value.toLowerCase()) : true));
        }
    });

    const toggleOption = (option, state = null) => {
        if(props.selectedColumn) {
            if (props.returnObject) {
                if (selected.value.map(v => v.value).includes(option.value)) {
                    if(preUnselected.value.map(v => v.value).includes(option.value)) {
                        if(state !== true)
                            preUnselected.value = preUnselected.value.filter(v => v.value !== option.value);
                    } else {
                        if(state !== false)
                            preUnselected.value.push(option);
                    }
                } else {
                    if(preSelected.value.map(v => v.value).includes(option.value)) {
                        if(state !== true)
                            preSelected.value = preSelected.value.filter(v => v.value !== option.value);
                    } else {
                        if(state !== false)
                            preSelected.value.push(option);
                    }
                }
            } else {
                if (selected.value.includes(option.value)) {
                    if (preUnselected.value.includes(option.value)) {
                        if(state !== true)
                            preUnselected.value = preUnselected.value.filter(value => value !== option.value);
                    } else {
                        if(state !== false)
                            preUnselected.value.push(option.value);
                    }
                } else {
                    if (preSelected.value.includes(option.value)) {
                        if(state !== true)
                            preSelected.value = preSelected.value.filter(value => value !== option.value);
                    } else {
                        if(state !== false)
                            preSelected.value.push(option.value);
                    }
                }
            }
        } else {
            if (props.returnObject) {
                if (selected.value.map(v => v.value).includes(option.value)) {
                    if(state !== true)
                        selected.value = selected.value.filter(v => v.value !== option.value);
                } else {
                    if(state !== false)
                        selected.value.push(option);
                }
            } else {
                if (selected.value.includes(option.value)) {
                    if(state !== true)
                        selected.value = selected.value.filter(value => value !== option.value);
                } else {
                    if(state !== false)
                        selected.value.push(option.value);
                }
            }
        }
    }

    const toggleAllOptions = (state = null) => {
        if(props.groupedOptions) {
            let computedState = true;
            if(state !== null) {
                computedState = !state;
            } else {
                if (props.selectedColumn) {
                    computedState = unselectedOptions.value.map(group => {
                        return group.options.reduce((allSelected, option) => isOptionPreSelected(option), true);
                    }).reduce((allSelected, groupState) => allSelected && groupState, true);
                } else {
                    computedState = unselectedOptions.value.map(group => {
                        return group.options.reduce((allSelected, option) => isOptionSelected(option), true);
                    }).reduce((allSelected, groupState) => allSelected && groupState, true);
                }
            }

            unselectedOptions.value.forEach(group => toggleGroup(group, !computedState));
        } else {
            let computedState = true;
            if(state !== null) {
                computedState = !state;
            } else {
                if (props.selectedColumn)
                    computedState = unselectedOptions.value.reduce((allSelected, option) => isOptionPreSelected(option), true);
                else computedState = unselectedOptions.value.reduce((allSelected, option) => isOptionSelected(option), true);
            }

            unselectedOptions.value.forEach(option => toggleOption(option, !computedState));
        }
    }

    const toggleGroup = (group, state = null) => {
        let groupState = true;
        if(state !== null) {
            groupState = !state;
        } else {
            if (props.selectedColumn)
                groupState = group.options.reduce((allSelected, option) => isOptionPreSelected(option), true);
            else groupState = group.options.reduce((allSelected, option) => isOptionSelected(option), true);
        }

        group.options.forEach(option => toggleOption(option, !groupState));
    }

    const selectPreSelected = () => {
        if(preSelected.value.length > 0) {
            selected.value = [...selected.value, ...preSelected.value];
            preSelected.value = [];
        }
    }

    const unselectPreUnselected = () => {
        if(preUnselected.value.length > 0) {
            if (props.returnObject)
                selected.value = selected.value.filter(v => !preUnselected.value.map(v => v.value).includes(v.value));
            else selected.value = selected.value.filter(v => !preUnselected.value.includes(v));

            preUnselected.value = [];
        }
    }

    const onMouseDown = (event) => {
        const target = event.target.closest('.option');
        if(target && target.dataset.optionValue) {
            if(props.groupedOptions && !target.dataset.groupId)
                return;

            if(props.groupedOptions) {
                draggingStartGroupIndex.value = options.value.findIndex(g => g.id == target.dataset.groupId);
                if(draggingStartGroupIndex.value === -1)
                    draggingStartGroupIndex.value = null;
                else {
                    draggingStartOptionIndex.value = options.value[draggingStartGroupIndex.value].options?.findIndex(o => o.value == target.dataset.optionValue);
                    if(draggingStartOptionIndex.value === -1)
                        draggingStartOptionIndex.value = null;
                }
            } else {
                draggingStartOptionIndex.value = options.value.findIndex(o => o.value == target.dataset.optionValue)
                if(draggingStartOptionIndex.value === -1)
                    draggingStartOptionIndex.value = null;
            }

            if(draggingStartOptionIndex.value) {
                if(event.altKey) {
                    toggleAllOptions(false);

                    if(props.groupedOptions) {
                        toggleOption(options.value[draggingStartGroupIndex.value].options[draggingStartOptionIndex.value], true);
                    } else toggleOption(options.value[draggingStartOptionIndex.value], true);
                } else {
                    dragging.value = true;
                    if(props.groupedOptions) {
                        draggingState.value = !(props.selectedColumn ? isOptionPreSelected(options.value[draggingStartGroupIndex.value].options[draggingStartOptionIndex.value]) : isOptionSelected(options.value[draggingStartGroupIndex.value].options[draggingStartOptionIndex.value]));
                        toggleOption(options.value[draggingStartGroupIndex.value].options[draggingStartOptionIndex.value], draggingState.value);
                    } else {
                        draggingState.value = !(props.selectedColumn ? isOptionPreSelected(options.value[draggingStartOptionIndex.value]) : isOptionSelected(options.value[draggingStartOptionIndex.value]));
                        toggleOption(options.value[draggingStartOptionIndex.value], draggingState.value);
                    }
                }
            }
        }
    }

    const onMouseMove = (event) => {
        if(!dragging.value)
            return;

        const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.option')
        if(target && target.dataset.optionValue) {
            if(props.groupedOptions && !target.dataset.groupId)
                return;

            let groupIndex = null;
            let optionIndex = null;
            if(props.groupedOptions) {
                groupIndex = options.value.findIndex(g => g.id == target.dataset.groupId);
                if(groupIndex.value === -1)
                    groupIndex = null;
                else {
                    optionIndex = options.value[groupIndex].options?.findIndex(o => o.value == target.dataset.optionValue);
                    if(optionIndex === -1)
                        optionIndex = null;
                }
            } else {
                optionIndex = options.value.findIndex(o => o.value == target.dataset.optionValue)
                if(optionIndex === -1)
                    optionIndex = null;
            }

            if(optionIndex) {
                if(props.groupedOptions) {
                    options.value.forEach((group, gi) => {
                       if(gi < draggingStartGroupIndex.value || gi > groupIndex)
                           return;

                       group.options.forEach((option, oi) => {
                           if(gi === draggingStartGroupIndex.value && oi < draggingStartOptionIndex.value || gi === groupIndex && oi > optionIndex)
                               return;

                           toggleOption(option, draggingState.value);
                       });
                    });
                } else {
                    options.value.forEach((option, oi) => {
                        if(oi < draggingStartOptionIndex.value || oi > optionIndex)
                            return;

                        toggleOption(option, draggingState.value);
                    });
                }
            }
        }
    }

    const onMouseUpOrLeave = () => {
        dragging.value = false;
        draggingState.value = null;
    }

    const isOptionSelected = (option) => {
        if (props.returnObject)
            return selected.value.map(v => v.value).includes(option.value);

        return selected.value.includes(option.value);
    }

    const isOptionPreSelected = (option) => {
        if(props.selectedColumn) {
            if (props.returnObject)
                return preSelected.value.map(v => v.value).includes(option.value) || preUnselected.value.map(v => v.value).includes(option.value);

            return preSelected.value.includes(option.value) || preUnselected.value.includes(option.value);
        } else return false;
    }

    watch(() => props.modelValue, (newModelValue) => {
        selected.value = newModelValue;
    });

    watch(() => selected.value, (newSelected) => {
        emit('update:modelValue', newSelected);
    }, { deep: true });
</script>

<template>
    <div class="flex flex-col h-full border-[1px] rounded-[.5rem] border-outline">
        <h3 class="px-[.5rem] py-[.25rem] border-b-[1px] border-outline cursor-pointer" @click="toggleAllOptions(null)">{{ label }}</h3>
        <div class="flex overflow-hidden flex-grow-1">
            <div class="flex flex-col flex-grow-1 basis-[50%]" :class="{ 'max-w-[50%]': selectedColumn }">
                <div v-if="filterable" class="border-b-[1px] border-outline" :class="{ 'border-r-[1px]': selectedColumn }">
                    <InputField v-model="optionsSearch" icon="search" placeholder="Hledat" class="search-input" />
                </div>
                <div class="overflow-auto flex-grow-1" :class="{ 'border-b-[1px] border-r-[1px] border-outline': selectedColumn }" :style="{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-outline) transparent', userSelect: 'none' }" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseleave="onMouseUpOrLeave" @mouseup="onMouseUpOrLeave">
                    <div v-if="groupedOptions" v-for="group in unselectedOptions" :key="group.id">
                        <div class="font-bold px-[.25rem] py-[.5rem] text-[1.125rem] cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden" @click="toggleGroup(group)">{{ group.name }}</div>
                        <div v-for="option in group.options" :data-option-value="option.value" :data-group-id="group.id" class="option bg-white nth-[even]:bg-outline dark:bg-dark-900 dark:nth-[even]:bg-dark p-[.25rem] ml-[.75rem] mr-[.25rem] cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden" :class="{ '!bg-primary-300 nth-[even]:!bg-primary': isOptionSelected(option) || isOptionPreSelected(option) }">
                            {{ option.name }}
                        </div>
                    </div>
                    <div v-else v-for="option in unselectedOptions" :data-option-value="option.value" class="option bg-white nth-[even]:bg-outline dark:bg-dark-900 dark:nth-[even]:bg-dark p-[.25rem] mx-[.25rem] cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden" :class="{ '!bg-primary-300 nth-[even]:!bg-primary': isOptionSelected(option) || isOptionPreSelected(option) }">
                        {{ option.name }}
                    </div>
                </div>
                <div class="px-[1rem] py-[.5rem]" v-if="selectedColumn">
                    <div class="border-[1px] border-green rounded-[.25rem] text-center p-[.25rem] cursor-pointer hover:bg-green hover:text-white" @click="selectPreSelected">Přidat do výběru</div>
                </div>
            </div>

            <div v-if="selectedColumn" class="flex flex-col flex-grow-1 basis-[50%]" :class="{ 'max-w-[50%]': selectedColumn }">
                <div v-if="filterable" class="border-b-[1px] border-outline">
                    <InputField v-model="selectedSearch" icon="search" placeholder="Hledat" class="search-input" />
                </div>
                <div class="overflow-auto flex-grow-1 border-b-[1px] border-outline" :style="{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-outline) transparent', userSelect: 'none' }" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseleave="onMouseUpOrLeave" @mouseup="onMouseUpOrLeave">
                    <div v-if="groupedOptions" v-for="group in selectedOptions" :key="group.id">
                        <div class="font-bold px-[.25rem] py-[.5rem] text-[1.125rem] cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden" @click="toggleGroup(group)">{{ group.name }}</div>
                        <div v-for="option in group.options" :data-option-value="option.value" :data-group-id="group.id" class="option bg-white nth-[even]:bg-outline dark:bg-dark-900 dark:nth-[even]:bg-dark p-[.25rem] ml-[.75rem] mr-[.25rem] cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden" :class="{ '!bg-primary-300 nth-[even]:!bg-primary': isOptionPreSelected(option) }">
                            {{ option.name }}
                        </div>
                    </div>
                    <div v-else v-for="option in selectedOptions" :data-option-value="option.value" class="option bg-white nth-[even]:bg-outline dark:bg-dark-900 dark:nth-[even]:bg-dark p-[.25rem] mx-[.25rem] cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden" :class="{ '!bg-primary-300 nth-[even]:!bg-primary': isOptionPreSelected(option) }">
                        {{ option.name }}
                    </div>
                </div>
                <div class="px-[1rem] py-[.5rem]">
                    <div class="border-[1px] border-black rounded-[.25rem] text-center p-[.25rem] cursor-pointer hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black" @click="unselectPreUnselected">Odebrat z výběru</div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
    .search-input {
        &:deep(input) {
            border: none;
            outline: none;
            border-radius: 0;
        }
    }
</style>
