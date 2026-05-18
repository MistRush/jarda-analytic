<script setup>
import { ref } from "vue";
import { useAnnouncement } from "@project/composables/models/announcement/useAnnouncement.js";
import { useGrid } from "@/DataGrid/js/useGrid.js";

const gridRef = ref(null);
const announcement = useAnnouncement();
const { grid: announcementGrid } = useGrid('announcementGrid');

const onEshopIDChange = async (value) => {
  announcementGrid.value.ajax.state.Eshop_ID = value;
  announcementGrid.value.refresh();
};
</script>

<template>
  <div>
    <div class="row mb-[20px]">
      <Select name="Eshop_ID" label="Eshop" @change="onEshopIDChange" :manager="{ store: { module: 'common', controller: 'eshop', }, }" class="col-4" />
    </div>

    <DataGrid
        id="announcementGrid"
        :manager="{
              store: 'admin/announcement',
          }"
        ref="gridRef"
        :search="{
              column: ['Hash', 'Type', 'Content'],
              placeholder: 'Vyhledat oznámení dle Hashe/Typu/Obsahu',
          }"
        fetchData
        title="Oznámení"
        editorURL="admin/settings/edit-announcement"
        order="ID"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Hash" label="Hash" width="200" />
        <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
        <Column data="Active" label="Aktivní" format="checkbox" />
        <Column data="DateFrom" label="Zobrazit od" format="date" />
        <Column data="DateTo" label="Zobrazit do" format="date" />
        <Column data="Type" label="Typ" format="enum" :enumValues="announcement.getTypes()" width="200" :editable="true" />
        <Column data="Content" label="Obsah" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>