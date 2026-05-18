<script setup>
import { ref } from "vue";

const gridRef = ref(null);

const props = defineProps({
  parent: Object,
});
</script>

<template>
  <div>
    <DataGrid
        id="gopayPaymentStateGrid"
        :manager="{
              store: 'admin/gopay-payment-state',
          }"
        ref="gridRef"
        title="Seznam stavů Gopay plateb"
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
        <Column data="Date" label="Datum" width="200" format="date" />
        <Column data="Time" label="Čas" width="200" />
        <Column data="OrderStateType" label="Stav" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>