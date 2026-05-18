<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });
</script>

<template>
  <div>
    <DataGrid
        id="orderSimpleGrid"
        :manager="{
              store: 'admin/order',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat záznam',
          }"
        title="Seznam objednávek"
        order="ID"
        :enabled-actions="{
            add: false,
            edit: false,
            remove: false,
        }"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="OrderNumber" label="Číslo objednávky" width="200" />
        <Column data="Date" label="Datum" width="200" format="date" />
        <Column data="Time" label="Čas" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>