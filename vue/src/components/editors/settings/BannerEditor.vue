<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";

const props = defineProps({ ...editorProps });

const schema = object({
  Headline: string().required(),
  Eshop_ID: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/banner" :schema="schema" backURL="admin/settings/banner" name="Editor banerů" labelField="Headline">
    <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data.Headline }} </template>
    <template #titleCreate> {{ "Vytvořit záznam" }} </template>
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
          <InputField name="Rank" label="Pořadí" v-model="data.Rank" class="col-6" type="number" :showClear="true" />
          <InputField name="Headline" label="Název baneru" v-model="data.Headline" class="col-6" />
          <InputField name="Url" label="URL" v-model="data.Url" class="col-6" />
          <InputField name="LinkBtnText" label="Text tlačítka" v-model="data.LinkBtnText" class="col-6" />
          <TextArea v-model="data.Subline" label="Podtext" class="col-12" :rows="6" />

          <EditorFileInput
              name="File_ID"
              v-model="data.File_ID"
              label="Soubor banneru"
              uploadAttributes="banner"
              :file-name="data.FileName"
              accept="image/*"
              class="col-12"
              preview
              path="/files/images/banner/"
          />

        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>