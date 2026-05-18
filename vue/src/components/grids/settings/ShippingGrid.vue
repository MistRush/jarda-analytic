<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import { useVat } from "@project/composables/models/vat/useVat.js";

const gridRef = ref(null);
const vat = useVat();
const { grid: shippingGrid } = useGrid('shippingGrid');

const onEshopIDChange = async (value) => {
  shippingGrid.value.ajax.state.Eshop_ID = value;
  shippingGrid.value.refresh();
};
</script>

<template>
  <div>
    <div class="row mb-[20px]">
      <Select name="Eshop_ID" label="Eshop" @change="onEshopIDChange" :manager="{ store: { module: 'common', controller: 'eshop', }, }" class="col-4" />
    </div>

    <DataGrid
        id="shippingGrid"
        :manager="{
              store: 'admin/shipping',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat dopravu podle názvu',
          }"
        fetchData
        title="Platby"
        editorURL="admin/settings/edit-shipping"
        order="ID"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Active" label="Aktivní" format="checkbox" />
        <Column data="FullFileName" label="Náhled" width="75" :filter="false" format="gallery" />
        <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
        <Column data="Name" label="Název" width="200" />
        <Column data="Price" label="Cena" width="100" format="currency" />
        <Column data="Vat_ID" label="Daň" width="120" format="enum" :enumValues="vat.getVats()" />
        <Column data="VatType" label="Daň u ceny" width="120" format="enum" :enumValues="vat.getVatCountTypes()" />
        <Column data="FreeShipping" label="Doprava zdarma od" width="120" format="currency" />
        <Column data="Code" label="Kód" width="120" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>