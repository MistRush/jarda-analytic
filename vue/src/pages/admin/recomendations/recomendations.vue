<script setup>
import { usePage } from "@/App/composables/usePage";
import RecomendationsGrid from "@project/components/grids/recomendations/RecomendationsGrid.vue";
import { ref, computed } from "vue";

const { pageData, getGrid } = usePage();
const showFilter = ref(false);

const recomendationsGrid = computed(() => {
  return getGrid("recomendationsGrid");
});

</script>

<template>
  <div :class="{ row: showFilter, flex: !showFilter, }" >
    <div :class="{ 'col-12': showFilter, 'flex-1': !showFilter, }">
      <RecomendationsGrid class="section" />
    </div>
  </div>
</template>

<style scoped></style>