<script setup>
import { ref } from "vue";
import { useTranslations } from "@/Composables/useTranslation.js";

const { locale } = useTranslations();
const gridRef = ref(null);
</script>

<template>
  <div>
    <DataGrid
        id="couponGrid"
        :manager="{
              store: 'admin/coupon',
          }"
        ref="gridRef"
        :search="{
              column: ['Code'],
              placeholder: 'Vyhledat kupón',
          }"
        fetchData
        title="Kupóny"
        editorURL="admin/customer/edit-coupon"
        order="ID"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Code" label="Slevový kód" width="200" />
        <Column :data="`Name${locale.Code}`" label="Název" width="200" />
        <Column data="Type" label="Typ kupónu" width="200" format="enum" :enumValues="fetchedData.types" />
        <Column data="Quantity" label="Množství" width="80" />
        <Column data="ProductName" label="Produkt" width="200" />
        <Column data="Discount" label="Sleva (CZK/%)" width="100" format="percent" />
        <Column data="TotalCount" label="Počet použití" width="100">
          <template #cell="{ data, cell }">
            {{ cell.rowData.UsedCount > 0 ? cell.rowData.UsedCount : 0 }} / {{ cell.rowData.TotalCount > 0 ? cell.rowData.TotalCount : '&infin;' }}
          </template>
        </Column>
        <Column data="MinOrder" label="Minimální objednávka" width="100" />
        <Column data="ExpiryDate" label="Expirace" width="80" format="date" />
        <Column data="CreatedDate" label="Datum vytvoření" width="80" format="date" />
        <Column data="UserName" label="Uživatel" width="150" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>