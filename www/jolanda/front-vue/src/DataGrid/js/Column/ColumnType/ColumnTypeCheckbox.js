import { ColumnType } from "./ColumnType";
import { ColumnDef } from "../../Settings/ColumnDef";
import { useTranslations } from "@/Composables/useTranslation.js";
import { h } from "vue";
import Checkbox from "@/Components/Inputs/Checkbox.vue";

export class ColumnTypeCheckbox extends ColumnType {
    _format = ColumnDef.COLUMN_TYPE_CHECKBOX;
    _onChange = () => {};

    constructor(column, setting) {
        super(column);

        if (setting?.onChange) {
            this._onChange = setting.onChange;
        }
    }

    render(data, onlyData = false, cell) {
        const { translations } = useTranslations();

        if (onlyData) return data === "1" || data === true ? translations.YES : translations.NO;

        return h(Checkbox, {
            modelValue: data,
            label: data === "1" || data === true ? translations.YES : translations.NO,
            onChange: (newData) => {
                cell._row.data()[cell._column.data] = newData;
                this._onChange(newData, cell);
            },
        });
    }

    get editor() {
        return "checkbox";
    }
}
