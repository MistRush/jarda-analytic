<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { usePayment } from "@project/composables/models/payment/usePayment.js";
import { useVat } from "@project/composables/models/vat/useVat.js";

const props = defineProps({ ...editorProps });
const vat = useVat();
const payment = usePayment();

const schema = object({
  Eshop_ID: string().required(),
  Name: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/payment" :schema="schema" backURL="admin/settings/payment" name="Editor platebních metod" labelField="Name">
    <template #titleUpdate="{ id, data }"> {{ "Upravit platební metodu" }}: {{ data.Name }} </template>
    <template #titleCreate> {{ "Vytvořit platební metodu" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="Základní informace">
          <Select
            name="Eshop_ID"
            label="Eshop"
            v-model="data.Eshop_ID"
            :manager="{
              store: {
                module: 'common',
                controller: 'eshop',
              },
            }"
            class="col-6"
          />
          <InputField name="Name" label="Název" v-model="data.Name" class="col-6" />
          <InputField name="Price" label="Cena" v-model="data.Price" type="number" class="col-6" />
          <Select
            name="Vat_ID"
            label="Daň"
            v-model="data.Vat_ID"
            :manager="{
              store: {
                module: 'admin',
                controller: 'vat',
              },
            }"
            class="col-6"
          />
          <Select name="VatType" v-model="data.VatType" label="Daň u ceny" :options="vat.getVatCountTypes()" class="col-6" />
          <Select name="Type" v-model="data.Type" label="Type" :options="payment.getTypes()" class="col-6" />
          <InputField name="BankAccount" label="Bankovní účet" v-model="data.BankAccount" class="col-6" :readonly="data.Type==payment.types.TYPE_BANK" />
          <InputField name="IBAN" label="IBAN" v-model="data.IBAN" class="col-6" :readonly="data.Type==payment.types.TYPE_BANK" />
          <TextArea name="Description" label="Poznámka" v-model="data.Description" class="col-12" :rows="12" />

          <EditorFileInput
              name="File_ID"
              v-model="data.File_ID"
              label="Logo platby"
              uploadAttributes="logo"
              :file-name="data.FileName"
              accept="image/*"
              class="col-12"
              preview
              path="/files/images/logo/"
          />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>