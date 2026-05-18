<script setup>
import { computed, ref, watch } from "vue";
import moment from "moment";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useForm } from "@/Components/Form/composables/useForm";
import ErrorMessage from "@/Components/Form/Components/ErrorMessage.vue";
import Help from "@/Components/Other/Help.vue";
import {isEqual} from "lodash";

const props = defineProps({
    modelValue: {
        type: [String, Object],
        default: "",
    },
    returnObject: {
        type: Boolean,
        default: false,
    },
    returnFormat: {
        type: String,
        default: undefined,
    },
    inputFormat: {
        type: String,
        default: undefined,
    },
    range: {
        type: Boolean,
        default: false,
    },
    label: [String, Function],
    type: {
        type: String,
        default: "date", // date, time, datetime
    },
    size: {
        type: String,
        default: "default",
    },
    id: String,
    name: String,
    error: String,
    help: String,
    readonly: {
        type: Boolean,
        default: false,
    },
    allowTextInput: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

const { emitFormBlur, emitFormInput, error, inputId, name, required } = useForm(props);

const datePickerRef = ref();

const returnFormat = computed(() => {
    if (props.returnFormat) {
        return props.returnFormat;
    }

    if (props.type === "date") {
        return "YYYY-MM-DD";
    } else if (props.type === "time") {
        return "HH:mm:ss";
    } else if (props.type === "datetime") {
        return "YYYY-MM-DD HH:mm:ss";
    }

    return "YYYY-MM-DD HH:mm:ss";
});

const inputFormat = computed(() => {
    if (props.inputFormat) {
        return props.inputFormat;
    }

    if (props.type === "date") {
        return "YYYY-MM-DD";
    } else if (props.type === "time") {
        return "HH:mm:ss";
    } else if (props.type === "datetime") {
        return "YYYY-MM-DD HH:mm:ss";
    }

    return "YYYY-MM-DD HH:mm:ss";
});

function getDateObject(date) {
    if (!date || date === 'Invalid date') {
        return null;
    }

    if (props.type === "time") {
        if (typeof date === "object") {
            return date;
        } else {
            const dateObj = moment(date, inputFormat.value).toDate();

            return {
                hours: dateObj.getHours(),
                minutes: dateObj.getMinutes(),
                seconds: dateObj.getSeconds(),
            }
        }
    }

    if (typeof date === "object") {
        return date;
    } else {
        return moment(date, inputFormat.value).toDate(); // Parsování řetězce na objekt Date pomocí moment.js
    }
}

function initObject(obj) {
    if (!props.range) {
        return getDateObject(obj);
    } else {
        let newObj = {
            from: null,
            to: null,
        };

        if (obj) {
            Object.entries(obj).forEach(([key, value]) => {
                newObj[key] = getDateObject(value);
            });

            return newObj;
        } else {
            return newObj;
        }
    }
}

const selectedDate = ref(initObject(props.modelValue));

watch(
        () => props.modelValue,
        (newValue, oldValue) => {
            if (!isEqual(newValue, oldValue)) {
                const newObj = initObject(newValue);

                if(!isEqual(selectedDate.value, newObj)) {
                    selectedDate.value = initObject(newValue);
                }
            }
        },
        { deep: true }
);

watch(
    () => selectedDate.value,
    (newValue) => {
        if (props.returnObject) {
            emit("update:modelValue", newValue);
        } else {
            let formattedDate = null;

            if (props.range) {
                formattedDate = {
                    from: newValue.from ? moment(newValue.from).format(returnFormat.value) : null,
                    to: newValue.to ? moment(newValue.to).format(returnFormat.value) : null,
                };
            } else if (newValue) {
                formattedDate = moment(newValue).format(returnFormat.value);
            }

            emit("update:modelValue", formattedDate);
        }
    },
    { deep: true },
);

// const format = props.type === "date" ? "dd.M.yyyy" : (props.type === "time" ? "HH:mm:ss" : "dd.M.yyyy HH:mm:ss");

// Logika pro okamžité nastavení data po kliknutí
const handleDateClick = (clickedDate, index = null) => {
    if (index === null) {
        selectedDate.value = clickedDate;
    } else {
        selectedDate.value[index] = clickedDate;
    }


    setTimeout(() => {
        if (datePickerRef.value && datePickerRef.value.closeMenu) {
            datePickerRef.value.closeMenu();
        }
    }, 200); // Malé zpoždění pro zajištění, že se datum nastaví
};

const format = computed(() => {
    let format = "dd.MM.yyyy HH:mm:ss";

    if (props.type === "date") {
        format = "dd.MM.yyyy";
    } else if (props.type === "time") {
        format = "HH:mm:ss";
    } else if (props.type === "datetime") {
        format = "dd.MM.yyyy HH:mm:ss";
    }

    return format;
});
</script>

<template>
    <div>
        <div
            v-if="!props.range"
            class="date-time-wrapper"
            :class="{
                error: error,
            }"
        >
            <label v-if="typeof props.label !== 'undefined'" :for="inputId">
                <component v-if="typeof label === 'function' && label" :is="label" />
                <template v-else>
                    {{ label }}
                </template>
                <span v-if="required" class="required">*</span>
                <Help v-if="help" :help="help" />
            </label>
            <div class="input-wrapper" :class="'size-' + size + ' ' + (readonly ? 'readonly' : '') ">
<!--                :text-input="allowTextInput"-->
                <VueDatePicker
                    v-model="selectedDate"
                    ref="datePickerRef"
                    :readonly="readonly"
                    locale="cs"
                    cancelText="zrušit"
                    selectText="vybrat"
                    now-button-label="dnes"
                    :teleport="true"
                    :action-row="{ showSelect: true, showCancel: true, showNow: props.type !== 'time', showPreview: true }"
                    :enable-time-picker="props.type === 'datetime'"
                    :format="format"
                    v-bind:time-picker="props.type === 'time' ? true : null"
                    :uid="inputId"
                    :name="name"
                    @date-update="(clickedDate) => handleDateClick(clickedDate)"
                    :text-input="props.allowTextInput"
                />
            </div>
            <ErrorMessage :error="error"></ErrorMessage>
        </div>
        <div
            v-else
            class="date-time-wrapper"
            :class="{
                error: error,
            }"
        >
            <label v-if="typeof props.label !== 'undefined'">
                <component v-if="typeof label === 'function' && label" :is="label" />
                <template v-else>
                    {{ label }}
                </template>
                <span v-if="required" class="required">*</span>
                <Help v-if="help" :help="help" />
            </label>
            <div class="date-range-wrapper">
                <div class="input-wrapper date-from" :class="'size-' + size">
                    <VueDatePicker v-model="selectedDate.from" :readonly="readonly" locale="cs" cancelText="zrušit" selectText="vybrat" :teleport="true" :enable-time-picker="props.type === 'datetime' || props.type === 'time'" :format="format"  v-bind:time-picker="props.type === 'time' ? true : null" :uid="inputId + '_from'" :name="name + '_from'" :text-input="props.allowTextInput"  @date-update="(clickedDate) => handleDateClick(clickedDate, 'from')" />
                </div>
                <div class="separator">-</div>
                <div class="input-wrapper date-to" :class="'size-' + size">
                    <VueDatePicker v-model="selectedDate.to" :readonly="readonly" locale="cs" cancelText="zrušit" selectText="vybrat" :teleport="true" :enable-time-picker="props.type === 'datetime' || props.type === 'time'" :format="format" v-bind:time-picker="props.type === 'time' ? true : null" :uid="inputId + '_to'" :name="name + '_to'" :text-input="props.allowTextInput"  @date-update="(clickedDate) => handleDateClick(clickedDate, 'to')" />
                </div>
            </div>
            <ErrorMessage :error="error"></ErrorMessage>
        </div>
    </div>
