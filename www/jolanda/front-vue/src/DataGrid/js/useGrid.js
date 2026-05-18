import { computed } from "vue";
import {usePage} from "@/App/composables/usePage";

export function useGrid(id) {
  const { getGrid } = usePage();

  const grid = computed(() => {
    return getGrid(id);
  });

  const search = computed(() => {
    return grid.value.external.search?.value ?? null;
  });

  return {
    grid,
    search,
  }
}