<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";

const props = defineProps({ ...editorProps });

const schema = object({
  Name: string().required(),
  Parameter: string().required(),
  Type: string(),
  Value: string().required(),
  Comparison: string().required(),
  Description: string().required(),
});

const typeOptions = {
  meal: [
    { text: 'Bílkoviny', value: 'proteins' },
    { text: 'Kalorie', value: 'calories' },
    { text: 'Sacharidy', value: 'carbs' },
    { text: 'Tuky', value: 'fats' }
  ],
  drink: [
    { text: 'Mililitry', value: 'ml' },
    { text: 'Cukry', value: 'sugars' }
  ],
};

const getTypeOptions = (parameter) => {
  return typeOptions[parameter] || [];
};
</script>

<template>
  <Editor v-bind="props" manager="admin/condition" :schema="schema" backURL="admin/conditions/conditions" name="Editor Podmínek" labelField="Name">
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="základní informace">
          <InputField name="Name" label="Název" v-model="data.Name" class="col-6" />
          <Checkbox v-model="data.Active" label="Aktivní" class="col-3" />
          <Checkbox v-model="data.IsPositive" label="Kladná" class="col-3" />

          <Select
              v-model="data.Parameter"
              :options="[
                { text: 'Jídlo', value: 'meal' },
                { text: 'Pití', value: 'drink' },
                { text: 'Spánek', value: 'sleep' },
                { text: 'Kosmetika', value: 'cosmetics' },
                { text: 'Stres', value: 'stress' }
              ]"
              label="Parametr"
              class="col-6"
          />

          <Select
              v-model="data.Type"
              :options="getTypeOptions(data.Parameter)"
              :disabled="!data.Parameter || getTypeOptions(data.Parameter).length === 0"
              label="Typ"
              class="col-6"
          />

          <InputField name="Value" label="Hodnota" v-model="data.Value" class="col-3" />
          <Select
              v-model="data.Comparison"
              :options="[
                { text: 'Větší než', value: 'greater' },
                { text: 'Menší než', value: 'less' },
                { text: 'Rovno', value: 'equal' }
              ]"
              label="Porovnání"
              class="col-3"
          />
          <InputField name="Description" label="Popis" v-model="data.Description" class="col-12" />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>