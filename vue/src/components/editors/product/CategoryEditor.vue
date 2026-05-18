<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useTranslations } from "@/Composables/useTranslation.js";

const props = defineProps({ ...editorProps });
const { locale, activeLanguages } = useTranslations();

const schema = object({
  NameCZ: string().required(),
  slugCZ: string().required(),
  TitleCZ: string().required(),
  MetaDescriptionCZ: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/category" :schema="schema" backURL="admin/product/category" name="Editor kategorií" :labelField="`Name${locale.Code}`">
    <template #titleUpdate="{ id, data }"> {{ "Upravit kategorii" }}: {{ data.NameCZ }} </template>
    <template #titleCreate> {{ "Vytvořit kategorii" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="Základní informace">
          <Select
              name="Category_ID"
              label="Nadkategorie"
              v-model="data.Category_ID"
              remoteName="NameCZ"
              :manager="{
              store: {
                module: 'admin',
                controller: 'category',
              },
            }"
              class="col-6"
          />
          <EditorFileInput
              name="File_ID"
              v-model="data.File_ID"
              label="Obrázek kategorie"
              uploadAttributes="category-photo"
              :file-name="data.FileName"
              accept="image/*"
              class="col-12"
              preview
              path="/files/images/category/200/"
          />
        </EditorGroup>

        <EditorGroup v-for="language in activeLanguages" :key="language.Code" container row :title="`Jazyková mutace ${locale.Code}`">
          <InputField :name="`Name${language.Code}`" label="Název" v-model="data[`Name${language.Code}`]" class="col-6" />
          <InputField :name="`H1Name${language.Code}`" label="H1 název" v-model="data[`H1Name${language.Code}`]" class="col-6" />
          <InputField :name="`slug${language.Code}`" label="URL" v-model="data[`slug${language.Code}`]" class="col-6" help="Místo mezer použít -. Žádné háčky, čárky apod. Pokud necháte prázdné, vytvoří se dle názvu." />
          <TextArea name="ShortDescription" label="Krátký popis" v-model="data.Description" class="col-12" :rows="2" />
          <TinyMCE :name="`Description${language.Code}`" label="Popis" v-model="data[`Description${language.Code}`]" class="col-12" />
          <InputField :name="`Title${language.Code}`" label="Meta title" v-model="data[`Title${language.Code}`]" class="col-12" />
          <InputField :name="`MetaDescription${language.Code}`" label="Meta description" v-model="data[`MetaDescription${language.Code}`]" class="col-12" />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Nastavení eshopů">
        <EditorGroup>
          <DataGrid
            id="categoryEshopGrid"
            :manager="{
              store: 'admin/category-eshop',
              params: {
                Category_ID: data.ID
              }
            }"
            fetchData
            ref="gridRef"
            title="Nastavení eshopu"
            order="ID"
            :enabledActions="{ add: false, edit: false, remove: false }"
          >
            <template #columns="{ fetchedData }">
              <Column data="ID" label="ID" />
              <Column data="Active" label="Aktivní" format="checkbox" />
              <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
            </template>
          </DataGrid>
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>