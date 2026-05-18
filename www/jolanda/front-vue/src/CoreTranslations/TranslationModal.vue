<script setup>
import { reactive } from "vue";
import { useAjax } from "@/Composables/useAjax.js";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js"

const props = defineProps({
  translationKey: String,
  langs: Array,
  translations: Object,
})
const ajax = useAjax();
const alerts = useAlertStore(window.pinia);

const emit = defineEmits(['close']);

const state = reactive({
  translations: props.translations,
})

const save = () => {
  ajax.postForm('/default/jolanda/update-key-langs', {
    data: JSON.stringify({
      key: props.translationKey,
      langs: state.translations,
    })
  }).then(() => {
    alerts.success('Uloženo');
    emit('close');
  })
}
</script>

<template>
  <Modal :is-visible="true" @close="$emit('close')">
    <template #header>
      {{ props.translationKey }}
    </template>
    <template #body>
      <div class="row-2">
        <div class="col-1" v-for="lang in langs">
          <InputField :label="lang" v-model="state.translations[lang]"/>
        </div>
      </div>
    </template>
    <template #footer>
      <Button @click="save">Uložit</Button>
    </template>
  </Modal>
</template>