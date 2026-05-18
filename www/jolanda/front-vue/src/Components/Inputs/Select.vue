<script setup>
import {ref, computed, onMounted, watch, onUnmounted, nextTick, readonly} from "vue";
import InputField from "./InputField.vue";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import { useManager } from "@/Composables/useManager";
import { useAjax } from "@/Composables/useAjax.js";
import Help from "@/Components/Other/Help.vue";

const props = defineProps({
    options: [Array, Object],
    modelValue: [String, Object, Array, Number],
    placeholder: String,
    label: [String, Function],
    filterable: Boolean,
    filterableParam: {
        type: String,
        default: "q",
    },
    url: String, // URL adresa pro načítání dat
    manager: [String, Object],
    pageSize: {
        type: [Number, Boolean],
        default: 10, // Počet položek na stránku
    },
    required: {
        type: Boolean,
        default: undefined,
    },
    multiple: {
        type: Boolean,
        default: false, // Multiselect
    },
    returnObject: {
        type: Boolean,
        default: false, // Vracet objekt místo hodnoty
    },
    remoteName: {
        type: String,
        default: "Name",
    },
    textFromValue: {
        type: Boolean,
        default: false,
    },
    textProperty: {
        type: String,
        default: "text",
    },
    remoteIdentifier: {
        type: String,
        default: "ID",
    },
    remoteValueObject: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: "default", // možnosti jsou 'small', 'default', 'large'
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    name: String,
    id: String,
    error: String,
    help: String,
    minSearchLength: {
        type: Number,
        default: 3,
    },
    groupBy: {
        type: [String, Function],
        default: null,
    },
    groupSort: {
        type: Function,
        default: null,
    },
    ungroupedLabel: {
        type: String,
        default: "",
    },
});

