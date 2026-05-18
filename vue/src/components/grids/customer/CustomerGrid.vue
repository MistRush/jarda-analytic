<script setup>
import { ref } from "vue";
import { useTranslations } from "@/Composables/useTranslation.js";
import { useUser } from "@project/composables/models/user/useUser.js";

const user = useUser();
const { locale } = useTranslations();
const gridRef = ref(null);
</script>

<template>
  <div>
    <DataGrid
      id="customerGrid"
      :manager="{
            store: 'admin/customer',
        }"
      ref="gridRef"
      :search="{
            column: ['Name', 'invoiceAddress.FirstName', 'invoiceAddress.LastName', 'invoiceAddress.CompanyName', 'invoiceAddress.City', 'invoiceAddress.Street',  'invoiceAddress.ZipCode'],
            placeholder: 'Vyhledat zákazníka',
        }"
      fetchData
      title="Zákazníci"
      editorURL="admin/customer/edit-customer"
      order="ID"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Active" label="Aktivní" format="checkbox" />
        <Column data="Name" label="Název účtu" width="150" />
        <Column data="Type" label="Typ účtu" width="150" format="enum" :enumValues="user.getUserTypes()" />
        <Column data="LastLogin" label="Datum posledního přihlášení" width="80" format="date" />
        <Column data="CountLogin" label="Počet přihlášení" width="150" />
        <Column data="Discount" label="Sleva (%)" width="150" format="percent" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>