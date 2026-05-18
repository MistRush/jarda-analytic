import FormControl from './FormControl';
import ControlPart from "./Parts/ControlPart";
import {reactive} from "vue";

export default class DateBox extends FormControl {
    static TYPE_DATE = 'datepicker';
    static TYPE_DATETIME = 'datetimepicker';
    static TYPE_TIME = 'timepicker';
    static TYPE_TIME_H = 'timepickerH';
    static TYPE_TIME_HM = 'timepickerHM';
    static TYPE_TIME_HMS = 'timepickerHMS';

    constructor(superInstance, name, label = null, required = false, type = DateBox.TYPE_DATE) {
        super(superInstance, name, label);

        // Create input element for file upload
        this.controlPart = reactive(new ControlPart('input'));
        this.controlPart.setAttribute('type', 'text');
        this.controlPart.setClass(['form-control', type]);
        this.controlPart.setAttribute('data-'+type, true);

        if(required){
            this.setRequired();
        }
    }

    setValue(value) {
        super.setValue(value);
        this.controlPart.setAttribute('value', value);

        return this;
    }
}