const { emitFormChange, emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const lock = ref(false);
const ajax = useAjax();

const initOptions = (options) => {
    if (!options) return [];

    if (typeof options === "object") {
        if (Array.isArray(options)) {
            return options;
        }

        return Object.entries(options).map(([key, value]) => ({
            text: value,
            value: key === "" ? null : key,
        }));
    }

    return [];
};

const options = ref(initOptions(props.options));
const getOptionByValue = (value) => {
    return options.value.find((option) => option.value == value);
};

const emit = defineEmits(["update:modelValue", "change", "selectedObject", "dropdownChange"]);
const isOpen = ref(false);
const filterText = ref("");
const url = computed(() => {
    let _url, params;
    if (props.url) {
        if (!props.url.startsWith("/")) {
            _url = "/" + props.url;
        } else {
            _url = props.url;
        }
    } else if (props.manager) {
        const { getURLs, getParams } = useManager(props.manager);

        _url = getURLs().list;
        params = getParams();
    }

    if (_url) {
        return {
            url: _url,
            params: params ?? null,
        };
    } else {
        return null;
    }
});

const initSelectedValue = (value) => {
    if (!value && props.multiple) {
        return [];
    }

    if (value === null) {
        const noneOption = options.value?.find((opt) => opt.value === null);
        return noneOption;
    }

    return typeof value === "object" // Object/Array
        ? Array.isArray(value) // Array
            ? !props.textFromValue
                ? value.map((item) => {
                      if (typeof item !== "object" || item === null) {
                          return getOptionByValue(item) ?? item;
                      } else {
                          return item;
                      }
                  })
                : value.map((item) => {
                      let tmp = item;
                      if (typeof item !== "object" || item === null) {
                          tmp = getOptionByValue(item) ?? item;
                      }
                      return {
                          value: tmp.value,
                          text: props.remoteName ? (tmp.value[props.remoteName] ?? null) : (tmp.value[props.textProperty] ?? null),
                      };
                  })
            : // Object
              !props.textFromValue
              ? props.returnObject
                  ? value
                  : (getOptionByValue(value) ?? value)
              : {
                    value: value,
                    text: props.remoteName ? (value[props.remoteName] ?? null) : (value[props.textProperty] ?? null),
                }
        : // String
          (getOptionByValue(value) ?? value ?? (props.multiple ? [] : null));
};

const selectedValue = ref(initSelectedValue(props.modelValue));

const hasGrouping = computed(() => !!props.groupBy);

const getGroupKey = (option) => {
    if (!props.groupBy) return null;

    let key = null;

    if (typeof props.groupBy === "function") {
        key = props.groupBy(option);
    } else if (typeof props.groupBy === "string") {
        key = option?.[props.groupBy];
    }

    if (key === undefined || key === null || key === "") {
        return props.ungroupedLabel || null;
    }

    return String(key);
};

// rows pro render: { type: 'group', key, label } | { type:'option', key, option }
const filteredRows = computed(() => {
    const base = filterText.value
            ? options.value.filter((opt) =>
                    (opt.text ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(filterText.value.toLowerCase()),
            )
            : options.value;

    if (!hasGrouping.value) {
        return base.map((opt) => ({
            type: "option",
            key: `opt:${getOptionValue(opt.value)}`,
            option: opt,
        }));
    }

    const groupsMap = new Map(); // key -> { label, options: [] }

    for (const opt of base) {
        const g = getGroupKey(opt) ?? "";
        if (!groupsMap.has(g)) {
            groupsMap.set(g, { label: g, options: [] });
        }
        groupsMap.get(g).options.push(opt);
    }

    let groupKeys = Array.from(groupsMap.keys());

    if (props.groupSort) {
        groupKeys.sort((a, b) => props.groupSort(a, b));
    } else {
        groupKeys.sort((a, b) => a.localeCompare(b, "cs"));
    }

    const rows = [];
    for (const g of groupKeys) {
        const showHeader = g !== "" && g !== null && g !== undefined;

        if (showHeader) {
            rows.push({
                type: "group",
                key: `grp:${g}`,
                label: g,
            });
        }

        for (const opt of groupsMap.get(g).options) {
            rows.push({
                type: "option",
                key: `opt:${getOptionValue(opt.value)}`,
                option: opt,
                group: g,
            });
        }
    }

    return rows;
});


let timeoutId = null;

const selectOption = (option) => {
    if (props.multiple) {
        if (isOptionSelected(option)) {
            const index = selectedValue.value.findIndex((item) => item.value === option.value);
            if (index !== -1) selectedValue.value.splice(index, 1);
        } else {
            selectedValue.value.push(option);
        }

        if (props.returnObject) {
            emit("update:modelValue", selectedValue.value);
            emitFormChange();
            emit("change", selectedValue.value);
        } else {
            emit(
                "update:modelValue",
                selectedValue.value.map((item) => item.value),
            );
            emitFormChange();
            emit(
                "change",
                selectedValue.value.map((item) => item.value),
            );
        }

        emit("selectedObject", selectedValue.value);
    } else {
        if (isOptionSelected(option)) {
            if(required)
                return;

            if (option.value === null) return;
            selectedValue.value = null;
        } else {
            selectedValue.value = option;
        }

        if (props.returnObject) {
            emit("update:modelValue", { ...option });
            emitFormChange();
            emit("change", { ...option });
        } else {
            emit("update:modelValue", option.value);
            emitFormChange();
            emit("change", option.value);
        }

        emit("selectedObject", option);
    }

    isOpen.value = false;
};

const clearSelectedValue = () => {
    if (props.multiple) {
        selectedValue.value = [];
    } else {
        const noneOption = options.value?.find((opt) => opt.value === null);
        if (noneOption) {
            selectOption(noneOption);
            return;
        } else {
            selectedValue.value = null;
        }
    }

    emit("update:modelValue", selectedValue.value);
    emitFormChange();
    emit("change", selectedValue.value);
    emit("selectedObject", selectedValue.value);
};

const isOptionSelected = (option) => {
    if (props.multiple) {
        if (selectedValue.value?.filter((selected) => selected.value === option.value).length > 0) return true;
    } else {
        if (selectedValue.value?.value === option.value) {
            return true;
        }
    }

    return false;
};

const toggleDropdown = (e) => {
    setTimeout(() => {
        if (!props.readonly && !lock.value) {
            isOpen.value = !isOpen.value;
            nextTick(() => {
                if (isOpen.value) {
                    updateDropdownPosition();
                    requestAnimationFrame(() => {
                        if (searchInputEl.value && props.filterable) {
                            searchInputEl.value.focus();
                        }
                    });
                }
            });
        }
    }, 100);
};

// Zavření dropdownu kliknutím mimo komponentu
const closeDropdown = (event) => {
    if (scrollContainer.value && !scrollContainer.value.contains(event.target) && dropdownTriggerEl.value && !dropdownTriggerEl.value.contains(event.target)) {
        isOpen.value = false;
        filterText.value = "";
    }
};

onMounted(() => {
    document.addEventListener("click", closeDropdown);
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition, true);

    if (url.value) {
        if (selectedValue.value && typeof selectedValue.value !== "object") {
            loadTextForValue();
        }
    }
});
onUnmounted(() => {
    document.removeEventListener("click", closeDropdown);
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener("scroll", onScroll);
    }
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.removeEventListener("resize", updateDropdownPosition, true);
});

