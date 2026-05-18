<script setup>
import FormGroup from "../../js/Controls/FormGroup";
import FormControl from "./FormControl.vue";

const props = defineProps({
    formGroup: FormGroup
});
</script>

<template>
    <div class="row form-group">
        <div v-if="formGroup.label != null" class="col-12">
            <h2>{{formGroup.label}}</h2>
        </div>
        <FormControl v-for="control in formGroup.getFormControls()" :formControl="control" :key="control.name + '_group'"/>
    </div>
</template>