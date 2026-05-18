<script setup>
import { usePage } from "@/App/composables/usePage";
import NewsGrid from "@project/components/grids/news/NewsGrid.vue";
import NewsCategoryFilter from "@project/components/filter/news/NewsCategoryFilter.vue";
import { ref, computed } from "vue";

const { pageData, getGrid } = usePage();
const showFilter = ref(true);

const newsGrid = computed(() => {
  return getGrid("newsGrid");
});

const onFilterDataChange = (data) => {
  newsGrid.value.ajax.state.NewsCategory_IDs = data.NewsCategoryIDs;
  newsGrid.value.refresh(true);
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
      <NewsGrid class="section" />
    </div>
  </div>
</template>

<style scoped></style>