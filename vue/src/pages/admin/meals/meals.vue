<script setup>
import { usePage } from "@/App/composables/usePage";
import MealsGrid from "@project/components/grids/meals/MealsGrid.vue";
import { ref, computed } from "vue";

const { pageData, getGrid } = usePage();
const showFilter = ref(false);

const mealsGrid = computed(() => {
  return getGrid("mealsGrid");
});

</script>

<template>
  <div :class="{ row: showFilter, flex: !showFilter, }" >
    <div :class="{ 'col-12': showFilter, 'flex-1': !showFilter, }">
      <MealsGrid class="section" />
    </div>
  </div>
</template>

<style scoped></style>