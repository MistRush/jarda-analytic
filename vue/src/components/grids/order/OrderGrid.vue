<script setup>
import { ref, reactive } from "vue";
import { usePage } from "@/App/composables/usePage";
import { useGrid } from "@/DataGrid/js/useGrid.js";
import { useAlerts } from '@/Composables/useAlerts.js';
import { useAjax } from "@/Composables/useAjax.js";
import { useHelper } from "@project/composables/useHelper.js";
import Action from '@/DataGrid/Components/Action/Action.vue'
import Tooltip from "@/Components/Other/Tooltip.vue";
import OrderPreviewModal from "@project/components/modals/order/OrderPreviewModal.vue";
import SetOrderStateModal from "@project/components/modals/order/SetOrderStateModal.vue";
import Icon from "@/Icons/Icon.vue";

const gridRef = ref(null);
const { grid: orderGrid } = useGrid('orderGrid');
const orderStateTypeID = ref(null);
const { pageData } = usePage();
const alerts = useAlerts();
const ajax = useAjax();
const helper = useHelper();

const state = reactive({
  setOrderStateModal: {
    show: false,
    orderIDs: null,
  },
  orderPreviewModal: {
    show: false,
    orderID: null,
  },
});

const setOrderState = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Změnit stav objednávek', 'error', 'Nejprve prosím vyberte objednávky, kterým chcete změnit stav.');
    return;
  }

  state.setOrderStateModal.orderIDs = orderGrid.value.getCurrentItem().map((item) => item.ID);
  state.setOrderStateModal.show = true;
};

const orderPreview = (orderID) => {
  state.orderPreviewModal.orderID = orderID;
  state.orderPreviewModal.show = true;
};

const printOrders = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Zobrazit stránku', 'error', 'Nejprve prosím vyberte objednávky, které chcete vytisknout.');
    return;
  }

  window.open(basePath + '/admin/order/print-orders/OrderIDs/' + orderGrid.value.getCurrentItem().map((item) => item.ID));
};

const showPDF = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Zobrazit stránku', 'error', 'Nejprve prosím vyberte objednávku.');
    return;
  }

  window.open(basePath + '/files/orders/' + orderGrid.value.getCurrentItem()[0]['Folder'] + '/' + orderGrid.value.getCurrentItem()[0]['ID'] + '.pdf');
};

const regeneratePDF = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Zobrazit stránku', 'error', 'Nejprve prosím vyberte objednávku.');
    return;
  }

  ajax.postForm(
    '/admin/order/regenerate-custom-sheet/',
    {
      Order_ID: orderGrid.value.getCurrentItem()[0]['ID'],
    },
    null,
    {
      waitingAlert: true,
    },
  ).then(({ data, alert }) => {
    alert.changeToSuccess("PDF přegenerováno.");
  }).catch(({ error, alert }) => {
    debugger;
    alert.changeToError("Error", error.message);
  });
};

const showInvoice = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Zobrazit stránku', 'error', 'Nejprve prosím vyberte objednávku.');
    return;
  }

  window.open(basePath + '/admin/order/show-invoice?Order_ID='+orderGrid.value.getCurrentItem()[0].ID);
  orderGrid.value.refresh();
};

const exportPohoda = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Zobrazit stránku', 'error', 'Nejprve prosím vyberte objednávku.');
    return;
  }

  window.open(basePath + '/admin/order/export-pohoda?id=' + orderGrid.value.getCurrentItem()[0].ID);
};

const exportToCsv = () => {
  window.open(basePath + '/admin/order/export-csv');
};

const createNewPplShipment = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Zobrazit stránku', 'error', 'Nejprve prosím vyberte objednávky, které chcete vytisknout.');
    return;
  }

  window.open(basePath + '/admin/order/new-ppl-shipment/OrderIDs/' + orderGrid.value.getCurrentItem().map((item) => item.ID));
};

