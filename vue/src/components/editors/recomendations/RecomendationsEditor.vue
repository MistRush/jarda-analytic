<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";

const props = defineProps({ ...editorProps });


const schema = object({
  Name: string().required(),
  Description: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/recomendation" :schema="schema" backURL="admin/recomendations/recomendations" name="Editor Doporučení" labelField="Name">
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="Základní informace">
          <InputField name="Name" label="Název" v-model="data.Name" class="col-6" />
          <Select
              v-model="data.Type"
              :options="[{ text: 'Jídlo', value: 'meal' }, { text: 'Voda', value: 'drink' }, { text: 'Spánek', value: 'sleep' }, { text: 'Kosmetika', value: 'cosmetics' }, { text: 'Fotka', value: 'photo' }, { text: 'Stres', value: 'stress' }]"
              label="Typ"
              class="col-6"
          />
          <TextArea name="Description" label="Popis" v-model="data.Description" class="col-12"  />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>