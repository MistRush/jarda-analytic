<script setup>
import { ref } from "vue";
import { object, string } from "yup";

const gridRef = ref(null);

const schema = object({
  Name: string().required(),
  Code: string().required(),
});
</script>

<template>
  <div>
    <DataGrid
        id="languageGrid"
        :manager="{
              store: 'common/language',
          }"
        ref="gridRef"
        :search="{
              column: ['Name', 'Code'],
              placeholder: 'Vyhledat jazyk podle názvu, kódu',
          }"
        title="Jazyk"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název" width="200" />
        <Column data="Code" label="Kód" width="200" />
      </template>

      <template #editorDialog="{id}">
        <Editor v-bind="props" manager="common/language" :id="id" :schema="schema" backURL="admin/settings/language" labelField="Name" name="Jazyk">
          <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.Name }} </template>
          <template #titleCreate> {{ "Vytvořit záznam" }} </template>
          <template #default="{ data }">
            <EditorTab title="Základní informace">
              <EditorGroup container row title="Základní informace">
                <InputField name="Name" label="Název" v-model="data.Name" class="col-12" :showClear="true" />
                <InputField name="Code" label="Kód" v-model="data.Code" class="col-12" :showClear="true" />
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