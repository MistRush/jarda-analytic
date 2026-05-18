<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useVat } from "@project/composables/models/vat/useVat.js";

const props = defineProps({ ...editorProps });
const vat = useVat();

const schema = object({
  Eshop_ID: string().required(),
  Name: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/shipping" :schema="schema" backURL="admin/settings/shipping" name="Editor dopravních metod" labelField="Name">
    <template #titleUpdate="{ id, data }"> {{ "Upravit dopravní metodu" }}: {{ data.Name }} </template>
    <template #titleCreate> {{ "Vytvořit dopravní metodu" }} </template>
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
          <InputField name="Code" label="Kóc" v-model="data.Code" class="col-6" />
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
          <TextArea name="Description" label="Poznámka" v-model="data.Description" class="col-12" :rows="12" />
          <EditorFileInput
              name="File_ID"
              v-model="data.File_ID"
              label="Logo dopravce"
              uploadAttributes="logo"
              :file-name="data.FileName"
              accept="image/*"
              class="col-12"
              preview
              path="/files/images/logo/"
          />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Použité dopravy">
        <EditorGroup container row title="Základní informace">
          <RelationSwitcher
              source-manager="/admin/payment"
              relation-manager="/admin/shipping-payment"
              :parentID="data.ID"
              parentColumn="Shipping_ID"
              childColumn="Payment_ID"
              childNameColumn="Name"
              label="Použitelné platby"
              class="col-12"
          />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>