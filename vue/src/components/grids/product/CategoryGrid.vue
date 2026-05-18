<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import Action from "@/DataGrid/Components/Action/Action.vue";
import { useAlerts } from '@/Composables/useAlerts.js';

const gridRef = ref(null);
const { grid: categoryGrid } = useGrid('categoryGrid');
const alerts = useAlerts();

const showCategory = () => {
  const selected = categoryGrid.value?.getCurrentItem();
  if (selected) {
    window.open('/c/' + selected.slugCZ);
  } else {
    alerts.alert('Zobrazit kategorii', 'error', 'Nejprve prosím vyberte kategorii!');
  }
}
</script>
<template>
  <div>
    <DataGrid
        id="categoryGrid"
        :manager="{
              store: 'admin/category',
          }"
        ref="gridRef"
        :search="{
              column: ['NameCZ'],
              placeholder: 'Vyhledat kategorii ',
          }"
        fetchData
        title="Kategorie"
        editorURL="admin/product/edit-category"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="FullFileName" label="Náhled" width="75" :filter="false" format="gallery" />
        <Column data="NameCZ" label="Název" width="300" />
        <Column data="CategoryNameCZ" label="Název nadkategorie" width="300" />
        <Column data="slugCZ" label="Odkaz na kategorii" width="300">
          <template #cell="{ data, cell }">
            <Copy :text="data" title="Zkopírovat" class="mr-[4px]" /> {{ data }}
          </template>
        </Column>
      </template>

      <template #actions>
        <Action label="Zobrazit kategorii" @click="showCategory" icon="search" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>