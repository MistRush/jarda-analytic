<script setup>
import { ref, computed } from "vue";
import { useUser } from "@project/composables/models/user/useUser.js";

const user = useUser();
const isAdmin = computed(() => user.getCurrentUserType() == user.userTypes.TYPE_SUPERADMIN || user.getCurrentUserType() == user.userTypes.TYPE_ADMIN)
const gridRef = ref(null);
</script>

<template>
  <div>
    <DataGrid
        id="userGrid"
        :manager="{
              store: 'user/user',
          }"
        ref="gridRef"
        :search="{
              column: ['Name'],
              placeholder: 'Vyhledat uživatelský účet',
          }"
        title="Uživatelské účty"
        editorURL="admin/user/edit-user"
        order="ID"
    >
      <template #columns>
        <Column data="ID" label="ID" width="50" />
        <Column v-if="isAdmin" data="Active" label="Aktivní" format="checkbox" />
        <Column data="Name" label="Uživatelský účet" width="200" />
        <Column data="Type" label="Typ účtu" width="150" format="enum" :enumValues="user.getUserTypes()" />
        <Column data="RegistrationDate" label="Datum registrace" format="date" />
        <Column data="LastLogin" label="Datum posledního přihlášení" format="date" />
        <Column data="CountLogin" label="Počet přihlášení" format="date" />
      </template>
    </DataGrid>
  </div>
</template>
<script lang="ts">
</script>