<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });
</script>

<template>
  <div>
    <DataGrid
        id="parameterGrid"
        :manager="{
              store: 'admin/parameter',
          }"
        ref="gridRef"
        :search="{
              column: ['NameCZ'],
              placeholder: 'Vyhledat záznam',
          }"
        fetchData
        title="Parametry"
        order="ID"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="ToFilter" label="Parametrické filtrování" format="checkbox" width="120" />
        <Column data="NameCZ" label="Název parameteru" width="200" />
        <Column data="Unit" label="Jednotka" width="200" />
        <Column data="FilterType" label="Typ filtru" width="200" format="enum" :enumValues="fetchedData.filterTypes" />
      </template>
      <template #editorDialog="{ id }">
        <Editor v-bind="props" manager="admin/parameter" :id="id" :schema="schema" backURL="admin/settings/parameter" labelField="NameCZ" name="Parametr" fetchData >
          <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.NameCZ }} </template>
          <template #titleCreate> {{ "Vytvořit záznam" }} </template>
          <template #default="{ data, fetchedData }">
            <EditorTab title="Základní informace">
              <EditorGroup container row title="Základní informace">
                <Checkbox v-model="data.ToFilter" label="Parametrické filtrování" class="col-12" />
                <InputField name="NameCZ" label="Název parameteru" v-model="data.NameCZ" class="col-12" :showClear="true" />
                <InputField name="Unit" label="Jednotka" v-model="data.Unit" class="col-12" :showClear="true" />
                <Select name="FilterType" v-model="data.FilterType" label="Typ filtru" :options="fetchedData.filterTypes" class="col-12" />
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