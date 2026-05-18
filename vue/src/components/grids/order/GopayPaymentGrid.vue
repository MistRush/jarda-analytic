<script setup>
import { ref } from "vue";

const gridRef = ref(null);
defineExpose({ gridRef });

const props = defineProps({
  parent: Object,
});
</script>

<template>
  <div>
    <DataGrid
        id="gopayPaymentGrid"
        :manager="{
              store: 'admin/gopay-payment',
          }"
        ref="gridRef"
        :search="{
              column: ['GopayID'],
              placeholder: 'Vyhledat záznam',
          }"
        title="Seznam Gopay plateb"
        order="ID"
        :parent="props.parent"
        :enabled-actions="{
            add: false,
            edit: false,
            remove: false,
        }"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="GopayID" label="GopayID" width="200" />
        <Column data="GopayURL" label="GopayURL" width="200" />
        <Column data="Date" label="Datum" width="200" format="date" />
        <Column data="Time" label="Čas" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>