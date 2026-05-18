<script setup>
import { usePage } from "@/App/composables/usePage";
import NewsCategoryGrid from "@project/components/grids/news/NewsCategoryGrid.vue";
import NewsCategoryFilter from "@project/components/filter/news/NewsCategoryFilter.vue";
import { ref, computed } from "vue";

const { pageData, getGrid } = usePage();
const showFilter = ref(true);

const newsCategoryGrid = computed(() => {
  return getGrid("newsCategoryGrid");
});

const onFilterDataChange = (data) => {
  newsCategoryGrid.value.ajax.state.NewsCategory_IDs = data.NewsCategoryIDs;
  newsCategoryGrid.value.refresh(true);
};
</script>

<template>
  <div :class="{ row: showFilter, flex: !showFilter, }" >
    <div :class="{ 'col-2': showFilter, }">
      <NewsCategoryFilter
          @change="onFilterDataChange"
          @show="(show) => (showFilter = show)"
          :class="{ section: showFilter,}">
      </NewsCategoryFilter>
    </div>
    <div :class="{ 'col-10': showFilter, 'flex-1': !showFilter, }">
      <NewsCategoryGrid class="section" />
    </div>
  </div>
</template>

<style scoped></style>