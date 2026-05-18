<script setup>
import OrderSimpleGrid from "@project/components/grids/order/OrderSimpleGrid.vue";
import BalikobotPackageGrid from "@project/components/grids/order/BalikobotPackageGrid.vue";
import BalikobotPackageStateGrid from "@project/components/grids/order/BalikobotPackageStateGrid.vue";

import { ref } from "vue";

const orderSimpleGridRef = ref(null);
const balikobotPackageGridRef = ref(null);
</script>

<template>
  <div class="row">
    <div class="col-4">
      <OrderSimpleGrid ref="orderSimpleGridRef" class="section" />
    </div>
    <div class="col-4">
      <BalikobotPackageGrid ref="balikobotPackageGridRef" :parent="{ ref: orderSimpleGridRef?.gridRef, parent: 'ID', child: 'Order_ID', }" class="section" />
    </div>
    <div class="col-4">
      <BalikobotPackageStateGrid :parent="{ ref: balikobotPackageGridRef?.gridRef, parent: 'ID', child: 'BalikobotPackage_ID', }" class="section" />
    </div>
  </div>
</template>