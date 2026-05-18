<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
const { grid: bannerGrid } = useGrid('bannerGrid');

const gridRef = ref(null);

const props = defineProps({
  banerFileName: String,
});

const emit = defineEmits(['onRowSelect']);

const onEshopIDChange = async (value) => {
  bannerGrid.value.ajax.state.Eshop_ID = value;
  bannerGrid.value.refresh();
};

const onRowSelect = async (event, row) => {
  emit('onRowSelect', row)
};
</script>

<template>
  <div>
    <div class="row mb-[20px]">
      <Select name="Eshop_ID" label="Eshop" @change="onEshopIDChange" :manager="{ store: { module: 'common', controller: 'eshop', }, }" class="col-4" />
    </div>

    <DataGrid
        id="bannerGrid"
        :manager="{
          store: 'admin/banner',
        }"
        ref="gridRef"
        :search="{
              column: ['Headline'],
              placeholder: 'Vyhledat banner',
          }"
        fetchData
        title="Bannery"
        editorURL="admin/settings/edit-banner"
        order="ID"
        @rowSelect="onRowSelect"

        :rowReorder="{
          column: 'Rank',
          tableColumns: [
            {
              data: 'ID',
              label: 'ID',
            },
            {
              data: 'Headline',
              label: 'Název banneru',
            },
          ],
        }"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
        <Column data="Active" label="Aktivní" format="checkbox" />
        <Column data="Rank" label="Pořadí" :editable="true" />
        <Column data="Headline" label="Název banneru" width="200" />
        <Column data="Subline" label="Podtext" width="200" />
        <Column data="Url" label="URL" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>