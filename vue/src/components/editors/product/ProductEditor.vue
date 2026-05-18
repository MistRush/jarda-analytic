<script setup>
import { editorProps } from "@/Components/Editor/Editor.vue";
import { object, string } from "yup";
import { useTranslations } from "@/Composables/useTranslation.js";
import { useVat } from "@project/composables/models/vat/useVat.js";

const props = defineProps({ ...editorProps });
const { locale, activeLanguages } = useTranslations();
const vat = useVat();

const schema = object({
  NameCZ: string().required(),
});

const schemaProductEshop = object({
  Price: string().required(),
  Vat_ID: string().required(),
});

const schemaProductParameter = object({
  Parameter_ID: string().required(),
  ParameterValue_ID: string().required(),
});
</script>

<template>
  <Editor v-bind="props" manager="admin/product" :schema="schema" backURL="admin/product/product" name="Editor produktů" :labelField="`Name${locale.Code}`">
    <template #titleUpdate="{ id, data }"> {{ "Upravit produkt" }}: {{ data.NameCZ }} </template>
    <template #titleCreate> {{ "Vytvořit produkt" }} </template>
    <template #default="{ data }">
      <EditorTab title="Základní informace">
        <EditorGroup v-for="language in activeLanguages" :key="language.Code" container row :title="`Jazyková mutace ${locale.Code}`">
          <InputField :name="`Name${language.Code}`" label="Název produktu" v-model="data[`Name${language.Code}`]" class="col-12" />
          <InputField :name="`Perex${language.Code}`" label="Perex" v-model="data[`Perex${language.Code}`]" class="col-12" />
          <InputField :name="`Title${language.Code}`" label="Titulek" v-model="data[`Title${language.Code}`]" class="col-12" />
          <InputField :name="`MetaDescription${language.Code}`" label="Meta description" v-model="data[`MetaDescription${language.Code}`]" class="col-12" />
          <TextArea :name="`ShortDescription${language.Code}`" label="Krátký popis" v-model="data[`ShortDescription${language.Code}`]" class="col-12" :rows="12" />
          <TinyMCE :name="`Content${language.Code}`" label="Content" v-model="data[`Content${language.Code}`]" class="col-12" />
          <InputField :name="`CustomAvailabilityInfo${language.Code}`" label="Vlastní info ke skladové dostupnosti" v-model="data[`CustomAvailabilityInfo${language.Code}`]" class="col-6" />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Další informace">
        <EditorGroup container row title="Další informace">
          <Checkbox v-model="data.FlagNews" label="Příznak novinka" class="col-6" />
          <Checkbox v-model="data.FlagClearanceSale" label="Příznak doprodej" class="col-6" />
          <InputField name="OnStock" label="Skladem" v-model="data.OnStock" class="col-6" />
          <InputField name="OnExternalStock" label="Skladem u dodavatele" v-model="data.OnExternalStock" class="col-6" />
          <InputField name="Code" label="Kód produktu" v-model="data.Code" class="col-6" />
          <InputField name="EAN" label="EAN" v-model="data.EAN" class="col-6" />
          <Select
              name="Manufacturer_ID"
              label="Výrobce"
              v-model="data.Manufacturer_ID"
              :manager="{
              store: {
                module: 'admin',
                controller: 'manufacturer',
              },
            }"
              class="col-6"
          />
        </EditorGroup>
      </EditorTab>
      <EditorTab title="Nastavení eshopů">
        <EditorGroup>
          <DataGrid
            id="productEshopGrid"
            :manager="{
              store: 'admin/product-eshop',
              params: {
                Product_ID: data.ID
              }
            }"
            fetchData
            ref="gridRef"
            title="Nastavení eshopu"
            order="ID"
            :enabledActions="{ add: false, edit: true, remove: false }"
          >
            <template #columns="{ fetchedData }">
              <Column data="ID" label="ID" width="70" />
              <Column data="Active" label="Aktivní" format="checkbox" />
              <Column data="Eshop_ID" label="Obchod" width="120" format="enum" :enumValues="fetchedData.eshops" />
              <Column data="ProductPriceTypeCode" label="Typ ceny" />
              <Column data="Price" label="Cena bez DPH" format="currency" />
              <Column data="Vat_ID" label="Daň" width="120" format="enum" :enumValues="vat.getVats()" />
              <Column data="Discount" label="Sleva" format="percent" />
            </template>
            <template #editorDialog="{id}">
              <Editor
                  ref="editorProductEshop"
                  :schema="schemaProductEshop"
                  v-bind="props"
                  manager="admin/product-eshop"
                  :id="id"
                  name="Nastavení eshopu"
                  :rightBar=false
                  :defaultData="{
                    Product_ID: data.ID
                  }"
              >
                <template #titleUpdate="{ id, data }"> {{ "Upravit nastavení eshopu" }}</template>
                <template #titleCreate> {{ "Vytvořit nastavení eshopu" }} </template>
                <template #default="{ data }">
                  <EditorTab title="Nastavení eshopu">
                    <EditorGroup container row title="Nastavení eshopu">
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
                      <div class="col-6"></div>
                      <Checkbox v-model="data.Active" label="V prodeji" class="col-6" />
                      <Checkbox v-model="data.Homepage" label="Homepage" class="col-6" />
                      <InputField name="Price" label="Cena bez DPH" v-model="data.Price" class="col-6" type="number" />
                      <InputField name="PriceVat" label="Cena s DPH" :modelValue="data.Price*1.12" class="col-6" type="number" readonly />
                      <Select
                          ref="productEshopVatID"
                          name="Vat_ID"
                          label="Daň"
                          v-model="data.Vat_ID"
                          :manager="{
                            store: {
                              module: 'admin',
                              controller: 'vat',
                            },
                          }"
                          class="col-6"
                      />
                      <InputField name="Discount" label="Sleva (%)" v-model="data.Discount" class="col-6" type="number" />
                    </EditorGroup>
                  </EditorTab>
                </template>
              </Editor>
            </template>
          </DataGrid>
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Kategorie produktu">
        <EditorGroup>
          <RelationSwitcher
              sourceManager="admin/category"
              relationManager="admin/product-in-category"
              :parentID="data.ID"
              parentColumn="Product_ID"
              childColumn="Category_ID"
              childNameColumn="NameCZ"
              groupByColumn="Category_ID"
              groupByNameColumn="NameCZ"
              label="Kategorie produkt;"
          />
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Parametry">
        <EditorGroup>
          <DataGrid
            id="productParameterGrid"
            :manager="{
              store: 'admin/product-parameter',
              params: {
                Product_ID: data.ID
              }
            }"
            title="Parametry"
            order="ID"
          >
            <template #columns>
              <Column data="ID" label="ID" width="80" />
              <Column data="ParameterName" label="Parametr" width="150" />
              <Column data="ParameterValue" label="Hodnota parametru" width="150" />
            </template>

            <template #editorDialog="{id}">
              <Editor
                  ref="editorProductParameter"
                  :schema="schemaProductParameter"
                  v-bind="props"
                  manager="admin/product-parameter"
                  :id="id"
                  name="Parametr"
                  :rightBar=false
                  :defaultData="{
                    Product_ID: data.ID
                  }"
              >
                <template #titleUpdate="{ id, data }"> {{ "Upravit parametr" }}</template>
                <template #titleCreate> {{ "Vytvořit nastavení eshopu" }} </template>
                <template #default="{ data }">
                  <EditorTab title="Parametr">
                    <EditorGroup container row title="Parametr">
                      <Select
                          name="Parameter_ID"
                          label="Parametr"
                          v-model="data.Parameter_ID"
                          remoteName="NameCZ"
                          :manager="{
                            store: {
                              module: 'admin',
                              controller: 'parameter',
                            },
                          }"
                          class="col-6"
                      />
                      <Select
                          name="ParameterValue_ID"
                          label="Parametr"
                          v-model="data.ParameterValue_ID"
                          remoteName="Value"
                          :manager="{
                            store: {
                              module: 'admin',
                              controller: 'parameter-value',
                            },
                            params: {
                              Parameter_ID: data.Parameter_ID
                            }
                          }"
                          class="col-6"
                      />
                    </EditorGroup>
                  </EditorTab>
                </template>
              </Editor>
            </template>
          </DataGrid>
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Fotografie">
        <EditorGroup>
          <DataGrid
              id="productImageGrid"
              :manager="{
              store: 'admin/product-image',
              params: {
                Product_ID: data.ID
              }
            }"
              fetchData
              ref="gridRef"
              title="Fotografie"
              order="Rank"
          >
            <template #columns>
              <Column data="ID" label="ID" width="70" />
              <Column
                  data="FullFileName"
                  label="Náhled"
                  width="75"
                  :filter="false"
                  format="gallery"
              />
              <Column data="Rank" label="Pořadí" :editable="true" />
              <Column data="Main" label="Hlavní" format="checkbox" />
              <Column data="Description" label="Popis" width="400" :editable="true" />
            </template>
            <template #editorDialog="{id}">
              <Editor
                ref="editorProductPhoto"
                v-bind="props"
                manager="admin/product-image"
                :id="id"
                name="Fotografie produktu"
                :rightBar=false
                :defaultData="{
                  Product_ID: data.ID
                }"
              >
                <template #titleUpdate="{ id, data }"> {{ "Upravit fotografii" }}</template>
                <template #titleCreate> {{ "Vytvořit fotografii" }} </template>
                <template #default="{ data: fileData }">
                  <EditorTab title="Fotografie">
                    <EditorGroup container row title="Fotografie">
                      <TextArea name="Description" label="Popis" v-model="fileData.Description" class="col-12" />
                      <EditorFileInput
                          name="File_ID"
                          v-model="fileData.File_ID"
                          label="Fotografie"
                          :uploadAttributes="{
                            type: 'product-photo',
                            Entity_ID: data.ID,
                          }"
                          :file-name="fileData.FileName"
                          accept="image/*"
                          class="col-12"
                          preview
                          path="/files/images/product/200/"
                      />
                    </EditorGroup>
                  </EditorTab>
                </template>
              </Editor>
            </template>
          </DataGrid>
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Dokumenty">
        <EditorGroup>
          <DataGrid
              id="productDocummentGrid"
              :manager="{
              store: 'admin/product-documment',
              params: {
                Product_ID: data.ID
              }
            }"
              fetchData
              ref="gridRef"
              title="Dokumenty"
              order="ID"
          >
            <template #columns>
              <Column data="ID" label="ID" width="70" />
              <Column data="FileName" label="Název souboru" width="250" />
              <Column data="Description" label="Popis" width="400" :editable="true" />
            </template>
            <template #editorDialog="{id}">
              <Editor
                ref="editorProductDocumment"
                v-bind="props"
                manager="admin/product-documment"
                :id="id"
                name="Dokument produktu"
                :rightBar=false
                :defaultData="{
                  Product_ID: data.ID
                }"
              >
                <template #titleUpdate="{ id, data }"> {{ "Upravit dokument" }}</template>
                <template #titleCreate> {{ "Vytvořit dokument" }} </template>
                <template #default="{ data: fileData }">
                  <EditorTab title="Dokument">
                    <EditorGroup container row title="Dokument">
                      <TextArea name="Description" label="Popis" v-model="fileData.Description" class="col-12" />
                      <EditorFileInput
                          name="File_ID"
                          v-model="fileData.File_ID"
                          label="Dokument"
                          :uploadAttributes="{
                            type: 'product-documment',
                            Entity_ID: data.ID,
                          }"
                          :file-name="fileData.FileName"
                          class="col-12"
                      />
                    </EditorGroup>
                  </EditorTab>
                </template>
              </Editor>
            </template>
          </DataGrid>
        </EditorGroup>
      </EditorTab>

      <EditorTab title="Podobné produkty">
        <EditorGroup>
          <DataGrid
              id="productSimiliarGrid"
              :manager="{
              store: 'admin/product-similiar',
              params: {
                Product_ID: data.ID
              }
            }"
              fetchData
              ref="gridRef"
              title="Podobné produkty"
              order="ID"
          >
            <template #columns>
              <Column data="ID" label="ID" width="70" />
              <Column data="ProductSimiliarName" label="Název podobného produktu" width="600" />
            </template>
            <template #editorDialog="{id}">
              <Editor
                ref="editorProductSimiliar"
                v-bind="props"
                manager="admin/product-similiar"
                :id="id"
                name="Podobné produkty"
                :rightBar=false
                :defaultData="{
                  Product_ID: data.ID
                }"
              >
                <template #titleUpdate="{ id, data }"> {{ "Upravit podobný produkt" }}</template>
                <template #titleCreate> {{ "Vytvořit podobný produkt" }} </template>
                <template #default="{ data }">
                  <EditorTab title="Podobný produkt">
                    <EditorGroup container row title="Podobný produkt">
                      <Select
                        name="ProductSimiliar_ID"
                        label="Produkt"
                        v-model="data.ProductSimiliar_ID"
                        :manager="{
                          store: {
                            module: 'admin',
                            controller: 'product-simple',
                          },
                        }"
                        class="col-12"
                      />
                    </EditorGroup>
                  </EditorTab>
                </template>
              </Editor>
            </template>
          </DataGrid>
        </EditorGroup>
      </EditorTab>
    </template>
  </Editor>
</template>

<style scoped></style>