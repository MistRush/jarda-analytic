<script setup>
import { ref } from "vue";
import { object, string } from "yup";
const gridRef = ref(null);

const schema = object({
  Eshop_ID: string().required(),
  Header: string().required(),
});
</script>

<template>
  <div>
    <DataGrid
        id="blockGrid"
        :manager="{
              store: 'admin/block',
          }"
        ref="gridRef"
        :search="{
              column: ['Name', 'Code'],
              placeholder: 'Vyhledat HTML blok podle názvu/kódu',
          }"
        fetchData
        title="HTML blok"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název" width="200" />
        <Column data="Code" label="Kód" width="200" />
      </template>

      <template #editorDialog="{id}">
        <Editor v-bind="props" manager="admin/block" :id="id" :schema="schema" backURL="admin/settings/block" labelField="Name" name="HTML blok">
          <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.Name }} </template>
          <template #titleCreate> {{ "Vytvořit záznam" }} </template>
          <template #default="{ data }">
            <EditorTab title="Základní informace">
              <EditorGroup container row title="Základní informace">
                <InputField name="Name" label="Hlavička" v-model="data.Name" class="col-12" :showClear="true" />
                <InputField name="Code" label="Kód" v-model="data.Code" class="col-12" :showClear="true" />
                <TextArea name="Content" v-model="data.Content" label="Obsah sdělení" class="col-12" :rows="12" />
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