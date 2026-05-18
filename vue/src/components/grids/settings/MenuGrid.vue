<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });
</script>

<template>
  <div>
    <DataGrid
        id="menuGrid"
        :manager="{
              store: 'admin/menu',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat záznam',
          }"
        fetchData
        title="Menu"
        order="ID"
        :enabled-actions="{
            add: false,
            edit: false,
            remove: false,
        }"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název" width="200" />
        <Column data="Type" label="Typ" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>