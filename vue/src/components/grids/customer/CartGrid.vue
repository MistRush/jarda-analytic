<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";

const gridRef = ref(null);
const { grid: cartGrid } = useGrid('cartGrid');

const onEshopIDChange = async (value) => {
  cartGrid.value.ajax.state.Eshop_ID = value;
  cartGrid.value.refresh();
};
</script>

<template>
  <div>
    <div class="row mb-[20px]">
      <Select name="Eshop_ID" label="Eshop" @change="onEshopIDChange" :manager="{ store: { module: 'common', controller: 'eshop', }, }" class="col-4" />
    </div>

    <DataGrid
      id="cartGrid"
      :manager="{
        store: 'admin/cart',
      }"
      ref="gridRef"
      :search="{
        column: ['user.Name', 'productLangs.Name'],
        placeholder: 'Vyhledat položku v košících',
      }"
      fetchData
      title="Nákupní košíky"
      :order="{
        column: 'ID',
        dir: 'desc'
      }"
      preview
      :enabled-actions="{
        add: false,
        edit: false,
        remove: false,
      }"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
        <Column data="Date" label="Datum" format="date" />
        <Column data="Time" label="Čas" format="time" />
        <Column data="UserName" label="Uživatel" width="200" />
        <Column data="ProductName" label="Produkt" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>