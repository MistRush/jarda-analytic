<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import Action from "@/DataGrid/Components/Action/Action.vue";
import { useAlerts } from '@/Composables/useAlerts.js';
import { useAjax } from "@/Composables/useAjax.js";

const gridRef = ref(null);
const { grid: productGrid } = useGrid('productGrid');
const alerts = useAlerts();
const ajax = useAjax();

const showProduct = () => {
  const selected = productGrid.value?.getCurrentItem();
  if (selected) {
    window.open('/p/' + selected.slugCZ);
  } else {
    alerts.alert('Zobrazit produkt', 'error', 'Nejprve prosím vyberte produkt!');
  }
}

const copyProduct = () => {
  const selected = productGrid.value?.getCurrentItem();
  if (selected) {
    ajax.postForm(
        '/admin/product/copy-product/',
        { Product_ID: selected.ID,
        },
        null,
        {
          waitingAlert: true,
        },
    ).then(({ data, alert }) => {
      alert.changeToSuccess("Produkt zkopírován");
      productGrid.value.refresh();
    }).catch(({ error, alert }) => {
      debugger;
      alert.changeToError("Error", error.message);
    });
  } else {
    alerts.alert('Kopírovat produkt', 'error', 'Nejprve prosím vyberte produkt!');
  }
}
</script>
<template>
  <div>
    <DataGrid
        id="productGrid"
        :manager="{
              store: 'admin/product',
          }"
        ref="gridRef"
        :search="{
              column: ['NameCZ'],
              placeholder: 'Vyhledat produkt',
          }"
        fetchData
        title="Seznam produktů"
        editorURL="admin/product/edit-product"
        order="ID"
    >
      <template #columns>
        <Column label="Pořadové číslo" width="50" format="counter" />
        <Column data="ID" label="ID" width="50" />
        <Column data="FullFileName" label="Náhled" width="75" :filter="false" format="gallery" />
        <Column data="NameCZ" label="Název" width="300" />
        <Column data="ManufacturerName" label="Výrobce" width="150" />
        <Column data="EAN" label="EAN" width="150" />
        <Column data="Code" label="Kód produktu" width="150" />
        <Column data="_Active" label="Aktivní" width="50" format="bool" />
        <Column data="_Price" label="Cena" width="90" format="currency" />
        <Column data="OnStock" label="Skladem" width="60" />
        <Column data="FlagNews" label="Novinka" width="60" format="checkbox" />
        <Column data="FlagClearanceSale" label="Doprodej" width="60" format="checkbox" />
        <Column data="slugCZ" label="Odkaz na kategorii" width="450">
          <template #cell="{ data, cell }">
            <Copy :text="data" title="Zkopírovat" class="mr-[4px]" /> {{ data }}
          </template>
        </Column>
      </template>

      <template #actions>
        <Action label="Zobrazit produkt" @click="showProduct" icon="search" />
        <Action label="Kopírovat produkt" @click="copyProduct" icon="copy" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>