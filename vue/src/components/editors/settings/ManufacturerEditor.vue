<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";

const props = defineProps({ ...editorProps });

const schema = object({
  Name: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/manufacturer" :schema="schema" backURL="admin/settings/manufacturer" name="Editor výrobců" labelField="Name">
    <template #titleUpdate="{ id, data }"> {{ "Upravit výrobce" }}: {{ data.Name }} </template>
    <template #titleCreate> {{ "Vytvořit výrobce" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup  container row title="Základní informace">
          <InputField name="Name" label="Název výrobce" v-model="data.Name" class="col-12" />
          <TextArea name="MetaDescription" label="MetaDescription" v-model="data.MetaDescription" class="col-12" :rows="4" />
          <TinyMCE name="Description" label="Content" v-model="data.Description" class="col-12" />
          <EditorFileInput
              name="File_ID"
              v-model="data.File_ID"
              label="Logo výrobce"
              uploadAttributes="manufacturer"
              :file-name="data.FileName"
              accept="image/*"
              class="col-12"
              preview
              path="/files/images/manufacturer/"
          />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>