const getAlreadyGeneratedPplLabels = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Zobrazit stránku', 'error', 'Nejprve prosím vyberte objednávky, které chcete vytisknout.');
    return;
  }

  window.open(basePath + '/admin/order/get-ppl-labels/OrderIDs/' + orderGrid.value.getCurrentItem().map((item) => item.ID));
};

const getPplPackageList = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Tisk objednávek', 'error', 'Nejprve prosím vyberte objednávky, které chcete vytisknout.');
    return;
  }

  window.open(basePath + '/admin/order/get-ppl-package-list/OrderIDs/' + orderGrid.value.getCurrentItem().map((item) => item.ID));
};

const sendOrderToZasilkovna = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Odeslat objednávku do zásilkovny', 'error', 'Nejprve prosím vyberte objednávku.');
    return;
  }

  ajax.postForm(
    '/admin/order/send-order-to-zasilkovna/',
    {
      OrderIDs: orderGrid.value.getCurrentItem().map((item) => item.ID),
    },
    null,
    {
      waitingAlert: true,
    },
  ).then(({ data, alert }) => {
    alert.changeToSuccess("PDF přegenerováno.");
  }).catch(({ error, alert }) => {
    debugger;
    alert.changeToError("Error", error.message);
  });
};

const getZasilkovnaLabels = () => {
  if ( !orderGrid.value.getCurrentItem() ) {
    alerts.alert('Štítky zásilkovny', 'error', 'Nejprve prosím vyberte objednávky, které chcete vytisknout.');
    return;
  }

  window.open(basePath + '/admin/order/get-labels/OrderIDs/' + orderGrid.value.getCurrentItem().map((item) => item.ID));
};

const rowFormatter = (row, data, props) => {
  props.style["--rowColor"] = data.Color;
}
</script>

