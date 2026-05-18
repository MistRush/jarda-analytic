import { ColumnType } from "./ColumnType";
import { ColumnDef } from "../../Settings/ColumnDef";
import { useHelper } from "@/Composables/useHelper";

export class ColumnTypeCurrency extends ColumnType {
    static CURRENCY_CZK = "CZK";
    static CURRENCY_EUR = "EUR";
    static CURRENCY_USD = "USD";
    static CURRENCY_GBP = "GBP";
    static CURRENCY_PLN = "PLN";

    static MARK_CZK = "Kč";
    static MARK_EUR = "€";
    static MARK_USD = "$";
    static MARK_GBP = "£";
    static MARK_PLN = "zł";

    static CURRENCY_ENUM = {
        [ColumnTypeCurrency.CURRENCY_CZK]: ColumnTypeCurrency.MARK_CZK,
        [ColumnTypeCurrency.CURRENCY_EUR]: ColumnTypeCurrency.MARK_EUR,
        [ColumnTypeCurrency.CURRENCY_USD]: ColumnTypeCurrency.MARK_USD,
        [ColumnTypeCurrency.CURRENCY_GBP]: ColumnTypeCurrency.MARK_GBP,
        [ColumnTypeCurrency.CURRENCY_PLN]: ColumnTypeCurrency.MARK_PLN,
    };

    static VALUE_IS_DECIMAL = true;
    static DECIMALS = 2;

    static _format = ColumnDef.COLUMN_TYPE_CURRENCY;

    _currency;
    _valueIsDecimal;
    _decimals;

    _helper = useHelper();

    constructor(column, setting) {
        super(column);

        this._currency = setting?.currency ?? ColumnTypeCurrency.CURRENCY_CZK;
        this._valueIsDecimal = setting?.valueIsDecimal ?? ColumnTypeCurrency.VALUE_IS_DECIMAL;
        this._decimals = setting?.decimals ?? ColumnTypeCurrency.DECIMALS;
    }

    render(data, onlyData = false, cell) {
        return this._helper.formatPrice(this._valueIsDecimal ? data : data / 100, this._decimals) + " " + ColumnTypeCurrency.CURRENCY_ENUM[this._currency];
    }

    get editor() {
        return "number";
    }
}
