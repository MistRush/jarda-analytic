<script setup>
import { onMounted, reactive } from "vue";
import FormMapper from "../js/FormMapper";
import FormGroup from "./Controls/FormGroup.vue";

const props = defineProps({
    json: String,
    form: Object,
});

const form = reactive(!props.form ? FormMapper.map(props.json) : props.form);

onMounted(() => {
    window[form.id] = new Form(form.id);
});
</script>

<template>
    <form v-bind="form.getElement().attributes" :id="form.id">
        <FormGroup v-for="group in form.getFormGroups()" :formGroup="group" :key="group.id" />
        <div class="form-group" v-for="(button, index) in form.buttons" :key="index">
            <button v-bind="button.attributes">{{ button.content }}</button>
        </div>
    </form>
</template>
