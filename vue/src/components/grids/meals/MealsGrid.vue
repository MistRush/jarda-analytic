<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import Action from "@/DataGrid/Components/Action/Action.vue";
import { useAlerts } from '@/Composables/useAlerts.js';

const gridRef = ref(null);
const { grid: mealsGrid } = useGrid('mealsGrid');
const alerts = useAlerts();

</script>
<template>
  <div>
    <DataGrid
        id="mealsGrid"
        :manager="{
              store: 'admin/custom-meal',
          }"
        ref="gridRef"
        :search="{
              column: ['NameCZ'],
              placeholder: 'Vyhledat jídlo',
          }"
        fetchData
        title="Seznam jídel"
        editorURL="admin/meals/edit-meals"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Name" label="Název" width="300" />
        <Column data="Type" label="Typ" width="300" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>