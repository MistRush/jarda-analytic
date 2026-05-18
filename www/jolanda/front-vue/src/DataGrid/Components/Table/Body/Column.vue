<script setup>
import { getCurrentInstance, inject, onMounted, onUnmounted, ref, watch } from "vue";
import { Column } from "@/DataGrid/js/Column/Column";
import { ColumnDef } from "@/DataGrid/js/Settings/ColumnDef";
import { DataGrid } from "@/DataGrid/js/DataGrid.js";
import { ColumnTypeCurrency } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCurrency.js";

const props = defineProps({
    className: String,
    data: String,
    label: [String, Function],
    labelTooltip: [String, Function],
    name: String,
    defaultContent: String,
    editable: Boolean,
    entityValues: Object,
    format: {
        type: String,
        default: "text",
    },
    formatFunction: Function,
    minWidth: [String, Number],
    visible: {
        type: Boolean,
        default: true,
    },
    enumValues: Object,
    render: Function,
    selectValues: Array,
    position: Number,
    width: [String, Number],
    orderable: {
        type: Boolean,
        default: true,
    },
    currency: String,
    currencyIsDecimal: {
        type: Boolean,
        default: undefined,
    },
    filter: {
        type: Boolean,
        default: true,
    },
    preview: {
        type: Boolean,
        default: true,
    },
    imgPath: {
        type: Function,
        default: undefined,
    },
    overflowPreview: {
        type: Boolean,
        default: true,
    },
    decimals: {
        type: Number,
    },
});

const dataGrid = inject("dataGrid", null);
const defOrder = inject("dataGrid-defOrder", null);
const columnTypeCheckboxOnChange = inject("columnTypeCheckboxOnChange", () => {});
const column = ref(null);

// const id = useId();

const id = dataGrid.columns.length;
const instance = getCurrentInstance();

const def = new ColumnDef({
    className: props.className,
    data: props.data,
    label: props.label,
    labelTooltip: props.labelTooltip,
    name: props.name,
    defaultContent: props.defaultContent,
    editable: props.editable,
    entity_values: props.entityValues,
    format: props.format,
    // formatFunction: props.formatFunction,
    formatFunction: (data, cell) => {
        const cellSlot = instance.slots?.cell;
        if (cellSlot) {
            return cellSlot({ data, cell });
        } else {
            if (typeof props.formatFunction === "function") {
                return props.formatFunction(data, cell);
            } else {
                return cell._column.format.render(data, false, cell);
            }
        }
    },
    minWidth: props.minWidth,
    visible: props.visible,
    enumValues: props.enumValues,
    render: props.render,
    selectValues: props.selectValues,
    position: props.position,
    width: props.width,
    orderable: props.orderable,
    external: {
        filter: props.filter,
        preview: props.preview,
    },
    overflowPreview: props.overflowPreview,
});

if (!column.value) {
    column.value = new Column(def, dataGrid, id);

    if (props.format === "currency" && props.currency) {
        column.value.format._currency = props.currency;
        column.value.format._valueIsDecimal = props.currencyIsDecimal ?? ColumnTypeCurrency.VALUE_IS_DECIMAL;
        column.value.format._decimals = props.decimals ?? ColumnTypeCurrency.DECIMALS;
    }

    if (props.format === "gallery" && props.imgPath) {
        column.value.format._imagePath = props.imgPath;
    }

    if (props.format === "checkbox") {
        column.value.format._onChange = columnTypeCheckboxOnChange;
    }

    column.value.enumValues = props.enumValues;
    dataGrid.columns.push(column.value);

    if (defOrder) {
        if (typeof defOrder === "string") {
            const col = defOrder.startsWith("-") ? defOrder.slice(1) : defOrder;
            if (col === column.value.data) {
                column.value.order = defOrder.startsWith("-") ? DataGrid.ORDER_DESC : DataGrid.ORDER_ASC;
            }
        } else {
            if (defOrder.column === column.value.data) {
                column.value.order = defOrder.dir === DataGrid.ORDER_ASC ? DataGrid.ORDER_ASC : DataGrid.ORDER_DESC;
            }
        }
    }
}

onMounted(() => {
    const exists = dataGrid.columns.find((item) => item.id === column.value.id);

    if (!exists) {
        dataGrid.columns.push(column.value);
    }
    // if(!column.value){
    //     column.value = new Column(columnDef.value, dataGrid, id);
    //     dataGrid.columns.push(column.value);
    // }
});

onUnmounted(() => {
    dataGrid.columns = dataGrid.columns.filter((item) => item.id !== column.value.id);
});

watch(
    () => props.label,
    (newVal) => {
        column.value.label = newVal;
    },
);

watch(
    () => props.labelTooltip,
    (newVal) => {
        column.value.labelTooltip = newVal;
    },
);

watch(
    () => props.className,
    (newVal) => {
        column.value.className = newVal;
    },
);

watch(
    () => ({
        className: props.className,
        data: props.data,
        label: props.label,
        labelTooltip: props.labelTooltip,
        name: props.name,
        defaultContent: props.defaultContent,
        editable: props.editable,
        entity_values: props.entityValues,
        format: props.format,
        // formatFunction: props.formatFunction,
        minWidth: props.minWidth,
        visible: props.visible,
        render: props.render,
        selectValues: props.selectValues,
        position: props.position,
        width: props.width,
        orderable: props.orderable,
        filter: props.filter,
        preview: props.preview,
        overflowPreview: props.overflowPreview,
    }),
    (newProps, oldValue) => {
        if (newProps !== oldValue && column.value) {
            const tmp = { ...newProps };

            if (oldValue.format !== newProps.format) {
                const setting = {};

                const format = tmp.format;

                if (format === "currency") {
                    setting.currency = props.currency;
                    setting.valueIsDecimal = props.currencyIsDecimal ?? ColumnTypeCurrency.VALUE_IS_DECIMAL;
                    setting.decimals = props.decimals ?? ColumnTypeCurrency.DECIMALS;
                }

                if (format === "gallery") {
                    setting.imagePath = props.imgPath;
                }

                if (props.format === "checkbox") {
                    setting.onChange = columnTypeCheckboxOnChange;
                }

                tmp.format = Column.getColumnTypeInstance(column.value, format, setting);
            } else {
                delete tmp.format;
            }

            if (typeof tmp.position === "undefined") {
                delete tmp.position;
            }

            column.value.external.filter = newProps.filter;
            column.value.external.preview = newProps.preview;

            delete tmp.filter;
            delete tmp.preview;

            Object.assign(column.value, tmp);
        }
    },
);

watch(
    () => props.filter,
    (newVal) => {
        column.value.external.filter = newVal;
    },
);

// watch(async () => props.enumValues, (newVal) => {
//     if(column.value){
//         column.value.enumValues = props.enumValues;
//     }
//     // column.value.enumValues = newVal;
// })
</script>

<template></template>
