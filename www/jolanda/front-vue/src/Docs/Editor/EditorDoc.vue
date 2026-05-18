<script setup>
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage import="global">
        <template #title> Editor </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <Prop>Editor</Prop> slouží pro vytvoření nebo úpravu záznamů.</p>
                <p class="mt-2">Do slotu #default si můžeme přidávat libovolné inputy. Pokud ovšem chceme používet standardní layout gridu, musíme pak použít ještě <Prop>EditorTab</Prop> a v něm <Prop>EditorGroup</Prop></p>

                <p class="mt-2">Editor používá v jádru <Prop>Form</Prop> komponentu. Takže například <Prop>schema</Prop> pro validaci se používá stejně jako ve formuláři.</p>
                <Preview
                    code='
          <script #setup>
            //import { object, string } from &apos;yup&apos;;

            const schema = object({
              Name: string().required(),
            })
          </script>

          <template>
            <Editor
              :manager="&apos;admin/user&apos;"
              :schema="schema"
              backURL="admin/user/list" <!-- nemusíme používat pokud je editor jen v modálu, ale lepší nastavit vždy -->
            >
              <template #default="{ data }">
                <InputField v-model="data.Name" name="Name" label="_l(&apos;Název&apos;)" />
              </template>
            </Editor>
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Layout editoru, EditorTab, EditorGroup">
                <p class="mt-2">Abychom dodrželi základní layout editoru použijeme ve slotu #default ještě <Prop>EditorTab</Prop> a v něm <Prop>EditorGroup</Prop></p>
                <Preview
                    code='
          <template>
            <Editor
              :manager="&apos;admin/user&apos;"
              backURL="admin/user/list"
            >
              <template #default="{ data }">
                <EditorTab :title="_l(&apos;Základní informace&apos;)">
                  <EditorGroup container row>
                    <InputField v-model="data.Name" name="Name" label="_l(&apos;Název&apos;)" class="col-6" />
                  </EditorGroup>
                </EditorTab>
              </template>
            </Editor>
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Předvyplnění hodnot">
                <p>Pomocí prop <Prop>defaultData</Prop> lze nastavit výchozí hodnoty formuláře.</p>
                <Preview
                    code='
          <template>
            <Editor
              :manager="&apos;admin/product&apos;"
              :schema="schema"
              :defaultData="{ Active: true }"
              backURL="admin/product/list"
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Dashboard a labelField">
                <p>Prop <Prop>dashboard</Prop> zobrazí editor v dashboard módu. Pomocí <Prop>labelField</Prop> lze nastavit, které pole bude použito jako titulek/tab popis.</p>
                <Preview
                    code='
          <template>
            <Editor
              :manager="&apos;admin/order&apos;"
              :schema="schema"
              dashboard
              labelField="OrderNumber"
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Zobrazení pravého panelu">
                <p>Pokud je prop <Prop>rightBar</Prop> nastaven na <code>true</code>, editor zobrazí pravou postranní oblast s dashboardem.</p>
                <Preview
                    code='
          <template>
            <Editor
              :manager="&apos;admin/user&apos;"
              :schema="schema"
              rightBar
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="fetchData">
                <p>Je možnost zapnout na editoru prop <Prop>fetchedData</Prop>. Editor pak udělá request na server na zadanou url z manageru, ale místo /data-list udělá ještě /data-editor. Je potřeba pak jen v manageru do funkce onDataEditor přidat co má vracet.</p>
                <Preview
                    code='
          <template>
            <Editor
              :manager="&apos;admin/user&apos;"
              :schema="schema"
              rightBar
              fetchedData
            />
              <template #default="{ data, fetchedData }">
                <InputField v-if="fetchedData.showName" v-model="data.Name" name="Name" label="_l(&apos;Název&apos;)" />
              </template>
            </Editor>
          </template>
        '
                >
                </Preview>
                <Preview
                    code="
          protected function onDataEditor(array $attributes): array
          {
            $data = parent::onDataEditor($attributes);

            $data['showName'] = true;

            return $data;
          }
        "
                >
                    <template #header> manager </template>
                </Preview>
            </Example>

            <Example title="Gridy">
                <p>Do editoru můžeme normálně přidávat i gridy, jen si zatím musíme pořešit jejich napojení na data editoru, je-li to třeba.</p>
                <Preview
                    code='
          <template>
            <Editor
              :manager="&apos;admin/user&apos;"
              :schema="schema"
              rightBar
              fetchedData
            />
              <template #default="{ data, fetchedData }">
                <DataGrid
                  :manager={
                    store: &apos;admin/user-info&apos;
                    params: {
                      User_ID: data.ID,
                    }
                  }
                >
                </DataGrid>
              </template>
            </Editor>
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Titulek pro edit a create">
                <p>Titulky pro edit a create se nastavují do slotu #titleUpdate a #titleCreate</p>
                <Preview
                    code='
          <template>
            <Editor
              :manager="&apos;admin/user&apos;"
              :schema="schema"
              rightBar
              fetchedData
            />
              <template #titleUpdate="{ id, data }">
                {{ _l("Edit produkt") }} {{ data?.Code }}
              </template>
              <template #titleCreate>
                {{ _l("Nový produkt") }}
              </template>
            </Editor>
          </template>
        '
                />
            </Example>

            <Example title="Editor na samostatné stránce">
                <p>Vytvoříme klasickou stránku podle postupu vytváření stránek a do ní dáme editor</p>
                <Preview
                    code="
          <script setup>
            //import ProductEditor from '@project/components/editors/product/ProductEditor.vue'
          </script>

          <template>
            <ProductEditor />
          </template>
        "
                />
            </Example>

            <Example title="Vlastní tlačítka">
                <Preview
                    code="
            <template>
              <Editor>
                <template #buttons>
                  <Button>Můj button</Button>
                </template>
              </Editor>
            </template>
          "
                />
            </Example>

            <Example title="Vlastnosti">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2">Prop</th>
                                <th class="px-4 py-2">Typ</th>
                                <th class="px-4 py-2">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>manager</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Identifikátor manageru (např. <code>admin/user</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>schema</Prop></td>
                                <td class="px-4 py-2"><code>Object | Function</code></td>
                                <td class="px-4 py-2">Schéma pro formulář.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String | Number</code></td>
                                <td class="px-4 py-2">ID záznamu (jinak se četlo z route).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>idFromRoute</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda číst ID z route (default <code>true</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>defaultData</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Předvyplněná data pro nový záznam.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>fetchData</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Načít dodatečná data.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>fetchDataURL</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">URL pro fetch dodatečných dat.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>backURL</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Route název pro návrat po uložení.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>rightBar</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazit pravý dashboard (default <code>true</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>dashboard</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Režim dashboardu (default <code>false</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název editoru (default <code>Editor</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>labelField</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Pole pro popis záznamu v tab liště (default <code>ID</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>grid</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Grid pro ruční napojení.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>readonly</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Nastavení editoru na readonly (schová tlačítka a zakáže submit) (default <code>false</code>)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>

            <Example title="Události">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2">Událost</th>
                                <th class="px-4 py-2">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono">@save</td>
                                <td class="px-4 py-2">Vyvoláno po úspěšném uložení dat.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">@error</td>
                                <td class="px-4 py-2">Vyvoláno při chybě při validaci nebo uložení.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">@back</td>
                                <td class="px-4 py-2">Vyvoláno při návratu zpět.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">@beforeUpdate</td>
                                <td class="px-4 py-2">Vyvolává se před update. Má parametry data a updateData funkci pro update dat</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">@beforeCreate</td>
                                <td class="px-4 py-2">Vyvolává se před create. Má parametry data a updateData funkci pro update dat</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">@beforeLoadData</td>
                                <td class="px-4 py-2">Vyvolává se před načtením dat do editoru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">@afterLoadData</td>
                                <td class="px-4 py-2">Vyvolává se po načtení dat do editoru. Má parametry state (celý state editoru) a result (stažené data ze serveru)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
