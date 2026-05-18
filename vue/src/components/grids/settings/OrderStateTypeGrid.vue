<script setup>
import { ref } from "vue";
import { useTranslations } from "@/Composables/useTranslation.js";

const { locale } = useTranslations();
const gridRef = ref(null);

const rowFormatter = (row, data, props) => {
  props.style["--rowColor"] = data.Color;
}
</script>

<template>
  <div>
    <DataGrid
        id="orderStateTypeGrid"
        :manager="{
              store: 'admin/order-state-type',
          }"
        ref="gridRef"
        title="Stavy objednávky"
        editorURL="admin/settings/edit-order-state-type"
        order="ID"
        :rowFormatter="rowFormatter"
    >
      <template #columns>
        <Column data="ID" label="ID" width="30" />
        <Column data="SendEmail" label="Odesílat email" format="checkbox" />
        <Column :data="`Name${locale.Code}`" label="Název stavu" width="200" />
        <Column :data="`EmailHeader${locale.Code}`" label="Hlavička emailu" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>