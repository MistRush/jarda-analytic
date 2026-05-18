<script setup>
import OrderSimpleGrid from "@project/components/grids/order/OrderSimpleGrid.vue";
import GopayPaymentGrid from "@project/components/grids/order/GopayPaymentGrid.vue";
import GopayPaymentStateGrid from "@project/components/grids/order/GopayPaymentStateGrid.vue";

import { ref } from "vue";

const orderSimpleGridRef = ref(null);
const gopayPaymentGridRef = ref(null);
</script>

<template>
  <div class="row">
    <div class="col-4">
      <OrderSimpleGrid ref="orderSimpleGridRef" class="section" />
    </div>
    <div class="col-4">
      <GopayPaymentGrid ref="gopayPaymentGridRef" :parent="{ ref: orderSimpleGridRef?.gridRef, parent: 'ID', child: 'Order_ID', }" class="section" />
    </div>
    <div class="col-4">
      <GopayPaymentStateGrid :parent="{ ref: gopayPaymentGridRef?.gridRef, parent: 'ID', child: 'GopayPayment_ID', }" class="section" />
    </div>
  </div>
</template>