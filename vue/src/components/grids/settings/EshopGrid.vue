<script setup>
import { ref } from "vue";

import { useCurrency } from "@project/composables/models/currency/useCurrency.js";
import { useLanguage } from "@project/composables/models/language/useLanguage.js";
import { useVat } from "@project/composables/models/vat/useVat.js";

const currency = useCurrency();
const language = useLanguage();
const vat = useVat();

const gridRef = ref(null);
</script>

<template>
  <div>
    <DataGrid
        id="eshopGrid"
        :manager="{
              store: 'common/eshop',
          }"
        ref="gridRef"
        fetchData
        title="Správa eshopu"
        editorURL="admin/settings/edit-eshop"
        order="ID"
        :enabled-actions="{
            add: false,
            edit: true,
            remove: false,
        }"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Active" label="Aktivní" format="checkbox" />
        <Column data="Name" label="Název eshopu" width="200" />
        <Column data="URL" label="URL" width="200" />
        <Column data="Language_ID" label="Jazyk" width="150" format="enum" :enumValues="language.getLanguages()" />
        <Column data="Currency_ID" label="Měna" width="150" format="enum" :enumValues="currency.getCurrencies()" />
        <Column data="Vat_ID" label="Daň" width="150" format="enum" :enumValues="vat.getVats()" />
        <Column data="ProjectName" label="Název projektu" width="200" />
        <Column data="ProjectURL" label="Url projektu" width="200" />
        <Column data="ContactEmail" label="Kontaktní email" width="200" />
        <Column data="ContactPhone" label="Kontaktní telefon" width="200" />
        <Column data="Address" label="Adresa" width="200" />
        <Column data="RegistrationNumber" label="IČ" width="200" />
        <Column data="VATNumber" label="DIČ" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>