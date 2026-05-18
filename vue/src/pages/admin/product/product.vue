<script setup>
import { usePage } from "@/App/composables/usePage";
import ProductGrid from "@project/components/grids/product/ProductGrid.vue";
import CategoryFilter from "@project/components/filter/product/CategoryFilter.vue";
import { ref, computed } from "vue";

const { pageData, getGrid } = usePage();
const showFilter = ref(true);

const productGrid = computed(() => {
  return getGrid("productGrid");
});

const onFilterDataChange = (data) => {
  productGrid.value.ajax.state.Category_IDs = data.CategoryIDs;
  productGrid.value.refresh(true);
};
</script>

<template>
  <div :class="{ row: showFilter, flex: !showFilter, }" >
    <div :class="{ 'col-2': showFilter, }">
      <CategoryFilter
          @change="onFilterDataChange"
          @show="(show) => (showFilter = show)"
          :class="{ section: showFilter,}">
      </CategoryFilter>
    </div>
    <div :class="{ 'col-10': showFilter, 'flex-1': !showFilter, }">
      <ProductGrid class="section" />
    </div>
  </div>
</template>

<style scoped></style>