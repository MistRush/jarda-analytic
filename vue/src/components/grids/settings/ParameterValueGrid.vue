<script setup>
import { ref } from "vue";
import { object, string } from "yup";

const gridRef = ref(null);

const props = defineProps({
  parent: Object,
});

const schema = object({
  Value: string().required(),
});
</script>

<template>
  <div>
    <DataGrid
        id="parameterValueGrid"
        :manager="{
              store: 'admin/parameter-value',
          }"
        ref="gridRef"
        :search="{
              column: ['Value'],
              placeholder: 'Vyhledat záznam',
          }"
        fetchData
        title="Hodnoty parametru"
        order="ID"
        :parent="props.parent"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column data="Value" label="Hodnota" width="200" />
        <Column data="Additional" label="Rozšíření" width="200" />
      </template>

      <template #editorDialog="{id}">
        <Editor v-bind="props" manager="admin/parameter-value" :id="id" :schema="schema" backURL="admin/settings/parameter-value" labelField="Value" name="Hodnota parametru">
          <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.Value }} </template>
          <template #titleCreate> {{ "Vytvořit záznam" }} </template>
          <template #default="{ data }">
            <EditorTab title="Základní informace">
              <EditorGroup container row title="Základní informace">
                <InputField name="Value" label="Hodnota" v-model="data.Value" class="col-12" :showClear="true" />
                <InputField name="Additional" label="Rozšíření" v-model="data.Additional" class="col-12" :showClear="true" />
              </EditorGroup>
            </EditorTab>
          </template>
        </Editor>
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>