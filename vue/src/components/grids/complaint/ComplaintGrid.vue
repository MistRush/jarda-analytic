<script setup>
import { ref } from "vue";

const gridRef = ref(null);
</script>

<template>
  <div>
    <DataGrid
      id="customerGrid"
      :manager="{
            store: 'admin/complaint',
        }"
      ref="gridRef"
      :search="{
            column: ['Name', 'Email', 'Phone'],
            placeholder: 'Vyhledat reklamaci',
        }"
      fetchData
      title="Seznam reklamací"
      editorURL="admin/complaint/edit-complaint"
      order="ID"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název účtu" width="150" />
        <Column data="Email" label="Email" width="150" />
        <Column data="Phone" label="Telefon" width="150" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>