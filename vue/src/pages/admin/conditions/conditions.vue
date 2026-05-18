<script setup>
import { usePage } from "@/App/composables/usePage";
import ConditionsGrid from "@project/components/grids/conditions/ConditionsGrid.vue";
import { ref, computed } from "vue";

const { pageData, getGrid } = usePage();
const showFilter = ref(false);

const conditionsGrid = computed(() => {
  return getGrid("conditionsGrid");
});

</script>

<template>
  <div :class="{ row: showFilter, flex: !showFilter, }" >
    <div :class="{ 'col-12': showFilter, 'flex-1': !showFilter, }">
      <ConditionsGrid class="section" />
    </div>
  </div>
</template>

<style scoped></style>