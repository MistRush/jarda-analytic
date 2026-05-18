<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });
</script>

<template>
  <div>
    <DataGrid
      id="logApiGrid"
      :manager="{
            store: 'admin/api-log',
        }"
      ref="gridRef"
      title="Log API"
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
        <Column data="User" label="Uživatel" width="200" />
        <Column data="DateTime" label="Datum a čas" width="200" type="date" />
        <Column data="Url" label="Url" width="200" />
        <Column data="StatusCode" label="Status" width="200" />
        <Column data="Message" label="Zpráva" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>