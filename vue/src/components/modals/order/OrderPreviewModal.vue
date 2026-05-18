<script setup>
import Icon from "@/Icons/Icon.vue";
import Tooltip from "@/Components/Other/Tooltip.vue";
import { useHelper } from "@project/composables/useHelper.js";
import HighlightText from "@/Components/Other/HighlightText.vue";

const props = defineProps({
  orderID: {
    required: true,
  },
});
const helper = useHelper();
</script>

<template>
  <Modal :is-visible="true" :dataURL="'/admin/order/get-order-by-id?Order_ID=' + props.orderID ">
    <template #header>Náhled objednávky</template>
    <template #body="{data}">

    <div class="panel">
      <div class="row">
        <div class="col-4">
          <b>Základní informace - <Copy :text="data.OrderNumber" title="Zkopírovat" class="top-[4px]" /> {{ data.OrderNumber }}</b>
          <div><Icon icon="user" class="text-primary w-[16px] h-[16px]" />{{ data.invoiceAddress.FirstName }} {{data.invoiceAddress.LastName }}</div>
          <div><Icon icon="email" class="text-primary w-[16px] h-[16px]" /><a :href="`mailto:${data.invoiceAddress.Email}`">{{ data.invoiceAddress.Email }}</a></div>
          <div><Icon icon="phone" class="text-primary w-[16px] h-[16px]" /><a :href="`tel:${data.invoiceAddress.Phone}`">{{ data.invoiceAddress.Phone }}</a></div>
        </div>

        <div class="col-4">
          <b>Fakturační adresa</b>
          <div v-if="data.invoiceAddress.CompanyName">{{ data.invoiceAddress.CompanyName }}</div>
          <div v-if="data.invoiceAddress.IC">IČ: {{ data.invoiceAddress.IC }}</div>
          <div v-if="data.invoiceAddress.DIC">DIČ: {{ data.invoiceAddress.DIC }}</div>
          <div>{{ data.invoiceAddress.Street }}</div>
          <div>{{ data.invoiceAddress.ZipCode }} {{ data.invoiceAddress.City }}</div>
        </div>

        <div v-if="data.deliveryAddress.Street" class="col-4">
          <b>Doručovací adresa</b>
          <div>{{ data.deliveryAddress.Street }}</div>
          <div>{{ data.deliveryAddress.ZipCode }} {{ data.deliveryAddress.City }}</div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="row">
        <div class="col-3">
          <Tooltip :text="helper.formatDate(data.DatePayed)">
            <div class="payment" :class="{ 'paid': data.DatePayed }">{{ data.payment.Name }}</div>
          </Tooltip>
        </div>
        <div class="col-3">
          <Icon icon="car" class="text-primary w-[16px] h-[16px]" />
          {{ data.shipping.Name }}
        </div>
        <div class="col-3">
          <Icon icon="state" class="text-primary w-[16px] h-[16px]" />
          {{ data.OrderStateTypeName }}
        </div>
        <div class="col-3">
          <Icon icon="stock" class="text-primary w-[16px] h-[16px]" />
          {{ data.TotalProducts }} ks
        </div>
      </div>
    </div>
    <div class="products">
      <div class="wrapper">
        <Table>
          <Thead>
          <TheadTr>
            <TheadTh class="text-center">Fotka</TheadTh>
            <TheadTh>Kód</TheadTh>
            <TheadTh>Produkt</TheadTh>
            <TheadTh class="text-right">Cena/ks<br><small class="text-muted">{{ data.CurrencyMark }}</small></TheadTh>
            <TheadTh class="text-center">Množství</TheadTh>
            <TheadTh class="text-right">Cena celkem<br><small class="text-muted">{{ data.CurrencyMark }}</small></TheadTh>
          </TheadTr>
          </Thead>
          <Tbody>
          <TbodyTr v-for="orderItem in data.orderItems" :key="orderItem.ID">
            <TbodyTd class="text-center !p-[7px]"><img :src="orderItem.Image" class="inline-block"></TbodyTd>
            <TbodyTd>{{ orderItem.product.Code }}</TbodyTd>
            <TbodyTd><a :href="orderItem.ProductURL" target="_blank">{{ orderItem.ProductName }}</a></TbodyTd>
            <TbodyTd class="text-right">{{ orderItem.ProductPrice }}</TbodyTd>
            <TbodyTd class="text-center">{{ orderItem.Quantity }}</TbodyTd>
            <TbodyTd class="text-right">{{ orderItem.ProductPriceTotal }}</TbodyTd>
          </TbodyTr>

          <TbodyTr>
            <TbodyTd :colspan="6" class="text-right font-bold text-base">Částka k úhradě: <span>{{ data.PriceTotal }}</span></TbodyTd>
          </TbodyTr>
          </Tbody>
        </Table>
      </div>
    </div>
    <div class="text-right mt-[15px]">
      <AppRouterLink :to="`/admin/order/edit-order?entity_ID=${data.ID}`" class="!text-red inline-block !no-underline">
        <Button size="large" class="no-underline">Zobrazit více</Button>
      </AppRouterLink>
    </div>
    </template>
  </Modal>
</template>

<style scoped>
a {
  text-decoration: underline;
  color: var(--color-primary);

  &:hover {
    text-decoration: none;
  }
}

svg {
  margin-right: 4px;
  display: inline-block;
  margin-top: -2px;
}

.panel {
  border-radius: 10px;
  background-color: rgba(var(--color-primary-hex), 0.05);
  padding: 10px 13px;
  margin-bottom: 20px;
  line-height: 19px;

  .payment {
    position: relative;
    padding-left: 16px;

    &:before {
      content: "";
      position: absolute;
      top: 4px;
      left: 0;
      width: 10px;
      height: 10px;
      border-radius: 6px;
      background: #dddddd;
    }

    &.paid:before {
      background: green;
    }
  }
}
</style>