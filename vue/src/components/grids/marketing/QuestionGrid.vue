<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";

const gridRef = ref(null);
const { grid: questionGrid } = useGrid('questionGrid');

const onEshopIDChange = async (value) => {
  questionGrid.value.ajax.state.Eshop_ID = value;
  questionGrid.value.refresh();
};
</script>

<template>
  <div>
    <div class="row mb-[20px]">
      <Select name="Eshop_ID" label="Eshop" @change="onEshopIDChange" :manager="{ store: { module: 'common', controller: 'eshop', }, }" class="col-4" />
    </div>

    <DataGrid
      id="questionGrid"
      :manager="{
        store: 'admin/question',
      }"
      ref="gridRef"
      :search="{
        column: ['Name', 'Email'],
        placeholder: 'Vyhledat dotaz',
      }"
      fetchData
      title="Dotazy z formuláře"
      :order="{
        column: 'ID',
        dir: 'desc'
      }"
      preview
      :enabled-actions="{
        add: false,
        edit: false,
        remove: false,
      }"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
        <Column data="Date" label="Datum" format="date" />
        <Column data="Time" label="Čas" format="time" />
        <Column data="Name" label="Jméno" width="200" />
        <Column data="Email" label="Email" width="200" />
        <Column data="Phone" label="Telefon" width="200" />
        <Column data="Description" label="Dotaz" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>