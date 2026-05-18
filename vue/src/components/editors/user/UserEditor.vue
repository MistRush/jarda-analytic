<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useUser } from "@project/composables/models/user/useUser.js";
import {computed} from "vue";

const user = useUser();
const isAdmin = computed(() => user.getCurrentUserType() == user.userTypes.TYPE_SUPERADMIN || user.getCurrentUserType() == user.userTypes.TYPE_ADMIN)
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
  Type: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="user/user" :schema="schema" backURL="admin/user/user" name="Editor uživatelských účtů" labelField="Name">
    <template #titleUpdate="{ id, data }"> {{ "Upravit uživatele" }}: {{ data.Name }} </template>
    <template #titleCreate> {{ "Vytvořit uživatele" }} </template>
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
          <Select name="Type" v-model="data.Type" label="Typ" :options="user.getUserTypes()" class="col-6" />
        </EditorGroup>

        <EditorGroup container row title="Základní informace">
          <InputField name="ContactName" label="Jméno" v-model="data.ContactName" class="col-6" />
          <InputField name="ContactDescription" label="Popis pozice" v-model="data.ContactDescription" class="col-6" />
          <InputField name="ContactPhone" label="Telefon" v-model="data.ContactPhone" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab v-if="isAdmin" title="Nastavení eshopů">
        <EditorGroup container row title="Nastavení eshopů">
          <RelationSwitcher
              source-manager="/common/eshop"
              relation-manager="/user/user-eshop"
              :parentID="data.ID"
              parentColumn="User_ID"
              childColumn="Eshop_ID"
              childNameColumn="Name"
              label="Přístup k obchodům"
              class="col-12"
          />
        </EditorGroup>
      </EditorTab>

      <EditorTab v-if="isAdmin" title="Nastavení přístupu">
        <EditorGroup container row title="Nastavení přístupu">
          <RelationSwitcher
              source-manager="/user/permission"
              relation-manager="/user/user-has-permission"
              :parentID="data.ID"
              parentColumn="User_ID"
              childColumn="Permission_ID"
              childNameColumn="Name"
              label="Přístupová práva"
              class="col-12"
          />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>