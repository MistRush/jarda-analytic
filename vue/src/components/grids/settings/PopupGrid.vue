<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import { object, string } from "yup";

const gridRef = ref(null);
const { grid: popupGrid } = useGrid('popupGrid');

const onEshopIDChange = async (value) => {
  popupGrid.value.ajax.state.Eshop_ID = value;
  popupGrid.value.refresh();
};

const schema = object({
  Eshop_ID: string().required(),
  Header: string().required(),
});
</script>

<template>
  <div>
    <div class="row mb-[20px]">
      <Select name="Eshop_ID" label="Eshop" @change="onEshopIDChange" :manager="{ store: { module: 'common', controller: 'eshop', }, }" class="col-4" />
    </div>

    <DataGrid
        id="popupGrid"
        :manager="{
              store: 'admin/popup',
          }"
        ref="gridRef"
        :search="{
              column: ['Header'],
              placeholder: 'Vyhledat popup podle názvu',
          }"
        fetchData
        title="Popup"
        order="ID"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Active" label="Aktivní" format="checkbox" />
        <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
        <Column data="Header" label="Hlavička" width="200" />
      </template>

      <template #editorDialog="{id}">
        <Editor v-bind="props" manager="admin/popup" :id="id" :schema="schema" backURL="admin/settings/popup" labelField="Header" name="Popup">
          <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.Header }} </template>
          <template #titleCreate> {{ "Vytvořit záznam" }} </template>
          <template #default="{ data }">
            <EditorTab title="Základní informace">
              <EditorGroup container row title="Základní informace">
                <Select
                    name="Eshop_ID"
                    label="Eshop"
                    v-model="data.Eshop_ID"
                    :manager="{
                            store: {
                                module: 'common',
                                controller: 'eshop',
                            },
                        }"
                    class="col-12"
                />
                <InputField name="Header" label="Hlavička" v-model="data.Header" class="col-12" :showClear="true" />
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