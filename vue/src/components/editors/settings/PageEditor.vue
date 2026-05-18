<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useTranslations } from "@/Composables/useTranslation.js";

const props = defineProps({ ...editorProps });
const { locale, activeLanguages } = useTranslations();

const schema = object({
  NameCZ: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/page" :schema="schema" backURL="admin/settings/page" name="Editor stránek" :labelField="`Name${locale.Code}`">
    <template #titleUpdate="{ id, data }"> {{ "Upravit stránku" }}: {{ data.NameCZ }} </template>
    <template #titleCreate> {{ "Vytvořit stránku" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup v-for="language in activeLanguages" :key="language.Code" container row :title="`Jazyková mutace ${locale.Code}`">
          <InputField :name="`Name${language.Code}`" label="Název stránky" v-model="data[`Name${language.Code}`]" class="col-6" />
          <InputField :name="`Title${language.Code}`" label="Titulek" v-model="data[`Title${language.Code}`]" class="col-6" />
          <InputField :name="`MetaDescription${language.Code}`" label="Meta description" v-model="data[`MetaDescription${language.Code}`]" class="col-12" />
          <InputField :name="`MetaKeywords${language.Code}`" label="Meta keywords" v-model="data[`MetaKeywords${language.Code}`]" class="col-12" />
          <TinyMCE :name="`Content${language.Code}`" label="Content" v-model="data[`Content${language.Code}`]" class="col-12" />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Nastavení eshopů">
        <EditorGroup>
          <DataGrid
            id="pageEshopGrid"
            :manager="{
              store: 'admin/page-eshop',
              params: {
                Page_ID: data.ID
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