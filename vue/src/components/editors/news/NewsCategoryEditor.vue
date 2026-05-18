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
  <Editor v-bind="props" manager="admin/news-category" :schema="schema" backURL="admin/news/news-category" name="Editor kategorie článků" :labelField="`Name${locale.Code}`">
    <template #titleUpdate="{ id, data }"> {{ "Upravit kategorii článků" }}: {{ data.NameCZ }} </template>
    <template #titleCreate> {{ "Vytvořit kategorii článků" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup v-for="language in activeLanguages" :key="language.Code" container row :title="`Jazyková mutace ${locale.Code}`">
          <InputField :name="`Name${language.Code}`" label="Název" v-model="data[`Name${language.Code}`]" class="col-12" />
          <TextArea :name="`ShortDescription${language.Code}`" label="Krátký popis" v-model="data[`ShortDescription${language.Code}`]" class="col-12" :rows="4" />
          <TinyMCE :name="`Description${language.Code}`" label="Popis" v-model="data[`Description${language.Code}`]" class="col-12" />
        </EditorGroup>

        <EditorGroup container row title="Základní informace">
          <Select
              name="NewsCategory_ID"
              label="Nadkategorie"
              v-model="data.NewsCategory_ID"
              remoteName="NameCZ"
              :manager="{
              store: {
                module: 'admin',
                controller: 'news-category',
              },
            }"
            class="col-12"
          />
          <EditorFileInput
              name="File_ID"
              v-model="data.File_ID"
              label="Piktogram kategorie"
              uploadAttributes="category-pictogram"
              :file-name="data.FileName"
              accept="image/*"
              class="col-12"
              preview
              path="/files/images/category-pictogram/"
          />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>