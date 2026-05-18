<script setup>
import { reactive, ref, watch } from "vue";
import TreeView from "@/Components/Other/TreeView/TreeView.vue";

const emit = defineEmits(["change", "show"]);

let timer = null;
const state = reactive({
  data: {
    NewsCategoryIDs: null,
  },
});

const newsCategoryTree = ref(null);
const show = ref(true);

watch(
    () => newsCategoryTree.value,
    (newVal, oldVal) => {
      state.data.NewsCategoryIDs = newVal;
    },
    { deep: true },
);

watch(
    () => state.data,
    (newVal) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        emit("change", newVal);
      }, 300);
    },
    { deep: true },
);

const toggleShow = () => {
  show.value = !show.value;
  emit("show", show.value);
};
</script>

<template>
  <div class="side-filter relative min-w-[32px]">
    <div
        class="w-[32px] h-[32px] bg-dark-bg rounded-[16px] flex items-center justify-center absolute cursor-pointer hover:opacity-85 dark:bg-dark-bg-800"
        :class="{
                'right-[-10px] top-[8px]': show,
                'right-[12px] top-[8px]': !show,
            }"
        @click="toggleShow"
    >
      <Icon v-if="show" icon="arrow" :direction="show ? 'left' : 'right'" class="w-[12px] text-white"></Icon>
      <Icon v-else icon="filter" class="w-[12px] text-white"></Icon>
    </div>
    <div v-show="show">
      <div class="header open flex gap-1">
        <Icon icon="filter" class="w-[21px] text-primary" outline />
        <h4>Pokročilé filtrování</h4>
        <i class="ci ci-angle-down"></i>
      </div>
      <div class="content">
        <Form :state="state.data">
          <h5 class="font-semibold text-primary mb-3 mt-3">Kategorie článků</h5>
          <TreeView dataUrl="/admin/news/load-news-category-tree" v-model="newsCategoryTree"></TreeView>
        </Form>
      </div>
    </div>
  </div>
</template>

<style scoped>


</style>