</template>

<style scoped>
.separator {
    font-size: 0.923rem;
    font-weight: 500;
    color: var(--color-font-light);
}

.date-time-wrapper {
    .date-range-wrapper {
        display: flex;
        align-items: center;
        gap: 7px;
    }

    .input-wrapper {
        position: relative;
        width: 100%;

        &.readonly:deep(input) {
            background-color: color-mix(in srgb, var(--color-outline) 20%, transparent);
            color: color-mix(in srgb, var(--color-dark) 70%, transparent);
        }

        .icon-wrapper {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            padding-left: 14px;
            pointer-events: none;

            .icon {
                width: 16px;
                height: 16px;
                color: var(--color-font-light);
            }
        }

        input {
            min-height: 40px;
            padding-left: 40px;
            padding-right: 10px;
        }
    }
}

.date-time-wrapper .input-wrapper :deep(input) {
    border-radius: 0.462rem;
    border: 1px solid var(--color-outline);
    background: var(--color-white);
    font-size: 0.923rem;
    color: var(--color-font);
    min-height: 2.308rem;
    height: 2.308rem;

    &:hover {
        &:not(.dp__input_readonly) {
            background-color: color-mix(in srgb, var(--color-outline) 10%, transparent);
        }
    }

    &:focus {
        border: 1px solid var(--color-outline);
        box-shadow: 0 0 0 1px var(--color-outline);
        outline: none;
    }
}

.error .input-wrapper :deep(input) {
    border-color: var(--color-error);
}

.date-time-wrapper .input-wrapper.size-small :deep(input) {
    min-height: 1.846rem;
}
</style>
