<script setup>
import TheadTr from "@/Components/Table/TheadTr.vue";
import TheadTh from "@/Components/Table/TheadTh.vue";
import Tbody from "@/Components/Table/Tbody.vue";
import TbodyTr from "@/Components/Table/TbodyTr.vue";
import TbodyTd from "@/Components/Table/TbodyTd.vue";
import { computed, reactive } from "vue";
import TranslationModal from "./TranslationModal.vue";
import CreateKeyModal from "./CreateKeyModal.vue";
import { useAjax } from "@/Composables/useAjax.js";

const props = defineProps({
  data: Object,
})
const ajax = useAjax();

const state = reactive({
  translations: {
    loading: false,
    data: props.data,
  },
  translationsModal: {
    show: false,
    translations: null,
    key: null,
  },
  createKeyModal: {
    show: false,
  }
});

const langs = computed(() => {
  return Object.keys(Object.values(state.translations.data)[0])
})

const refreshData = async () => {
  ajax.get('/default/jolanda/translations').then(({data}) => {
    state.translations.data = data.langs;
  });
}
</script>

<template>
  <div>
    <Button variant="primary" @click="state.createKeyModal.show=true">Přidat klíč</Button>
    <Table>
      <Thead>
      <TheadTr>
        <TheadTh>Klíč</TheadTh>
        <TheadTh></TheadTh>
      </TheadTr>
      </Thead>
      <Tbody>
      <TbodyTr v-for="(values, key) in state.translations.data">
        <TbodyTd>{{ key }}</TbodyTd>
        <TbodyTd><Button icon="edit" variant="orange" @click="state.translationsModal.show = true; state.translationsModal.translations = values; state.translationsModal.key = key;" /></TbodyTd>
      </TbodyTr>
      </Tbody>
    </Table>

    <CreateKeyModal v-if="state.createKeyModal.show" @close="state.createKeyModal.show = false; refreshData()" :keys="Object.keys(state.translations.data)" />
    <TranslationModal v-if="state.translationsModal.show" @close="state.translationsModal.show = false; refreshData()" :langs="langs" :translations="state.translationsModal.translations" :translationKey="state.translationsModal.key"/>
  </div>

</template>