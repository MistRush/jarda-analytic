<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useHelper } from "@project/composables/useHelper.js";

const props = defineProps({ ...editorProps });
const helper = useHelper();

const schema = object({
  invoiceAddress: object({
    FirstName: string().required(),
    LastName: string().required(),
    Street: string().required(),
    City: string().required(),
    ZipCode: string().required(),
  }),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/order" :schema="schema" backURL="admin/order/order" name="Editor objednávky" labelField="OrderNumber">
    <template #titleUpdate="{ id, data }"> {{ "Upravit objednávku" }}: {{ data.OrderNumber }} </template>
    <template #titleCreate> {{ "Vytvořit zákazníka" }} </template>
    <template #default="{ data }">
      <EditorTab title="Objednávka">
        <EditorGroup container row title="Informace o objednávce">
            <div class="col-12 leading-[21px]">
              <b>Číslo objednávky:</b> <Copy :text="data.OrderNumber" title="Zkopírovat" class="top-[4px]" /> {{ data.OrderNumber }}<br>
              <b>Datum vytvoření objednávky:</b> {{ helper.formatDate(data.Date) }}<br>
              <b>Datum zaplacení:</b> {{ data.DatePayed ? helper.formatDate(data.DatePayed ):"Dosud neuhrazeno" }}<br>
              <div v-if="data.Description"><b>Poznámka k objednávce:</b> {{ data.Description }}</div>
            </div>
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Zákazník">
        <EditorGroup container row title="Kontaktní informace">
          <div class="col-12 leading-[21px]">
            <b>Email:</b> <Copy :text="data.invoiceAddress.Email" title="Zkopírovat" class="top-[4px]" /> {{ data.invoiceAddress.Email }}<br>
            <b>Telefon:</b> <Copy :text="data.invoiceAddress.Phone" title="Zkopírovat" class="top-[4px]" /> {{ data.invoiceAddress.Phone }}<br>
          </div>
        </EditorGroup>

        <EditorGroup container row title="Fakturační adresa">
          <InputField name="invoiceAddress.FirstName" label="Křestní jméno" v-model="data.invoiceAddress.FirstName" class="col-6" />
          <InputField name="invoiceAddress.LastName" label="Příjmení" v-model="data.invoiceAddress.LastName" class="col-6" />
          <InputField name="invoiceAddress.Street" label="Ulice a číslo popisné" v-model="data.invoiceAddress.Street" class="col-6" />
          <InputField name="invoiceAddress.City" label="Město" v-model="data.invoiceAddress.City" class="col-6" />
          <InputField name="invoiceAddress.ZipCode" label="PSČ" v-model="data.invoiceAddress.ZipCode" class="col-6" />
          <div class="col-6"></div>
          <InputField name="invoiceAddress.CompanyName" label="Název společnosti" v-model="data.invoiceAddress.CompanyName" class="col-6" />
          <InputField name="invoiceAddress.IC" label="IČ" v-model="data.invoiceAddress.IC" class="col-6" />
          <InputField name="invoiceAddress.DIC" label="DIČ" v-model="data.invoiceAddress.DIC" class="col-6" />
        </EditorGroup>

        <EditorGroup container row title="Doručovací adresa">
          <InputField name="deliveryAddress.FirstName" label="Křestní jméno" v-model="data.deliveryAddress.FirstName" class="col-6" />
          <InputField name="deliveryAddress.LastName" label="Příjmení" v-model="data.deliveryAddress.LastName" class="col-6" />
          <InputField name="deliveryAddress.Street" label="Ulice a číslo popisné" v-model="data.deliveryAddress.Street" class="col-6" />
          <InputField name="deliveryAddress.City" label="Město" v-model="data.deliveryAddress.City" class="col-6" />
          <InputField name="deliveryAddress.ZipCode" label="PSČ" v-model="data.deliveryAddress.ZipCode" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab v-if="data.ID" title="Položky objednávky">
        <EditorGroup container row title="Souhrn dopravy a platby">
          <div class="col-4 leading-[21px]">
            <b>Doprava: </b>{{ data.ShippingName }}<br>
            <b>Cena bez DPH: </b>{{ helper.formatPrice(data.PriceShippingWithoutVat) }} Kč<br>
            <b>Cena s DPH: </b>{{ helper.formatPrice(data.PriceShippingWithVat) }} Kč<br>
          </div>

          <div class="col-4 leading-[21px]">
            <b>Platba: </b>{{ data.PaymentName }}<br>
            <b>Cena bez DPH: </b>{{ helper.formatPrice(data.PricePaymentWithoutVat) }} Kč<br>
            <b>Cena s DPH: </b>{{ helper.formatPrice(data.PricePaymentWithVat) }} Kč<br>
          </div>

          <div class="col-4 leading-[21px]">
            <b>Produkty bez DPH: </b>{{ helper.formatPrice(data.PriceProductWithoutVat) }} Kč<br>
            <b>Produkty s DPH: </b>{{ helper.formatPrice(data.PriceProductWithVat) }} Kč<br>

            <b>Celkem bez DPH: </b>{{ helper.formatPrice(data.PriceTotalWithoutVat) }} Kč<br>
            <b>Celkem s DPH: </b>{{ helper.formatPrice(data.PriceTotalWithVat) }} Kč<br>
          </div>
        </EditorGroup>

        <DataGrid
            id="orderItemGrid"
            :manager="{
                store: 'admin/order-item',
                params: {
                  Order_ID: data.ID
                }
              }"
            fetchData
            ref="gridRef"
            title="Položky objednávky"
            order="ID"
            class="section"
        >
          <template #columns>
            <Column data="ID" label="ID" width="50" />
            <Column data="ProductName" label="Produkt" width="400" />
            <Column data="PriceWithoutVat" label="Cena bez DPH" format="currency" />
            <Column data="PriceWithVat" label="Cena s DPH" format="currency" />
            <Column data="Quantity" label="Množství" :editable="true" />
            <Column data="TotalPriceWithoutVat" label="Celkem bez DPH" format="currency" />
            <Column data="TotalPriceWithVat" label="Celkem s DPH" format="currency" />
          </template>

          <template #editorDialog="{id}">
            <Editor
              v-bind="props"
              manager="admin/order-item"
              :id="id"
              name="Položka objednávky"
              :defaultData="{
                Order_ID: data.ID,
                Quantity: 0
              }"
            >
              <template #titleUpdate="{ id, data }"> {{ "Upravit položku objednávky" }}</template>
              <template #titleCreate> {{ "Vytvořit položku objednávky" }} </template>
              <template #default="{ data }">
                <EditorTab title="Položka objednávky">
                  <EditorGroup container row title="Položka objednávky">
                    <InputField name="Order_ID" type="hidden" v-model="data.ID" class="col-12"/>
                    <Select
                      name="Product_ID"
                      label="Produkt"
                      v-model="data.Product_ID"
                      remoteName="FullName"
                      filterable
                      :manager="{
                        store: {
                          module: 'admin',
                          controller: 'product',
                        },
                      }"
                      class="col-12"
                    />
                    <InputField name="Quantity" label="Množství" v-model="data.Quantity" class="col-12" :showClear="true" type="number" />
                    <InputField name="PriceWithoutVat" label="Cena ks bez DPH" v-model="data.PriceWithoutVat" class="col-12" :showClear="true" type="number" />
                    <InputField name="PriceWithVat" label="Cena ks s DPH" v-model="data.PriceWithVat" class="col-12" :showClear="true" type="number" />
                  </EditorGroup>
                </EditorTab>
              </template>
            </Editor>
          </template>
        </DataGrid>
      </EditorTab>



      <EditorTab v-if="data.ID" title="Stavy objednávky">
        <DataGrid
            id="orderStateGrid"
            :manager="{
                store: 'admin/order-state',
                params: {
                  Order_ID: data.ID
                }
              }"
            fetchData
            ref="gridRef"
            title="Stavy objednávky"
            order="ID"
            class="section"
        >
          <template #columns>
            <Column data="ID" label="ID" width="50" />
            <Column data="OrderStateTypeName" label="Stav objednávky" width="200" />
            <Column data="Date" label="Datum" format="date" />
            <Column data="Time" label="Čas" />
            <Column data="Description" label="Poznámka" />
            <Column data="TrackingNumber" label="Číslo balíku" />
          </template>

          <template #editorDialog="{id}">
            <Editor
              v-bind="props"
              manager="admin/order-state"
              :id="id"
              name="Stav objevnávky"
              :defaultData="{
                Order_ID: data.ID,
                Quantity: 0
              }"
            >
              <template #titleUpdate="{ id, data }"> {{ "Upravit stav objednávky" }}</template>
              <template #titleCreate> {{ "Vytvořit stav objednávky" }} </template>
              <template #default="{ data }">
                <EditorTab title="Stav objednávky">
                  <EditorGroup container row title="Stav objednávky">
                    <InputField name="Order_ID" type="hidden" v-model="data.ID" class="col-12"/>
                    <Select
                      name="OrderStateType_ID"
                      label="Stav objednávky"
                      v-model="data.OrderStateType_ID"
                      remoteName="NameCZ"
                      filterable
                      :manager="{
                        store: {
                          module: 'admin',
                          controller: 'order-state-type',
                        },
                      }"
                      class="col-12"
                    />
                    <TextArea name="Description" label="Poznámka" v-model="data.Description" class="col-12" :rows="12" />
                  </EditorGroup>
                </EditorTab>
              </template>
            </Editor>
          </template>
        </DataGrid>
      </EditorTab>

      <EditorTab title="Doprava">
        <EditorGroup container row title="Informace o dopravě">
          <InputField name="TrackingUrl" label="Tracking URL" v-model="data.TrackingUrl" class="col-6" />
          <InputField name="ParcelNumber" label="Číslo balíku" v-model="data.ParcelNumber" class="col-6" />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>