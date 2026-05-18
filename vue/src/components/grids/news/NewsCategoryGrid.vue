<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import Action from "@/DataGrid/Components/Action/Action.vue";
import { useAlerts } from '@/Composables/useAlerts.js';

const gridRef = ref(null);
const { grid: newsCategoryGrid } = useGrid('newsCategoryGrid');
const alerts = useAlerts();

const showNewsCategory = () => {
  const selected = newsCategoryGrid.value?.getCurrentItem();
  if (selected) {
    window.open('/blog/kategorie/' + selected.slugCZ);
  } else {
    alerts.alert('Zobrazit kategorii blogu', 'error', 'Nejprve prosím vyberte kategorii blogu');
  }
}
</script>
<template>
  <div>
    <DataGrid
        id="newsCategoryGrid"
        :manager="{
              store: 'admin/news-category',
          }"
        ref="gridRef"
        :search="{
              column: ['NameCZ'],
              placeholder: 'Vyhledat kategorii blogu',
          }"
        fetchData
        title="Kategorie blogu"
        editorURL="admin/news/edit-news-category"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="FullFileName" label="Náhled" width="75" :filter="false" format="gallery" />
        <Column data="NameCZ" label="Název" width="300" />
        <Column data="ParentNameCZ" label="Název nadkategorie" width="300" />
      </template>

      <template #actions>
        <Action label="Zobrazit kategorii blogu" @click="showNewsCategory" icon="search" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>