const getOptionValue = (value) => {
    return typeof value === "object" ? JSON.stringify(value) : value;
};

watch(
    () => props.options,
    (newOptions) => {
        options.value = initOptions(newOptions);
    },
    { immediate: true },
);

watch(
    () => props.modelValue,
    (newValue, oldValue) => {
        if (newValue !== selectedValue.value) {
            emitFormChange();
            if (newValue === null) {
                const noneOption = options.value?.find((opt) => opt.value === null);
                if (noneOption) {
                    return;
                }
            }

            selectedValue.value = initSelectedValue(newValue);
        }
    },
);

watch(
    () => selectedValue.value,
    (newVal, oldValue) => {
        if (url.value && oldValue !== newVal) {
            if (newVal && typeof newVal !== "object") {
                loadTextForValue();
            }
        }
    },
);

//AJAX select
const ajaxState = ref({
    page: 0,
    totalCount: null,
    isLoading: false,
});
const scrollContainer = ref(null);
const dropdownTriggerEl = ref(null);
const searchInputEl = ref(null);

let abortController = null;
const loadData = async (reset = false) => {
    if (!url.value) {
        return;
    }

    if(props.minSearchLength > 0 && filterText.value && filterText.value.length < props.minSearchLength){
        ajaxState.value.page = 0;
        options.value = [];

        return;
    }

    if (reset) {
        ajaxState.value.page = 0;
        options.value = [];
    }

    if (abortController) {
        abortController.abort(); // Zrušíme předchozí požadavek
    }

    abortController = new AbortController();

    ajaxState.value.isLoading = true;
    try {
        let urlParams = {
            ...(url.value.params ?? {}),
            ...typeof props.pageSize === "number"
                ? {
                    start: ajaxState.value.page * props.pageSize,
                    count: props.pageSize,
                }
                : {},
        };

        if (filterText.value) {
            urlParams[props.filterableParam] = filterText.value;
        }

        const response = await ajax.get(url.value.url, {
            params: urlParams,
            signal: abortController.signal,
        });

        const tmpOptions = response.data.items.map((item) => {
            return {
                ...item,
                value: !props.remoteValueObject ? item[props.remoteIdentifier] : item,
                text: item[props.remoteName],
            };
        });

        options.value.push(...tmpOptions);
        ajaxState.value.totalCount = parseInt(response.data.numRows);
    } catch (error) {
        console.error("Chyba při načítání dat:", error);
    } finally {
        ajaxState.value.isLoading = false;
    }
};

