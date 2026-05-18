<script setup>
import { ref } from "vue";
import { object, string } from "yup";

const gridRef = ref(null);

const schema = object({
  Name: string().required(),
  Value: string().required(),
});
</script>

<template>
  <div>
    <DataGrid
        id="vatGrid"
        :manager="{
              store: 'admin/vat',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat daňové pravidlo podle názvu',
          }"
        title="Daňové pravidla"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název" width="200" />
        <Column data="Value" label="Hodnota" width="200" format="percent" />
      </template>

      <template #editorDialog="{id}">
        <Editor v-bind="props" manager="admin/vat" :id="id" :schema="schema" backURL="admin/settings/vat" labelField="Name" name="Daňové pravidlo">
          <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.Name }} </template>
          <template #titleCreate> {{ "Vytvořit záznam" }} </template>
          <template #default="{ data }">
            <EditorTab title="Základní informace">
              <EditorGroup container row title="Základní informace">
                <InputField name="Name" label="Název" v-model="data.Name" class="col-12" :showClear="true" />
                <InputField name="Value" label="Hodnota" type="number" v-model="data.Code" class="col-12" :showClear="true" />
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