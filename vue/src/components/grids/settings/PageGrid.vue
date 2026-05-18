<script setup>
import { ref } from "vue";
import { useTranslations } from "@/Composables/useTranslation.js";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import Action from '@/DataGrid/Components/Action/Action.vue'
import { useAlerts } from '@/Composables/useAlerts.js';

const { locale } = useTranslations();
const gridRef = ref(null);
const { grid: pageGrid } = useGrid('pageGrid');
const alerts = useAlerts();

const showPage = () => {
  const selected = pageGrid.value?.getCurrentItem();
  if (selected) {
    window.open('/page/' + selected.slugCZ);
  } else {
    alerts.alert('Zobrazit stránku', 'error', 'Nejprve prosím vyberte stránku');
  }
}
</script>

<template>
  <div>
    <DataGrid
        id="pageGrid"
        :manager="{
              store: 'admin/page',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat stránku',
          }"
        fetchData
        title="Oznámení"
        editorURL="admin/settings/edit-page"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column :data="`Name${locale.Code}`" label="Obsah" width="200" />
        <Column :data="`slug${locale.Code}`" label="URL" width="200" />
      </template>

      <template #actions>
        <Action label="Zobrazit stránku" @click="showPage" icon="search" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>