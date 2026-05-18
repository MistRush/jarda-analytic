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
        id="balikobotPackageGrid"
        :manager="{
              store: 'admin/balikobot-package',
          }"
        ref="gridRef"
        :search="{
              column: ['PackageID', 'CarrierID', 'BalikobotOrderID'],
              placeholder: 'Vyhledat záznam',
          }"
        fetchData
        title="Seznam balíku"
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
        <Column data="PackageID" label="PackageID" width="200" />
        <Column data="TrackingURL" label="TrackingURL" width="200" />
        <Column data="LabelURL" label="LabelURL" width="200" />
        <Column data="CarrierID" label="CarrierID" width="200" />
        <Column data="BalikobotOrderID" label="BalikobotOrderID" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>