<template>
  <div>
    <div class="order-state-type-filter">
      <button class="filter-item" :class="{ active: orderStateTypeID==null}" @click="orderStateTypeID=null">Všechny objednávky</button>
      <button v-for="orderStateType in pageData.data.orderStateTypes" :key="orderStateType.ID" class="filter-item" :class="{ active: orderStateTypeID==orderStateType.ID}"  @click="orderStateTypeID=orderStateType.ID">
        {{ orderStateType.Name }} ({{ orderStateType.Count }})
      </button>
    </div>
    <DataGrid
      id="orderGrid"
      :manager="{
        store: 'admin/order',
        params: {
          OrderStateType_ID : orderStateTypeID
        }
      }"
      ref="gridRef"
      :search="{
            column: ['OrderNumber', 'invoiceAddress.Email', 'invoiceAddress.LastName', 'invoiceAddress.FirstName'],
            placeholder: 'Vyhledat objednávku',
        }"
      fetchData
      selectType="multi_checkbox"
      title="Seznam objednávek"
      editorURL="admin/order/edit-order"
      :order="{
        column: 'ID',
        dir: 'desc'
      }"
      :enabled-actions="{
        add: false,
        edit: true,
        remove: false,
      }"
      :rowFormatter="rowFormatter"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />

        <Column label="Náhled" width="50" >
          <template #cell="{ data, cell }">
            <div @click="orderPreview(state.orderPreviewModal.orderID=cell.rowData.ID)">
              <Icon icon="search" class="text-primary w-[16px] h-[16px] cursor-pointer hover:opacity-50 text-black" />
            </div>
          </template>
        </Column>

        <Column data="OrderNumber" label="Číslo objednávky" width="120" />
        <Column data="InvoiceNumber" label="Číslo faktury" width="120" />
        <Column data="Date" label="Datum" width="100" format="date" />
        <Column data="Time" label="Čas" width="100" />
        <Column data="PriceTotalWithoutVat" label="Celková cena bez DPH" width="130" format="currency" />
        <Column data="PriceTotalWithVat" label="Celková cena s DPH" width="130" format="currency" />
        <Column data="Email" label="Email" width="180" />
        <Column data="FullName" label="Zákazník" width="180" />
        <Column data="PaymentName" label="Platba" width="100" >
          <template #cell="{ data, cell }">
            <div v-if="cell.rowData.DatePayed">
              <Tooltip :text="helper.formatDate(cell.rowData.DatePayed)" class="w-[100%]">
                <div class="payment" :class="{ 'paid': cell.rowData.DatePayed }">{{ data }}</div>
              </Tooltip>
            </div>
            <div v-else>{{ data }}</div>
          </template>
        </Column>
        <Column data="ShippingName" label="Doprava" width="130" />
        <Column data="OrderStateTypeName" label="Stav" width="130" />
        <Column data="Description" label="Poznámka" width="130" />
        <Column data="TrackingUrl" label="Sledování zásilk" width="130" />
        <Column data="ParcelNumber" label="Číslo balíku" width="130" />
      </template>

      <template #actions="{ fetchedData }">
        <Action label="Nastavit stav" @click="setOrderState" icon="ListAlt" />

        <template>
          <Action label="Další možnosti" :visibility="{ header: true, row: false, context: false, }">
            <Action label="Tisk objendávek" @click="printOrders" />
            <Action label="Zobrazit PDF" @click="showPDF" />
            <Action label="Přegenerovat PDF" @click="regeneratePDF" />
            <Action label="Zobrazit/vygenerovat fakturu" @click="showInvoice" />
          </Action>
        </template>

        <template>
          <Action label="Export" :visibility="{ header: true, row: false, context: false, }">
            <Action label="Exportovat do Pohody" @click="exportPohoda" />
            <Action label="Exportovat všechny obj. do CSV" @click="exportToCsv" />
          </Action>
        </template>

        <template>
          <Action label="PPL" :visibility="{ header: true, row: false, context: false, }">
            <Action label="Vytvořit novou zásilku" @click="createNewPplShipment" />
            <Action label="Zobrazit štítek" @click="getAlreadyGeneratedPplLabels" />
            <Action label="Zobrazit seznam balíčků" @click="getPplPackageList" />
          </Action>
        </template>

        <template>
          <Action label="Zásilkovna" :visibility="{ header: true, row: false, context: false, }">
            <Action label="Odeslat objednávku do zásilkovny" @click="sendOrderToZasilkovna" />
            <Action label="Zobrazit štítek" @click="getZasilkovnaLabels" />
          </Action>
        </template>
      </template>
    </DataGrid>

    <SetOrderStateModal v-if="state.setOrderStateModal.show" @close="state.setOrderStateModal.show = false" :orderIDs="state.setOrderStateModal.orderIDs" />
    <OrderPreviewModal v-if="state.orderPreviewModal.show" @close="state.orderPreviewModal.show = false" :orderID="state.orderPreviewModal.orderID" />
  </div>
</template>

<style scoped>
.payment {
  width: 100%;
  position: relative;

  &.paid:after {
    content: "";
    border-radius: 8px;
    width: 5px;
    height: 5px;
    position: absolute;
    top: 4px;
    right: 0;
    background: green;
  }
}

.order-state-type-filter {
  margin-bottom: 20px;

  .filter-item {
    position: relative;
    z-index: 1;
    display: inline-block;
    padding: 8px 12px;
    outline: 0 !important;
    appearance: none;
    background: 0 0;
    border: 1px solid #c8c8c8;
    color: #777777;
    margin-bottom: -1px;
    margin-left: -1px;
    flex-grow: 1;
    max-width: 200px;
    font-size: 12px;
    cursor: pointer;
    border-radius: 4px;
    position: relative;

    &.active {
      border-color: green;
      z-index: 5;
      color: #000000;

      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: green;
      }
    }

    &:hover {
      background: #f3f3f3;
      color: #000000;
    }
  }
}
</style>