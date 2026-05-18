<script setup>

import { ref, useId } from "vue";
import {object, string} from "yup";
import { useAjax } from "@/Composables/useAjax.js";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js"

const props = defineProps({
  keys: Array,
});

const ajax = useAjax();
const alerts = useAlertStore(window.pinia);

const emit = defineEmits(['close']);

const state = ref({
  key: null,
});

const schema = object({
  key: string().required().test(
    'unique-key-case-insensitive',
    'Tento klíč už existuje.',
    function (value) {
      // Pokud prázdné nebo není string, není co řešit
      if (!value || typeof value !== 'string') return true;
      // props.keys může být undefined, proto fallback na []
      const existingKeys = props.keys ?? [];
      // Porovnávej malými písmeny
      return !existingKeys.some(
        (k) => typeof k === 'string' && k.toLowerCase() === value.toLowerCase()
      );
    }
  ),
})

const id = useId();

const handleSubmit = async () => {
  ajax.postForm('/default/jolanda/add-key', {
    key: state.value.key,
  }).then(() => {
    alerts.success('Vytvořeno');
    emit('close');
  })
}

</script>

<template>
  <Modal :is-visible="true" @close="$emit('close')">
    <template #header>
      Přidat klíč
    </template>
    <template #body>
      <Form :state="state" :schema="schema" :id="id" @submit="handleSubmit">
        <InputField label="Klíč" name="key" v-model="state.key"/>
      </Form>

    </template>
    <template #footer>
      <Button variant="primary" type="submit" :form="id">Vytvořit</Button>
    </template>
  </Modal>
</template>