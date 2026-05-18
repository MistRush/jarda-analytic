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
        id="permissionGrid"
        :manager="{
              store: 'user/permission',
          }"
        ref="gridRef"
        :search="{
              column: ['Name', 'Code'],
              placeholder: 'Vyhledat oprávnění podle názvu nebo kódu',
          }"
        title="Oprávnění"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název" width="200" />
        <Column data="Code" label="Kód" width="200" />
      </template>

      <template #editorDialog="{id}">
        <Editor v-bind="props" manager="user/permission" :id="id" :schema="schema" backURL="admin/settings/permission" labelField="Name" name="Oprávnění">
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