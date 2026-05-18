<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";

const props = defineProps({ ...editorProps });

const schema = object({
  Name: string().required(),
  Type: string().required(),
  Fat: string().required(),
  Carbs: string().required(),
  Protein: string().required(),
  Sugar: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/custom-meal" :schema="schema" backURL="admin/meals/meals" name="Editor jídel" labelField="Name">
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="základní informace">
          <InputField name="Name" label="Název" v-model="data.Name" class="col-6" />
          <InputField name="Type" label="Typ" v-model="data.Type" class="col-6" />
          <InputField name="Fat" label="Tuky" v-model="data.Fat" class="col-3" />
          <InputField name="Carbs" label="Sacharidy" v-model="data.Carbs" class="col-3" />
          <InputField name="Protein" label="Bílkoviny" v-model="data.Protein" class="col-3" />
          <InputField name="Sugar" label="Cukr" v-model="data.Sugar" class="col-3" />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>