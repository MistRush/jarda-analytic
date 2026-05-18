<script setup>
import { ref } from "vue";
import { object, string } from "yup";

const gridRef = ref(null);

const schema = object({
  Name: string().required(),
  Ratio: string().required(),
  Label: string().required(),
  Mark: string().required(),
});
</script>

<template>
  <div>
    <DataGrid
        id="currencyGrid"
        :manager="{
              store: 'admin/currency',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat měnu pravidlo podle názvu',
          }"
        title="Měny"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název" width="200" />
        <Column data="Ratio" label="Kurz" width="200" />
        <Column data="Label" label="Zkratka" width="200" />
        <Column data="Mark" label="Značka" width="200" />
      </template>

      <template #editorDialog="{id}">
        <Editor v-bind="props" manager="admin/currency" :id="id" :schema="schema" backURL="admin/settings/currency" labelField="Name" name="Daňové pravidlo">
          <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.Name }} </template>
          <template #titleCreate> {{ "Vytvořit záznam" }} </template>
          <template #default="{ data }">
            <EditorTab title="Základní informace">
              <EditorGroup container row title="Základní informace">
                <InputField name="Name" label="Název" v-model="data.Name" class="col-12" :showClear="true" />
                <InputField name="Ratio" label="Kurz" v-model="data.Ratio" class="col-12" type="number" :showClear="true" />
                <InputField name="Label" label="Zkratka" v-model="data.Label" class="col-12" :showClear="true" />
                <InputField name="Mark" label="Značka" v-model="data.Mark" class="col-12" :showClear="true" />
              </EditorGroup>
            </EditorTab>
          </template>
        </Editor>
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>