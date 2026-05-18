<script setup>
import FormControl from "../../js/Controls/FormControl";
import TextInput from "../../js/Controls/TextInput";
import TextArea from "../../js/Controls/TextArea";
import RadioButton from "../../js/Controls/RadioButton";
import ComboBox from "../../js/Controls/ComboBox";
import FileBox from "../../js/Controls/FileBox";
import DateBox from "../../js/Controls/DateBox";
import Checkbox from "../../js/Controls/Checkbox";

const props = defineProps({
    formControl: FormControl
});

</script>

<template>
    <div
        v-bind="formControl.element.attributes"
        class="form-input-group"
        :class="{
            [' col-md-'+formControl.columnSize]: true
        }"
        :id="formControl.name + '_group'"
    >
        <label
            :for="formControl instanceof Checkbox ? null : formControl.parentForm ? formControl.parentForm.getId() + '_' + formControl.name : formControl.name"
            v-bind="formControl.labelPart.attributes"
            :class="{
                'checkbox': formControl instanceof Checkbox,
            }"
        >
            <template v-if="formControl instanceof  Checkbox">
                <input
                    v-bind="formControl.controlPart.attributes"
                    :name="formControl.name"
                    :data-validator="formControl.validators.length ? JSON.stringify(formControl.validators) : null"
                    :class="{
                        'disabled': formControl.isDisabled(),
                        'readonly': formControl.isReadOnly(),
                    }"
                    :disabled="formControl.isDisabled() ? 'disabled' : null"
                    :readonly="formControl.isReadOnly() ? 'readonly' : null"
                    :placeholder="formControl.getPlaceholder()"
                    v-model="formControl.value"
                >
                <span class="checkmark"></span>
            </template>
            {{formControl.labelPart.content}}
            <span v-if="formControl.required" class="required-char">*</span>
        </label>
        <template v-if="formControl instanceof TextInput">
            <input
                v-bind="formControl.controlPart.attributes"
                :name="formControl.name"
                :data-validator="formControl.validators.length ? JSON.stringify(formControl.validators) : null"
                :class="{
                    'disabled': formControl.isDisabled(),
                    'readonly': formControl.isReadOnly(),
                }"
                :disabled="formControl.isDisabled() ? 'disabled' : null"
                :readonly="formControl.isReadOnly() ? 'readonly' : null"
                :placeholder="formControl.getPlaceholder()"
                v-model="formControl.value"
            >
        </template>
        <template v-else-if="formControl instanceof TextArea">
            <textarea
                v-bind="formControl.controlPart.attributes"
                :name="formControl.name"
                :data-validator="formControl.validators.length ? JSON.stringify(formControl.validators) : null"
                :class="{
                    'disabled': formControl.isDisabled(),
                    'readonly': formControl.isReadOnly(),
                }"
                :disabled="formControl.isDisabled() ? 'disabled' : null"
                :readonly="formControl.isReadOnly() ? 'readonly' : null"
                :placeholder="formControl.getPlaceholder()"
                v-model="formControl.value"
            >
            </textarea>
        </template>
        <template v-else-if="formControl instanceof RadioButton">
            <div v-bind="formControl.controlPart.attributes">
                <label
                    class="radiobox"
                    v-for="(item, index) in Object.entries(formControl.items)"
                    :key="index"
                >
                    <input
                        type="radio"
                        :name="formControl.name"
                        :data-validator="formControl.validators.length ? JSON.stringify(formControl.validators) : null"
                        :value="item[0]"
                        :class="{
                            'disabled': formControl.isDisabled(),
                            'readonly': formControl.isReadOnly(),
                        }"
                        :disabled="formControl.isDisabled() ? 'disabled' : null"
                        :readonly="formControl.isReadOnly() ? 'readonly' : null"
                        :required="formControl.required ? true : null"
                        :checked="formControl.value == item[0] ? true : null"
                        @change="() => {formControl.value = item[0]}"
                    >
                    <span class="checkmark"></span>
                    <span>{{item[1]}}</span>
                </label>
            </div>
        </template>
        <template v-else-if="formControl instanceof ComboBox">
            <select
                v-bind="formControl.controlPart.attributes"
                :name="formControl.name"
                :data-validator="formControl.validators.length ? JSON.stringify(formControl.validators) : null"
                :class="{
                    'disabled': formControl.isDisabled(),
                    'readonly': formControl.isReadOnly(),
                }"
                :disabled="formControl.isDisabled() ? 'disabled' : null"
                :readonly="formControl.isReadOnly() ? 'readonly' : null"
                :required="formControl.required ? true : null"
                :data-editable="formControl.editable ? 'true' : null"
                v-model="formControl.value"
            >
                <option
                    v-for="(option, index) in Object.entries(formControl.enumValues)"
                    :key="option[0]"
                    :value="option[0]"
                    :selected="option[0] == formControl.value"
                >
                    {{option[1]}}
                </option>
            </select>
        </template>
        <template v-else-if="formControl instanceof FileBox">
            <div class="custom-file">
                <input
                    v-bind="formControl.controlPart.attributes"
                    :name="formControl.name"
                    :data-validator="formControl.validators.length ? JSON.stringify(formControl.validators) : null"
                    :class="{
                        'disabled': formControl.isDisabled(),
                        'readonly': formControl.isReadOnly(),
                    }"
                    :disabled="formControl.isDisabled() ? 'disabled' : null"
                    :readonly="formControl.isReadOnly() ? 'readonly' : null"
                    :placeholder="formControl.getPlaceholder()"
                    v-model="formControl.value"
                >
                <label class="custom-file-label">Vyberte soubor</label>
            </div>
        </template>
        <template v-else-if="formControl instanceof DateBox">
            <input
                v-bind="formControl.controlPart.attributes"
                :name="formControl.name"
                :data-validator="formControl.validators.length ? JSON.stringify(formControl.validators) : null"
                :class="{
                    'disabled': formControl.isDisabled(),
                    'readonly': formControl.isReadOnly(),
                }"
                :disabled="formControl.isDisabled() ? 'disabled' : null"
                :readonly="formControl.isReadOnly() ? 'readonly' : null"
                :placeholder="formControl.getPlaceholder()"
                v-model="formControl.value"
            >
        </template>
    </div>
</template>