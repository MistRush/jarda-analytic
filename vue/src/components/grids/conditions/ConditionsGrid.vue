<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import Action from "@/DataGrid/Components/Action/Action.vue";
import { useAlerts } from '@/Composables/useAlerts.js';

const gridRef = ref(null);
const { grid: conditionsGrid } = useGrid('conditionsGrid');
const alerts = useAlerts();

</script>
<template>
  <div>
    <DataGrid
        id="conditionsGrid"
        :manager="{
              store: 'admin/condition',
          }"
        ref="gridRef"
        :search="{
              column: ['NameCZ'],
              placeholder: 'Vyhledat podmínku',
          }"
        fetchData
        title="Seznam podmínek"
        editorURL="admin/conditions/edit-conditions"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název" width="300" />
        <Column data="Active" label="Aktivní" width="300" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>