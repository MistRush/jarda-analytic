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
        id="balikobotPackageStateGrid"
        :manager="{
              store: 'admin/balikobot-state',
          }"
        ref="gridRef"
        :search="{
              column: ['StatusID'],
              placeholder: 'Vyhledat záznam',
          }"
        fetchData
        title="Seznam stavů balíků"
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
        <Column data="StatusID" label="StatusID" width="200" />
        <Column data="State" label="Stav" width="200" />
        <Column data="Message" label="Zpráva" width="200" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>