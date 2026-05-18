<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";

const props = defineProps({ ...editorProps });

const schema = object({
  Name: string().required().test('check-username', 'Jméno už existuje', async function (value) {
    const email = this.parent.ID;
    const res = await fetch(`/admin/user/check-user-exist?UserName=${value}&User_ID=${email}`);
    const data = await res.json();
    return data.result=='ok';
  }),
  Password: string().required(),
  Eshop_ID: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/customer" :schema="schema" backURL="admin/customer/customer" name="Editor zákaznického účtů" labelField="Name">
    <template #titleUpdate="{ id, data }"> {{ "Upravit zákazníka" }}: {{ data.Name }} </template>
    <template #titleCreate> {{ "Vytvořit zákazníka" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup container row title="Základní informace">
          <InputField name="Name" label="Název účtu" v-model="data.Name" class="col-6" />
          <InputField name="Password" label="Heslo" v-model="data.Password" type="password" class="col-6" />
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
        </EditorGroup>

        <EditorGroup container row title="Základní informace">
          <InputField name="Discount" label="Sleva (%):" v-model="data.Discount" class="col-12" type="number" :showClear="true" />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>