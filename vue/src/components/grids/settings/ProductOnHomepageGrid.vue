<script setup>
import { ref } from "vue";

const gridRef = ref(null);
</script>

<template>
  <DataGrid
      :manager="{
            store: 'admin/product-on-homepage',
        }"
      ref="gridRef"
      :search="{
            column: ['Code'],
            placeholder: 'Vyhledat',
        }"
      title="Produkty na úvodní stránce"
      order="ID"
  >
    <template #columns>
      <Column data="ID" label="ID" width="50" />
      <Column data="Rank" label="Pořadí" width="200" :editable="true" />
      <Column data="FullName" label="Název produktu" width="350" />
    </template>

    <template #editorDialog="{id}">
      <Editor v-bind="props" manager="admin/product-on-homepage" :id="id" :schema="schema" backURL="admin/settings/product-on-homepage" labelField="FullName" name="Editor produktu na úvodní stránce">
        <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.FullName }} </template>
        <template #titleCreate> {{ "Vytvořit záznam" }} </template>
        <template #default="{ data }">
          <EditorTab title="Základní informace">
            <EditorGroup container row title="Základní informace">
              <InputField name="Rank" label="Pořadí" v-model="data.Rank" class="col-12" type="number" :showClear="true" />
              <Select
                  name="Product_ID"
                  label="Produkt"
                  v-model="data.Product_ID"
                  remoteName="FullName"
                  filterable
                  :manager="{
                            store: {
                                module: 'admin',
                                controller: 'product',
                            },
                        }"
                  class="col-12"
              />
            </EditorGroup>
          </EditorTab>
        </template>
      </Editor>
    </template>
  </DataGrid>
</template>
<script lang="ts">
</script>