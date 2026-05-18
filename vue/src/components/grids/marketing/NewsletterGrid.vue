<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";

const gridRef = ref(null);
const { grid: newsletterGrid } = useGrid('newsletterGrid');

const onEshopIDChange = async (value) => {
  newsletterGrid.value.ajax.state.Eshop_ID = value;
  newsletterGrid.value.refresh();
};
</script>

<template>
  <div>
    <div class="row mb-[20px]">
      <Select name="Eshop_ID" label="Eshop" @change="onEshopIDChange" :manager="{ store: { module: 'common', controller: 'eshop', }, }" class="col-4" />
    </div>

    <DataGrid
      id="newsletterGrid"
      :manager="{
        store: 'admin/newsletter-subscriber',
      }"
      ref="gridRef"
      :search="{
        column: ['Name', 'Email'],
        placeholder: 'Vyhledat registrovaného',
      }"
      fetchData
      title="Přihlášení k newsletteru"
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
        <Column data="Active" label="Aktivní" format="checkbox" />
        <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
        <Column data="Date" label="Datum" format="date" />
        <Column data="Time" label="Čas" format="time" />
        <Column data="Subscriber" label="E-mail" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>