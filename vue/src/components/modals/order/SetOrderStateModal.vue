<script setup>
import { reactive, useId } from "vue";
import { string, object } from "yup";
import { useAjax } from "@/Composables/useAjax.js";
import { useGrid } from "@/DataGrid/js/useGrid.js";

const props = defineProps({
  orderIDs: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const formID = useId();
const ajax = useAjax();
const { grid: orderGrid } = useGrid('orderGrid');

const state = reactive({
  OrderStateType_ID: null,
});

const schema = object({
  OrderStateType_ID: string().required(),
});

const submit = () => {
  ajax.postForm(
    "/admin/order/set-order-state/",
    {
      Order_IDs: JSON.stringify(props.orderIDs),
      OrderStateType_ID: state.OrderStateType_ID,
    },
    null,
    {
      waitingAlert: true,
    },
  )
    .then(({ data, alert }) => {
      alert.changeToSuccess("OK");
      emit("close");
      orderGrid.value.refresh();
    })
    .catch(({ error, alert }) => {
      debugger;
      alert.changeToError("Error", error.message);
    });
};
</script>

<template>
  <Modal :is-visible="true" @close="$emit('close')" size="extraSmall">
    <template #header>
      {{ _l("Zmaně stavu objednávek") }}
    </template>
    <template #body>
      <Form :state="state" :schema="schema" @submit="submit" :id="formID">
        <div class="row-1">
          <Select name="OrderStateType_ID" v-model="state.OrderStateType_ID" label="Stav" manager="admin/order-state-type" remoteName="NameCZ" />
        </div>
      </Form>
    </template>
    <template #footer>
      <Button variant="green" type="submit" :form="formID">
        {{ _l("Potvrdit") }}
      </Button>
    </template>
  </Modal>
</template>

<style scoped></style>
