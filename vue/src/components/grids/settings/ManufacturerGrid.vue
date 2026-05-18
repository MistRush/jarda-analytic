<script setup>
import { ref } from "vue";

const gridRef = ref(null);
</script>

<template>
  <div>
    <DataGrid
        id="manufacturerGrid"
        :manager="{
              store: 'admin/manufacturer',
          }"
        ref="gridRef"
        :search="{
              column: ['Headline'],
              placeholder: 'Vyhledat výrobce',
          }"
        fetchData
        title="Výrobci"
        editorURL="admin/settings/edit-manufacturer"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název výrobce" width="200" />
        <Column data="FileName" label="Soubor" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>