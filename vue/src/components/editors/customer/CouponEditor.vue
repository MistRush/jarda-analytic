<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useTranslations } from "@/Composables/useTranslation.js";

const props = defineProps({ ...editorProps });
const { locale, activeLanguages } = useTranslations();

const schema = object({
  Code: string().max(8, 'Maximálně 8 znaků').required(),
  NameCZ: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/coupon" :schema="schema" backURL="admin/customer/coupon" name="Editor kupónu" :labelField="`Name${locale.Code}`" fetchData>
    <template #titleUpdate="{ id, data }"> {{ "Upravit kupón" }}: {{ data.NameCZ }} </template>
    <template #titleCreate> {{ "Vytvořit kupón" }} </template>
    <template #default="{ data, fetchedData }">
      <EditorTab title="Základní informace">
        <EditorGroup v-for="language in activeLanguages" :key="language.Code" container row :title="`Jazyková mutace ${locale.Code}`">
          <InputField :name="`Name${language.Code}`" label="Název stránky" v-model="data[`Name${language.Code}`]" class="col-6" />
        </EditorGroup>

        <EditorGroup container row title="Další Nastavení">
          <InputField name="Code" label="Kód" v-model="data.Code" class="col-6" />
          <Select name="Type" v-model="data.Type" label="Typ" :options="fetchedData.types" class="col-6" />
          <InputField name="Quantity" label="Množství" v-model="data.Quantity" class="col-6" type="number" />
          <Select
              name="Product_ID"
              label="Produkt"
              v-model="data.Product_ID"
              :manager="{
              store: {
                module: 'admin',
                controller: 'product-simple',
              },
            }"
              class="col-6"
          />
          <InputField name="Discount" label="Sleva (CZK/%)" v-model="data.Discount" class="col-6" type="number" value="0" />
        </EditorGroup>

        <EditorGroup container row title="Dodatečné Nastavení">
          <DatePicker name="ExpiryDate" v-model="data.ExpiryDate" label="Datum Expirace" class="col-6" />
          <InputField name="MinOrder" label="Minimální objednávka (CZK)" v-model="data.MinOrder" class="col-6" type="number" value="0" />
          <Select
              name="User_ID"
              label="Uživatel"
              v-model="data.User_ID"
              :manager="{
              store: {
                module: 'user',
                controller: 'user',
              },
            }"
              class="col-6"
          />
          <InputField name="TotalCount" label="Maximální počet použití" v-model="data.MinOrder" class="col-6" type="number" value="0" />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>