import FormControl from './FormControl';
import ControlPart from "./Parts/ControlPart";
import {reactive} from "vue";

export default class Checkbox extends FormControl {
    static TYPE_DATE = 'datepicker';
    static TYPE_DATETIME = 'datetimepicker';
    static TYPE_TIME = 'timepicker';
    static TYPE_TIME_H = 'timepickerH';
    static TYPE_TIME_HM = 'timepickerHM';
    static TYPE_TIME_HMS = 'timepickerHMS';

    constructor(superInstance, name, label = null, required = false) {
        super(superInstance, name, label);

        // Create input element for file upload
        this.controlPart = reactive(new ControlPart('input'));
        this.controlPart.setAttribute('type', 'checkbox');
        this.controlPart.setClass(['form-control']);

        if(required){
            this.setRequired();
        }
    }

    setValue(value) {
        super.setValue(value);
        if(value == true){
            this.controlPart.setAttribute('checked', true);
        }else{
            this.controlPart.removeAttribute('checked');
        }


        return this;
    }
}