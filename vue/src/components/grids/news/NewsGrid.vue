<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import Action from "@/DataGrid/Components/Action/Action.vue";
import { useAlerts } from '@/Composables/useAlerts.js';

const gridRef = ref(null);
const { grid: newsGrid } = useGrid('newsGrid');
const alerts = useAlerts();

const showNewsCategory = () => {
  const selected = newsGrid.value?.getCurrentItem();

  if (selected) {
    window.open('/blog/' + selected.slug);
  } else {
    alerts.alert('Zobrazit blog', 'error', 'Nejprve prosím vyberte blog');
  }
}
</script>
<template>
  <div>
    <DataGrid
        id="newsGrid"
        :manager="{
              store: 'admin/news',
          }"
        ref="gridRef"
        :search="{
              column: ['NameCZ'],
              placeholder: 'Vyhledat článek blogu',
          }"
        fetchData
        title="Seznam článků blogu"
        editorURL="admin/news/edit-news"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="FullFileName" label="Náhled" width="75" :filter="false" format="gallery" />
        <Column data="Headline" label="Název" width="300" />
        <Column data="NewsCategoryName" label="Název kategorie" width="300" />
      </template>

      <template #actions>
        <Action label="Zobrazit kategorii blogu" @click="showNewsCategory" icon="search" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>