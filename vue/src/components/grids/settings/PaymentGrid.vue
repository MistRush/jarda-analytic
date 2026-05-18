<script setup>
import { ref } from "vue";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import { useVat } from "@project/composables/models/vat/useVat.js";
import { usePayment } from "@project/composables/models/payment/usePayment.js";

const gridRef = ref(null);
const vat = useVat();
const payment = usePayment();
const { grid: paymentGrid } = useGrid('paymentGrid');

const onEshopIDChange = async (value) => {
  paymentGrid.value.ajax.state.Eshop_ID = value;
  paymentGrid.value.refresh();
};

</script>

<template>
  <div>
    <div class="row mb-[20px]">
      <Select name="Eshop_ID" label="Eshop" @change="onEshopIDChange" :manager="{ store: { module: 'common', controller: 'eshop', }, }" class="col-4" />
    </div>

    <DataGrid
        id="paymentGrid"
        :manager="{
              store: 'admin/payment',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat platbu podle názvu',
          }"
        fetchData
        title="Platby"
        editorURL="admin/settings/edit-payment"
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
        <Column data="BankAccount" label="Bankovní účet" width="120" />
        <Column data="IBAN" label="IBAN" width="120" />
        <Column data="Type" label="Typ" width="200" format="enum" :enumValues="payment.getTypes()" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>