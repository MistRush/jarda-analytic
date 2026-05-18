<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });
</script>

<template>
  <div>
    <DataGrid
      id="logLoginGrid"
      :manager="{
            store: 'user/login-log',
        }"
      ref="gridRef"
      title="Log přihlášení do systému"
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
        <Column data="UserName" label="Uživatel" width="200" />
        <Column data="Date" label="Date" width="150" format="date" />
        <Column data="Time" label="Čas" width="200" />
        <Column data="Type" label="Typ" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>