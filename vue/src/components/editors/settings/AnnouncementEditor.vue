<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useAnnouncement } from "@project/composables/models/announcement/useAnnouncement.js";

const props = defineProps({ ...editorProps });

const announcement = useAnnouncement();
const schema = object({
  DateFrom: string().required(),
  DateTo: string().required(),
  Eshop_ID: string().required(),
  Type: string().required(),
  Content: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/announcement" :schema="schema" backURL="admin/settings/announcement" name="Editor oznámení" dashboard>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="Základní informace">
          <Checkbox v-model="data.Active" label="Aktivní" class="col-12" />
          <DatePicker v-model="data.DateFrom" label="Datum od" class="col-6" />
          <DatePicker v-model="data.DateTo" label="Datum do" class="col-6" />
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
          <Select name="Type" v-model="data.Type" label="Typ" :options="announcement.getTypes()" class="col-6" />
          <TextArea v-model="data.Content" label="Obsah sdělení" class="col-12" :rows="12" />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>