const loadTextForValue = async () => {
    //TODO pro multiple?
    try {
        if (!url.value) {
            return;
        }
        if (ajaxState.value.isLoading || !selectedValue.value || typeof selectedValue.value === "object") {
            return;
        }

        if (options.value.length) {
            const option = options.value.find((opt) => opt.value === selectedValue.value);
            if (option) {
                selectedValue.value = option;
                return;
            }
        }

        lock.value = true;

        const urlParams = {
            ...(url.value.params ?? {}),
            [props.remoteIdentifier]: selectedValue.value,
            start: 0,
            count: 1,
            noNumRows: 1,
            _columns: [props.remoteIdentifier, props.remoteName],
        };

        const response = await ajax.get(url.value.url, {
            headers: {
                "Content-Type": "application/json",
            },
            params: urlParams,
        });

        if (response.data?.items?.length > 1) {
            console.warn("loadTextForValue fetched more then 1 row from server. Try to implement count parametr for given data url.");
        }

        const tmpOptions = response.data.items
            .map((item) => {
                if (item[props.remoteIdentifier] != selectedValue.value) return;

                return {
                    value: selectedValue.value,
                    text: item[props.remoteName],
                };
            })
            .filter((opt) => !!opt);

        if (tmpOptions && tmpOptions.length === 1) {
            selectedValue.value = tmpOptions[0];
        } else {
            selectedValue.value = {
                value: selectedValue.value,
                text: "...",
            };
        }
    } catch (error) {
        selectedValue.value = {
            value: selectedValue.value,
            text: "...",
        };
    }

    lock.value = false;
};

watch(filterText, () => {
    if (isOpen.value) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            loadData(true).then(() => {
                nextTick(() => {
                    updateDropdownPosition();
                });
            });
        }, 750);
    }
});

watch(isOpen, (newVal) => {
    emit('dropdownChange', newVal);
    if (newVal) {
        loadData(true).then(() => {
            updateDropdownPosition();
            requestAnimationFrame(() => {
                if (searchInputEl.value && props.filterable) {
                    searchInputEl.value.focus();
                }
            });
        });
    }
});

watch(options, (newVal) => {
    if (newVal && selectedValue.value && typeof selectedValue.value !== "object") {
        let opt = newVal.find((opt) => opt.value === selectedValue.value);
        if (opt) {
            selectOption(opt);
        }
    }
});

const onScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - 10 && options.value.length < ajaxState.value.totalCount && !ajaxState.value.isLoading) {
        ajaxState.value.page++;
        loadData();
    }
};

watch(
    isOpen,
    (newVal, oldVal) => {
        if (!url.value) {
            return;
        }

        if (newVal === true) {
            nextTick().then(() => {
                if (scrollContainer.value) {
                    scrollContainer.value.addEventListener("scroll", onScroll);
                }
            });
        } else if (oldVal === true) {
            if (scrollContainer.value) {
                scrollContainer.value.removeEventListener("scroll", onScroll);
            }
        }
    },
    { immediate: false },
);
//end AJAX select

const inputClass = computed(() => {
    let baseClasses = "border border-gray-300 text-gray-900 rounded-lg relative pr-6 pl-2.5";

    if (props.readonly || lock.value) {
        baseClasses = baseClasses + " bg-gray-200";
    } else {
        baseClasses = baseClasses + " bg-gray-50 cursor-pointer";
    }

    switch (props.size) {
        case "small":
            return `${baseClasses} py-2 min-h-[34px] text-xs`;
        case "large":
            return `${baseClasses} py-4 min-h-[58px] text-base`;
        default:
            return `${baseClasses} py-2.5 min-h-[42px] text-sm`;
    }
});

const dropdownStyles = ref({});

const getAbsolutePosition = (element) => {
    if (!element.getClientRects().length) {
        return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset,
    };
};

