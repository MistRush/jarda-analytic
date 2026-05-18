<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import Action from "@/DataGrid/Components/Action/Action.vue";
import { useAlerts } from '@/Composables/useAlerts.js';

const gridRef = ref(null);
const { grid: recomendationsGrid } = useGrid('recomendationsGrid');
const alerts = useAlerts();

</script>
<template>
  <div>
    <DataGrid
        id="recomendationsGrid"
        :manager="{
              store: 'admin/recomendation',
          }"
        ref="gridRef"
        :search="{
              column: ['NameCZ'],
              placeholder: 'Vyhledat doporučení',
          }"
        fetchData
        title="Seznam doporučení"
        editorURL="admin/recomendations/edit-recomendations"
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