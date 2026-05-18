<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });
</script>

<template>
  <div>
    <DataGrid
      id="logCartGrid"
      :manager="{
            store: 'admin/cart-log',
        }"
      ref="gridRef"
      title="Log košíku"
      :order="{
        column: 'ID',
        dir: 'desc'
      }"
      :enabled-actions="{
        add: false,
        edit: false,
        remove: false,
      }"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="UserName" label="Uživatel" width="200" />
        <Column data="ProductName" label="Produkt" width="200" />
        <Column data="Date" label="Datum" width="200" format="date" />
        <Column data="Time" label="Čas" width="200" />
        <Column data="IPAddress" label="IP Addresa" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>