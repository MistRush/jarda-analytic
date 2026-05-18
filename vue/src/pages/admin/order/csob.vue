<script setup>
import OrderSimpleGrid from "@project/components/grids/order/OrderSimpleGrid.vue";
import CsobPaymentGrid from "@project/components/grids/order/CsobPaymentGrid.vue";
import CsobPaymentStateGrid from "@project/components/grids/order/CsobPaymentStateGrid.vue";

import { ref } from "vue";

const orderSimpleGridRef = ref(null);
const csobPaymentGridRef = ref(null);
</script>

<template>
  <div class="row">
    <div class="col-4">
      <OrderSimpleGrid ref="orderSimpleGridRef" class="section" />
    </div>
    <div class="col-4">
      <CsobPaymentGrid ref="csobPaymentGridRef" :parent="{ ref: orderSimpleGridRef?.gridRef, parent: 'ID', child: 'Order_ID', }" class="section" />
    </div>
    <div class="col-4">
      <CsobPaymentStateGrid :parent="{ ref: csobPaymentGridRef?.gridRef, parent: 'ID', child: 'CsobPayment_ID', }" class="section" />
    </div>
  </div>
</template>