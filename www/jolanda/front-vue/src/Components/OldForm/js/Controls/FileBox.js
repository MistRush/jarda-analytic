import FormControl from './FormControl';
import ControlPart from "./Parts/ControlPart";
import {reactive} from "vue";

export default class FileBox extends FormControl {
    fileUploadUrl;

    constructor(superInstance, name, label = null, fileUploadUrl = { module: 'common', controller: 'file', action: 'upload' }, multi = false) {
        super(superInstance, name, label);
        this.fileUploadUrl = fileUploadUrl;

        // Create input element for file upload
        this.controlPart = reactive(new ControlPart('input'));
        this.controlPart.setAttribute('type', 'file');
        this.controlPart.setClass(['form-control', 'custom-file-input']);

        // Set multiple attribute if multi file upload is enabled
        if (multi) {
            this.controlPart.setAttribute('multiple', 'multiple');
        }

        // Set data-url attribute if fileUploadUrl is provided
        if (fileUploadUrl) {
            let url = `${fileUploadUrl.module}/${fileUploadUrl.controller}/${fileUploadUrl.action}?null=null`;
            delete fileUploadUrl.module;
            delete fileUploadUrl.controller;
            delete fileUploadUrl.action;

            for (const [key, value] of Object.entries(fileUploadUrl)) {
                url += `&${key}=${value}`;
            }
            this.controlPart.setAttribute('data-url', url);
        }
    }

    addRule(validator, message, params = null) {
        // Implementation for adding validation rule
    }

    setRequired(required = true, message = 'This field is required') {
        // Implementation for setting required attribute
    }
}