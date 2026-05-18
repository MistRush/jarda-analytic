<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";

const props = defineProps({ ...editorProps });

const schema = object({
  Name: string().required(),
  Phone: string().required(),
  Email: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/complaint" :schema="schema" backURL="admin/complaint/complaint" name="Editor reklamací" labelField="Name">
    <template #titleUpdate="{ id, data }"> {{ "Upravit reklamaci" }}: {{ data.Name }} </template>
    <template #titleCreate> {{ "Vytvořit reklamaci" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="Základní informace">
          <InputField name="Name" label="Jméno" v-model="data.Name" class="col-6" />
          <InputField name="Email" label="Email" v-model="data.Email" class="col-6" />
          <InputField name="Phone" label="Telefon" v-model="data.Phone" class="col-6" />
        </EditorGroup>
        <EditorGroup container row title="Firemní údaje">
          <InputField name="CompanyName" label="Název společnosti:" v-model="data.CompanyName" class="col-6" />
          <InputField name="IC" label="IČ" v-model="data.IC" class="col-6" />
          <InputField name="DIC" label="DIČ" v-model="data.DIC" class="col-6" />
        </EditorGroup>
        <EditorGroup container row title="Fakturační údaje">
          <InputField name="InvoiceStreet" label="Ulice" v-model="data.InvoiceStreet" class="col-6" />
          <InputField name="InvoiceCity" label="Město" v-model="data.InvoiceCity" class="col-6" />
          <InputField name="InvoiceZipCode" label="PSČ" v-model="data.InvoiceZipCode" class="col-6" />
        </EditorGroup>
        <EditorGroup container row title="Doručovací údaje">
          <InputField name="DeliveryName" label="Název společnosti/Jméno" v-model="data.DeliveryName" class="col-6" />
          <InputField name="DeliveryStreet" label="Ulice" v-model="data.DeliveryStreet" class="col-6" />
          <InputField name="DeliveryZipCode" label="PSČ" v-model="data.DeliveryZipCode" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab v-if="data.ID" title="Položky reklamací">
        <DataGrid
            id="complaintItemGrid"
            :manager="{
                store: 'admin/complaint-item',
                params: {
                  Complaint_ID: data.ID
                }
              }"
            fetchData
            ref="gridRef"
            title="Položky reklamací"
            order="ID"
            class="section"
        >
          <template #columns>
            <Column data="ID" label="ID" />
            <Column data="InvoiceNumber" label="Číslo faktury" />
            <Column data="ProductNumber" label="Číslo produktu" />
            <Column data="Amount" label="Početu kusů" />
            <Column data="Description" label="Popis" />
          </template>

          <template #editorDialog="{id}">
            <Editor
              v-bind="props"
              manager="admin/complaint-item"
              :id="id"
              labelField="ProductNumber"
              name="Položka reklamace"
              :defaultData="{
                Complaint_ID: data.ID,
                Amount: 0
              }"
            >
              <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.ProductNumber }} </template>
              <template #titleCreate> {{ "Vytvořit záznam" }} </template>
              <template #default="{ data }">
                <EditorTab title="Položka reklamace">
                  <EditorGroup container row title="Číslo produktu">
                    <InputField name="Complaint_ID" type="hidden" v-model="data.ID" class="col-12"/>
                    <InputField name="InvoiceNumber" label="Název" v-model="data.InvoiceNumber" class="col-12" :showClear="true" />
                    <InputField name="ProductNumber" label="Název" v-model="data.ProductNumber" class="col-12" :showClear="true" />
                    <InputField name="Amount" label="Název" v-model="data.Amount" class="col-12" :showClear="true" type="number" />
                    <InputField name="Description" label="Název" v-model="data.Description" class="col-12" :showClear="true" />
                  </EditorGroup>
                </EditorTab>
              </template>
            </Editor>
          </template>
        </DataGrid>
     </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>