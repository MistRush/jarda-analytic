<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });
</script>

<template>
  <div>
    <DataGrid
      id="logSearchGrid"
      :manager="{
            store: 'admin/search-log',
        }"
      ref="gridRef"
      title="Log vyhledávání"
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
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Date" label="Datum" width="200" format="date" />
        <Column data="Time" label="Čas" width="200" />
        <Column data="UserName" label="Uživatel" width="200" />
        <Column data="SearchTerm" label="Hledaný výraz" width="400" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>