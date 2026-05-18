<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useCurrency } from "@project/composables/models/currency/useCurrency.js";
import { useLanguage } from "@project/composables/models/language/useLanguage.js";
import { useVat } from "@project/composables/models/vat/useVat.js";

const props = defineProps({ ...editorProps });
const currency = useCurrency();
const language = useLanguage();
const vat = useVat();

const schema = object({
  Name: string().required(),
  URL: string().required(),
  Language_ID: string().required(),
  Currency_ID: string().required(),
  Vat_ID: string().required(),

  settings: object({
    ProjectName: string().required(),
    ProjectURL: string().required(),
    ProjectShortURL: string().required(),
    PriceDecimalPlaces: string().required(),
    EnableRegistration: string().required(),
    ContactPhone: string().required(),
    ContactEmail: string().required(),
    ContactPerson: string().required(),
    OpeningHours: string().required(),
    AddressStreet: string().required(),
    RegistrationNumber: string().required(),
    SenderName: string().required(),
    SenderEmail: string().required(),
    NotifyEmail: string().required()
  })
});
</script>

<template>
  <Editor v-bind="props" manager="common/eshop" :schema="schema" backURL="admin/settings/eshop" name="Editor eshopu" labelField="Name">
    <template #titleUpdate="{ id, data }"> {{ "Upravit projekt" }}: {{ data.NameCZ }} </template>
    <template #default="{ data }">
      <EditorTab title="Hlavní nastavení">
        <EditorGroup container row title="Hlavní nastavení">
          <Checkbox v-model="data.Active" label="Aktivní" class="col-12" />
          <InputField name="Name" label="Název eshopu" v-model="data.Name" class="col-6" />
          <InputField name="URL" label="Název eshopu" v-model="data.URL" class="col-6" />
          <Select name="Language_ID" v-model="data.Language_ID" label="Jazyk" :options="language.getLanguages()" class="col-6" />
          <Select name="Currency_ID" v-model="data.Currency_ID" label="Měna" :options="currency.getCurrencies()" class="col-6" />
          <Select name="Vat_ID" v-model="data.Vat_ID" label="DPH" :options="vat.getVats()" class="col-6" />

          <EditorFileInput
              name="File_ID"
              v-model="data.FileLogo_ID"
              label="Logo eshopu"
              uploadAttributes="logo"
              :file-name="data.FileName"
              accept="image/*"
              class="col-12"
              preview
              path="/files/images/logo/"
          />
        </EditorGroup>
        <EditorGroup container row title="Další Nastavení">
          <InputField name="settings.ProjectName" label="Název projektu" v-model="data.settings.ProjectName" class="col-6" help="karel" />
          <InputField name="settings.ProjectURL" label="URL projektu" v-model="data.settings.ProjectURL" class="col-6" />
          <InputField name="settings.ProjectShortURL" label="Zkrácená URL projektu" v-model="data.settings.ProjectShortURL" class="col-6" />
          <InputField name="settings.PriceDecimalPlaces" label="Počet desetinných míst u cen" v-model="data.settings.PriceDecimalPlaces" class="col-6" />
          <InputField name="settings.EnableRegistration" label="Zákaznická registrace" v-model="data.settings.EnableRegistration" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Kontaktni informace">
        <EditorGroup container row title="Kontak">
          <InputField name="settings.ContactPhone" label="Kontaktní telefon" v-model="data.settings.ContactPhone" class="col-6" />
          <InputField name="settings.ContactEmail" label="Kontaktní email" v-model="data.settings.ContactEmail" class="col-6" />
          <InputField name="settings.ContactPerson" label="Kontaktní osoba" v-model="data.settings.ContactPerson" class="col-6" />
          <InputField name="settings.OpeningHours" label="Otvírací doba" v-model="data.settings.OpeningHours" class="col-6" />
        </EditorGroup>
        <EditorGroup container row title="Adresa">
          <InputField name="settings.AddressStreet" label="Ulice a č.p." v-model="data.settings.AddressStreet" class="col-6" />
          <InputField name="settings.AddressCity" label="Město" v-model="data.settings.AddressCity" class="col-6" />
          <InputField name="settings.AddressZipCode" label="PSČ" v-model="data.settings.AddressZipCode" class="col-6" />
        </EditorGroup>
        <EditorGroup container row title="Společnost">
          <InputField name="settings.RegistrationNumber" label="IČ" v-model="data.settings.RegistrationNumber" class="col-6" />
          <InputField name="settings.VATNumber" label="DIČ" v-model="data.settings.VATNumber" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Nastavení emailu">
        <EditorGroup container row title="Nastavení emailu">
          <InputField name="settings.SenderName" label="Jméno odesílatele" v-model="data.settings.SenderName" class="col-6" />
          <InputField name="settings.SenderEmail" label="Email odesílatele" v-model="data.settings.SenderEmail" class="col-6" />
          <InputField name="settings.NotifyEmail" label="Email pro notifikace (objednávka, napište nám, ...)" v-model="data.settings.NotifyEmail" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Sociální sítě">
        <EditorGroup container row title="Sociální sítě">
          <InputField name="settings.FacebookURL" label="Facebook URL" v-model="data.settings.FacebookURL" class="col-6" />
          <InputField name="settings.FacebookName" label="Facebook název" v-model="data.settings.FacebookName" class="col-6" />
          <InputField name="settings.InstagramURL" label="Instagram URL" v-model="data.settings.InstagramURL" class="col-6" />
          <InputField name="settings.InstagramName" label="Instagram název" v-model="data.settings.InstagramName" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Analytické nástroje">
        <EditorGroup container row title="Google Analytics">
          <InputField name="settings.AnalyticsCode" label="Kód" v-model="data.settings.AnalyticsCode" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Marketplace">
        <EditorGroup container row title="Heureka">
          <Checkbox v-model="data.settings.HeurekaOverenoZakazniky" label="Heureka ověřeno zákazníky" class="col-6" />
          <Checkbox v-model="data.settings.HeurekaMereniKonverzi" label="Heureka měření konverzí" class="col-6" />
          <InputField name="settings.HeurekaSecretKey" label="Heureka tajný klíč" v-model="data.settings.HeurekaSecretKey" class="col-6" />
          <InputField name="settings.HeurekaPublicKey" label="Heureka veřejný klíč" v-model="data.settings.HeurekaPublicKey" class="col-6" />
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>