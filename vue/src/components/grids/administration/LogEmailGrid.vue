<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });
</script>

<template>
  <div>
    <DataGrid
      id="logEmailGrid"
      :manager="{
            store: 'admin/email-log',
        }"
      ref="gridRef"
      title="Log posilání emailů"
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
        <Column data="Subject" label="Předmět" width="200" />
        <Column data="Body" label="Obsah" width="200" format="html" />
        <Column data="Sender" label="Odesílatel" width="200" />
        <Column data="Recipients" label="Příjemce" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>