const updateDropdownPosition = () => {
    if (dropdownTriggerEl.value && scrollContainer.value) {
        const { width, height } = dropdownTriggerEl.value.getBoundingClientRect();
        const { top, left } = getAbsolutePosition(dropdownTriggerEl.value);
        const windowHeight = window.innerHeight;
        const dropdownHeight = scrollContainer.value.offsetHeight;
        const relativeTop = top - window.scrollY; // Adjust top to be relative to the window's viewport

        let newTop;
        // Check if dropdown fits below
        if (relativeTop + height + dropdownHeight <= windowHeight) {
            newTop = top + height - 1;
        }
        // Check if dropdown fits above
        else if (relativeTop - dropdownHeight >= 0) {
            newTop = top - dropdownHeight - 1;
        }
        // Default to below if it doesn't fit above either
        else {
            newTop = top + height - 1;
        }

        // Use requestAnimationFrame to avoid layout thrashing
        requestAnimationFrame(() => {
            dropdownStyles.value = {
                position: "absolute",
                top: `${newTop}px`,
                left: `${left}px`,
                width: `${width}px`,
            };
        });
    }
};

defineExpose({
    options,
    selectedValue,
    toggleDropdown
});
</script>

<template>
    <div
        class="select"
        :class="{
            error: error,
        }"
    >
        <label v-if="props.label" @click.stop="toggleDropdown" :for="inputId">
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            <span v-if="required" class="required">*</span>
            <Help v-if="help" :help="help" />
        </label>
        <div class="input-wrapper border-1 border-outline dark:border-dark dark:bg-nav" ref="dropdownTriggerEl" :id="inputId" :name="name"
            :class="{
                ['size-' + size]: true,
                'bg-outline/20 text-dark/70 dark:bg-nav/50 dark:text-white/70': props.readonly,
                'bg-white dark:bg-nav hover:bg-outline/10 dark:hover:bg-nav/80': !props.readonly,
            }"
        >
            <div @click.stop="toggleDropdown" class="input text-dark dark:text-white border-r border-outline dark:border-dark flex justify-between min-w-0 gap-2" :class="{ multiple: multiple }">
                <div class="max-h-full overflow-hidden text-ellipsis whitespace-nowrap break-keep grow flex gap-2">
                    <template v-if="multiple">
                        <template v-if="selectedValue && selectedValue.length === 0 && placeholder">
                            {{ placeholder }}
                        </template>
                        <div v-else v-for="selected in selectedValue" @click.stop="selectOption({ value: selected.value, text: selected.text })" class="bg-outline dark:bg-outline/20 rounded-xl px-2 multiple-item">
                            <div v-html="selected.text"></div>
                        </div>
                    </template>
                    <div v-else>
                        <template v-if="lock">
                            {{ "..." }}
                        </template>
                        <slot v-else-if="selectedValue?.text" name="selectedOption" :option="selectedValue">
                            <slot name="option" :option="selectedValue">
                                <div v-html="selectedValue.text"></div>
                            </slot>
                        </slot>

                        <template v-else-if="placeholder">
                            {{ placeholder }}
                        </template>
                    </div>
                </div>
                <span v-if="!required && (multiple ? selectedValue?.length > 0 : selectedValue ? selectedValue.value !== null : false) && !props.readonly" class="close-icon icon" @click.stop="clearSelectedValue">
                    <Icon icon="close" class="w-[8px] text-light" />
                </span>
            </div>
            <div class="icons">
                <span class="arrow-icon icon" @click.stop="toggleDropdown">
                    <Icon icon="arrow" class="w-[9px] text-light" direction="bottom" />
                </span>
            </div>
        </div>
        <ErrorMessage :error="error"></ErrorMessage>
        <Teleport to="#vue_teleport">
            <div v-if="isOpen" :style="dropdownStyles" ref="scrollContainer" style="position: absolute" class="dropdown bg-white dark:bg-dark border border-outline dark:border-medium">
                <InputField v-if="filterable" v-model="filterText" @set-input-ref="(ref) => (searchInputEl = ref)" icon="search" placeholder="Vyhledat..."></InputField>
                <template v-if="!url">
                    <template v-for="row in filteredRows" :key="row.key">
                        <div
                                v-if="row.type === 'group'"
                                class="optgroup px-3 py-2 text-xs font-semibold uppercase opacity-70"
                        >
                            <slot name="group" :label="row.label">
                                {{ row.label }}
                            </slot>
                        </div>

                        <div
                                v-else
                                class="option [&:not(:first-child)]:border-t [&:not(:first-child)]:border-outline/30 dark:[&:not(:first-child)]:border-medium/30 min-h-[30px]"
                                :class="{ selected: isOptionSelected(row.option) }"
                                @click.stop="selectOption(row.option)"
                        >
                            <slot name="option" :option="row.option">
                                <div v-if="row.option.id === '' && !row.option.text">x</div>
                                <div v-else v-html="row.option.text"></div>
                            </slot>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <template v-for="row in filteredRows" :key="row.key">
                        <div
                                v-if="row.type === 'group'"
                                class="optgroup px-3 py-2 text-xs font-semibold uppercase opacity-70"
                        >
                            <slot name="group" :label="row.label">
                                {{ row.label }}
                            </slot>
                        </div>

                        <div
                                v-else
                                class="option [&:not(:first-child)]:border-t [&:not(:first-child)]:border-outline/30 dark:[&:not(:first-child)]:border-medium/30 min-h-[30px]"
                                :class="{ selected: isOptionSelected(row.option) }"
                                @click.stop="selectOption(row.option)"
                        >
                            <slot name="option" :option="row.option">
                                <div v-if="row.option.id === '' && !row.option.text">x</div>
                                <div v-else v-html="row.option.text"></div>
                            </slot>
                        </div>
                    </template>
                </template>

                <div v-if="url && props.minSearchLength > 0 && filterText && filterText.length < props.minSearchLength" class="is-loading">
                    Zadejte minimálně {{ props.minSearchLength }} znaky
                </div>
                <div v-else-if="url && ajaxState.isLoading" class="is-loading bg-outline text-font-300 dark:bg-dark-900 dark:text-light">Načítám...</div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.select {
    width: 100%;
    position: relative;
    display: inline-block;

    .input-wrapper {
        border-radius: 0.462rem;
        display: flex;
        align-items: center;
        padding: 0 7px;
        height: 2.308rem;
        min-height: 2.308rem;
        position: relative;

        .input {
            display: flex;
            align-items: center;
            flex-grow: 1;
            padding-right: 6px;
            height: calc(100% - 2px);
            min-height: calc(100% - 2px);
            font-size: 0.923rem;
            cursor: pointer;
            font-weight: 400;

            &.multiple {
                display: flex;
                gap: 8px;
                overflow-x: auto;
                overflow-y: hidden;
                scrollbar-width: thin;

                .multiple-item {
                    white-space: nowrap;

                    &:hover {
                        text-decoration: line-through;
                    }
                }
            }
        }

        &.size-small {
            height: 1.846rem;
            min-height: 1.846rem;
        }

        .icons {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            height: 100%;
            padding-left: 7px;

            .icon {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }
    }
}

.dropdown {
    position: absolute;
    border-radius: 0.462rem;
    z-index: 9999;
    max-height: 300px;
    overflow-y: auto;
    font-size: 0.923rem;
    font-weight: 500;
    padding: 4px;
    box-shadow: var(--box-shaddow-medium);

    input {
        padding: 0.5rem;
        width: 100%;
    }

    .option {
        padding: 0.5rem 1rem;
        border-radius: 4px;

        &.selected {
            background: color-mix(in srgb, var(--color-primary) 18%, transparent);
        }

        &:hover {
            background: color-mix(in srgb, var(--color-primary) 10%, transparent);
            cursor: pointer;
        }
    }

    .is-loading {
        padding: 0.5rem 1rem;
        border-radius: 4px;
    }
}

.error {
    .input-wrapper {
        border-color: var(--color-error);
    }
}
</style>
