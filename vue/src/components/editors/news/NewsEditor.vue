<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";

const props = defineProps({ ...editorProps });

const schema = object({
  Eshop_ID: string().required(),
  NewsCategory_ID: string().required(),
  Headline: string().required(),
  Perex: string().required(),
  ReadingTime: string().required(),
  Date: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/news" :schema="schema" backURL="admin/news/news" name="Editor článku" labelField="Headline">
    <template #titleUpdate="{ id, data }"> {{ "Upravit kategorii článků" }}: {{ data.NameCZ }} </template>
    <template #titleCreate> {{ "Vytvořit kategorii článků" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="základní informace">
          <Select
              name="Eshop_ID"
              label="Eshop"
              v-model="data.Eshop_ID"
              remoteName="Name"
              :manager="{
              store: {
                module: 'common',
                controller: 'eshop',
              },
            }"
            class="col-6"
          />
          <Select
              name="NewsCategory_ID"
              label="Kategorie"
              v-model="data.NewsCategory_ID"
              remoteName="NameCZ"
              :manager="{
              store: {
                module: 'admin',
                controller: 'news-category',
              },
            }"
              class="col-6"
          />

          <InputField name="Headline" label="Název" v-model="data.Headline" class="col-6" />
          <InputField name="Perex" label="Perex" v-model="data.Perex" class="col-6" />
          <InputField name="ReadingTime" label="Doba čtení" v-model="data.ReadingTime" class="col-6" type="number" />
          <InputField name="Date" label="Datum" v-model="data.Date" class="col-6" type="date" />
          <TinyMCE name="Content" label="Obsah" v-model="data.Content" class="col-12" />
          <EditorFileInput
              name="File_ID"
              v-model="data.File_ID"
              label="Zástupný obrázek"
              uploadAttributes="news"
              :file-name="data.FileName"
              accept="image/*"
              class="col-12"
              preview
              path="/files/images/news/50/"
          />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>