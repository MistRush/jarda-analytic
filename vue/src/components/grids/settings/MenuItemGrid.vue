<script setup>
import { ref } from "vue";
import { object, string } from "yup";

const gridRef = ref(null);

const props = defineProps({
  parent: Object,
});

const schema = object({
  Eshop_ID: string().required(),
  Name: string().required(),
  Url: string().required(),
});
</script>

<template>
  <div>
    <DataGrid
        id="menuItemGrid"
        :manager="{
              store: 'admin/menu-item',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat záznam',
          }"
        fetchData
        title="Položky menu"
        order="ID"
        :actionLabels="false"
        :parent="props.parent"
        :rowReorder="{
          column: 'Rank',
          tableColumns: [
            {
              data: 'ID',
              label: 'ID',
            },
            {
              data: 'Name',
              label: 'Název',
            },
          ],
        }"
    >
      <template #columns="{ fetchedData }">
        <Column data="ID" label="ID" width="50" />
        <Column data="Active" label="Aktivní" format="checkbox" />
        <Column data="InNewWindow" label="Otevřít v novém okně" format="checkbox" />
        <Column data="Rank" label="Pořadí" :editable="true" />
        <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
        <Column data="Name" label="Název" width="200" />
        <Column data="Url" label="URL" width="200" />
      </template>

      <template #editorDialog="{id}">
        <Editor v-bind="props" manager="admin/menu-item" :id="id" :schema="schema" backURL="admin/settings/popup" labelField="Name" name="Položka menu">
          <template #titleUpdate="{ id, data }"> {{ "Upravit záznam" }} {{ data?.Name }} </template>
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
                    class="col-12"
                />
                <Checkbox v-model="data.Active" label="Aktivní" class="col-12" />
                <Checkbox v-model="data.InNewWindow" label="Otevřít v novém okně" class="col-12" />
                <InputField name="Name" label="Název" v-model="data.Name" class="col-12" :showClear="true" />
                <InputField name="Url" label="URL" v-model="data.Url" class="col-12" :showClear="true" />
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