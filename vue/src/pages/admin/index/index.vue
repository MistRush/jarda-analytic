<script setup>
import { ref, reactive, watch } from 'vue'
import { usePage } from "@/App/composables/usePage";
import { useHelper } from "@project/composables/useHelper.js";
import LoadingLine from "@/Components/Other/Loading/LoadingLine.vue";
import HighlightText from "@/Components/Other/HighlightText.vue";
import { useAjax } from "@/Composables/useAjax.js";

const { pageData } = usePage();
const helper = useHelper();
const query = ref('');
var showLoading = ref(false);
const ajax = useAjax();

const searchedData = reactive({
  products: [],
  productsCount: 0,
  categories: [],
  categoriesCount: 0,
  orders: [],
  ordersCount: 0,
});

let timeout;
watch(query, () => {
  if ( query.length < 3 )
    return;

  showLoading.value = true;
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    ajax.postForm(
      '/admin/index/search/',
      { SearchString: query.value, },
      null,
    ).then(({ data }) => {
      showLoading.value = false;
      searchedData.products = data.products;
      searchedData.productsCount = data.productsCount;
      searchedData.categories = data.categories;
      searchedData.categoriesCount = data.categoriesCount;
      searchedData.orders = data.orders;
      searchedData.ordersCount = data.ordersCount;
    }).catch(({ error, alert }) => {
      alert.changeToError("Error", error.message);
    });
  }, 400)
});
</script>

<template>
  <div class="section p-[20px] mb-[30px]">
    <h2 class="mb-[5px]">Vyhledávání v systému</h2>
    <div class="search-holder relative">
      <InputField v-model="query" type="text" placeholder="Napište, co hledáte ... produkt, kategorie, objednávka ..." :showClear="true" />
      <div class="result absolute w-full p-[20px] bg-white rounded-lg shadow-xl z-[1000]" :class="{ hidden: query?.length < 3 }">
        <div v-if="showLoading">
          <LoadingLine  />
        </div>
        <div v-if="searchedData.productsCount || searchedData.categoriesCount || searchedData.ordersCount">
          <div class="row">
            <div v-if="searchedData.productsCount" class="col-3">
              <h3 class="mb-[15px]">Vyhledané produkty ({{ searchedData.productsCount }})</h3>
              <div v-for="product in searchedData.products" :key="product.ID">
                <AppRouterLink :to="`/admin/product/edit-product?entity_ID=${product.ID}`" class="!text-red">
                  <HighlightText :text="product.ProductName" :highlight="query" />
                </AppRouterLink>
              </div>
              <br>
              <AppRouterLink to="/admin/product/product">Všechny produkty</AppRouterLink>
            </div>

            <div v-if="searchedData.categoriesCount" class="col-3">
              <h3 class="mb-[15px]">Vyhledané kategorie ({{ searchedData.categoriesCount }})</h3>
              <div v-for="category in searchedData.categories" :key="category.ID">
                <AppRouterLink :to="`/admin/product/edit-category?entity_ID=${category.ID}`" class="!text-red">
                  <HighlightText :text="category.Name" :highlight="query" />
                </AppRouterLink>
              </div>
              <br>
              <AppRouterLink to="/admin/product/category">Všechny kategorie</AppRouterLink>
            </div>

            <div v-if="searchedData.ordersCount" class="col-3">
              <h3 class="mb-[15px]">Vyhledané objednávky ({{ searchedData.ordersCount }})</h3>
              <div v-for="order in searchedData.orders" :key="order.ID">
                <AppRouterLink :to="`/admin/order/edit-order?entity_ID=${order.ID}`" class="!text-red">
                  <HighlightText :text="order.OrderNumber" :highlight="query" />
                </AppRouterLink>
              </div>
              <br>
              <AppRouterLink to="/admin/order/order">Všechny objednávky</AppRouterLink>
            </div>
          </div>
        </div>
        <div v-else>Nic nenalezeno</div>
      </div>
    </div>
  </div>
  <div class="section p-[20px]">
    <h2 class="mb-[5px]">Seznam posledních objednávek</h2>
    <Table>
      <Thead>
        <TheadTr>
          <TheadTh>Datum</TheadTh>
          <TheadTh>Číslo objednávky</TheadTh>
          <TheadTh class="text-center">Eshop</TheadTh>
          <TheadTh class="text-center">Produktů</TheadTh>
          <TheadTh class="text-center">Stav</TheadTh>
          <TheadTh class="text-center">Cena</TheadTh>
          <TheadTh class="text-center"></TheadTh>
        </TheadTr>
      </Thead>
      <Tbody>
        <TbodyTr v-for="order in pageData.data.orders" :key="order.ID">
          <TbodyTd>{{ helper.formatDate(order.Date) }}</TbodyTd>
          <TbodyTd class="font-medium"> <Copy :text="order.OrderNumber" title="Zkopírovat" class="top-[4px]" />{{ order.OrderNumber }}</TbodyTd>
          <TbodyTd class="text-center">{{ order.eshop.Name }}</TbodyTd>
          <TbodyTd class="text-center">{{ order.orderItems.length }}</TbodyTd>
          <TbodyTd class="text-center">{{ order.orderStateType.orderStateTypeLangs[0].Name }}</TbodyTd>
          <TbodyTd class="text-center">
            <span :class="{ 'finished': order.OrderStateType_ID == 4 }">{{ helper.formatPrice(order.PriceTotalWithVat) }} Kč</span>
          </TbodyTd>
          <TbodyTd class="text-center">
            <AppRouterLink :to="`/admin/order/edit-order?entity_ID=${order.ID}`" class="mr-[5px]">
              <Icon icon="search" class="w-[14px] inline-block hover:opacity-50 text-red"></Icon>
            </AppRouterLink>
            <a :href="`/files/orders/${order.Folder}/${order.OrderNumber}.pdf`" target="_blank">
              <Icon icon="note" class="w-[14px] inline-block hover:opacity-50 text-red"></Icon>
            </a>
          </TbodyTd>
        </TbodyTr>
      </Tbody>
    </Table>
  </div>
</template>

<style scoped>
  .finished {
    background: var(--color-primary);
    color: #ffffff;
    padding: 5px 8px;
    border-radius: 6px;
  }
</style>