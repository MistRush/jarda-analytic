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
  <Editor v-bind="props" manager="admin/order-state-type" :schema="schema" backURL="admin/settings/order-state-type" name="Editor stavu" :labelField="`Name${locale.Code}`">
    <template #titleUpdate="{ id, data }"> {{ "Upravit stav" }}: {{ data.NameCZ }} </template>
    <template #titleCreate> {{ "Vytvořit stav" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="Definice stavů objednávky">
          <Checkbox name="SendEmail" label="Odeslat email" v-model="data.SendEmail" class="col-6" />
          <InputField name="Color" label="Barva" v-model="data.Color" class="col-6" type="color" />
        </EditorGroup>

        <EditorGroup v-for="language in activeLanguages" :key="language.Code" container row :title="`Jazyková mutace ${locale.Code}`">
          <InputField :name="`Name${language.Code}`" label="Název stavu" v-model="data[`Name${language.Code}`]" class="col-6" />
          <InputField :name="`EmailHeader${language.Code}`" label="Hlavička emailu" v-model="data[`EmailHeader${language.Code}`]" class="col-6" />
          <TinyMCE :name="`EmailContent${language.Code}`" label="Obsah emailu" v-model="data[`EmailContent${language.Code}`]" :height="400" class="col-12" />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>