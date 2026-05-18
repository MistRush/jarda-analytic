<script setup>
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage>
        <template #title> DataGrid </template>

        <template #content>
            <p>Prop manager přímá stejné options jako useManager</p>

            <Example title="Základní použití">
                <p>Komponenta <Prop>DataGrid</Prop> slouží k vykreslení tabulkových dat s možností vyhledávání, filtrování, editace a mazání záznamů.</p>
                <Preview
                    code='
          <template>
            <DataGrid
              title="Uživatelé"
              :manager="&apos;admin/user&apos;"
              editorURL="user.edit"
              id="mujGrid"
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Deaktivace akcí">
                <p>Pomocí propů <Prop>enabledActions</Prop> lze vypnout jednotlivé akce jako např. mazání nebo editace.</p>
                <Preview
                    code='
          <template>
            <DataGrid
              title="Produkty"
              :manager="&apos;admin/product&apos;"
              :enabledActions="{ add: false, edit: false, remove: false }"
              id="mujGrid"
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Filtrace a sloupce">
                <p>Pomocí propů <Prop>filter</Prop> a <Prop>columnsSetting</Prop> lze zapnout nebo vypnout ovládací prvky pro filtrování a nastavení sloupců.</p>
                <Preview
                    code='
          <template>
            <DataGrid
              title="Objednávky"
              :manager="&apos;admin/order&apos;"
              :filter="false"
              :columnsSetting="false"
              id="mujGrid"
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Vícenásobný výběr">
                <p>Pomocí <Prop>selectType</Prop> lze zvolit režim výběru řádků. Např. <code>multi</code> nebo <code>multi_checkbox</code>.</p>
                <Preview
                    code='
          <template>
            <DataGrid
              title="Zaměstnanci"
              :manager="&apos;admin/employee&apos;"
              selectType="multi_checkbox"
              id="mujGrid"
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Sloupce">
                <p>Sloupce se přidávají do slotu #columns</p>
                <Preview
                    code='
          <template>
            <DataGrid
              title="Zaměstnanci"
              :manager="&apos;admin/employee&apos;"
              selectType="multi_checkbox"
              id="mujGrid"
            >
              <template #columns>
                <Column data="Ranking" label="Rank" format="number" width="65">
              </template>
            </DataGrid>
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="fetchData">
                <p>Je možnost zapnout na gridu prop <Prop>fetchedData</Prop>. Grid pak udělá request na server na zadanou url z manageru, ale místo /data-list udělá ještě /data-grid. Je potřeba pak jen v manageru do funkce onDataGrid přidat co má vracet.</p>
                <Preview
                    code='
          <template>
            <DataGrid
              title="Zaměstnanci"
              :manager="&apos;admin/employee&apos;"
              selectType="multi_checkbox"
              id="mujGrid"
              fetchedData
            >
              <template #columns="{fetchedData}">
                <Column v-if="fetchedData.showRanking" data="Ranking" label="Rank" format="number" width="65">
              </template>
            </DataGrid>
          </template>
        '
                >
                </Preview>
                <Preview
                    code="
          protected function onDataGrid(array $attributes): array
          {
            $data = parent::onDataGrid($attributes);

            $data['showRanking'] = true;

            return $data;
          }
        "
                >
                    <template #header> manager </template>
                </Preview>
            </Example>

            <Example title="Akce">
                <p>Akce se přidávají do slotu #actions a používá se na to komponenta <Prop>Action</Prop>. Actiony můžou být i vnořené. Lze nastiv i ikonu pro Action, která se zobrazí pouze v headeru.</p>
                <Preview
                    code='
          <script>
            //import Action from "@/DataGrid/Components/Action/Action.vue";
          </script>

          <template>
            <DataGrid
              title="Zaměstnanci"
              :manager="&apos;admin/employee&apos;"
              selectType="multi_checkbox"
              id="mujGrid"
            >
              <template #actions>
                <Action
                  v-if="!(user.Type === User.TYPE_BUYER)"
                  :label="_l(&apos;Hromadné přidání do košíku&apos;)"
                  :visibility="{
                    header: true,
                    row: true,
                    context: false,
                  }"
                  icon="delete"
                >
                  <Action :label="_l(&apos;Seznam produktů&apos;)" @click="showList" />
                  <Action :label="_l(&apos;Importovat z Excelu&apos;)" @click="import" />
                </Action>
              </template>
            </DataGrid>
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Editor">
                <p>Můžeme nastavit jestli editor má být na nové stránce a nebo v modálů. Pokud chceme upravil modal editoru, tak grid příjma prop <Prop>editorModal</Prop>, který předává všechno co je možné nastavit na komponentě <Prop>Modal</Prop></p>
                <Preview
                    code='
          <template>
            <DataGrid
              title="Zaměstnanci"
              :manager="&apos;admin/employee&apos;"
              selectType="multi_checkbox"
              id="mujGrid"
              :editorModal="{
                size: &apos;large&apos;
              }"
            >
              <template #editorDialog="{ id, close }">
                <MujEditor :id="id" :rightBar="false" />
              </template>
            </DataGrid>
          </template>
        '
                >
                    <template #header> Editor v modálu </template>
                </Preview>

                <Preview
                    code='
          <template>
            <DataGrid
              title="Zaměstnanci"
              :manager="&apos;admin/employee&apos;"
              selectType="multi_checkbox"
              id="mujGrid"
              editorURL="default/product/product-editor"
            >
            </DataGrid>
          </template>
        '
                >
                    <template #header> Editor v nové stránce/tabu </template>
                </Preview>
            </Example>

            <Example title="Order">
                <Preview
                    code='
      <script setup>
        const props = defineProps({
          id: {
            type: String,
            default: "mujGrid",
          }
        })
      </script>

      <template>
        <DataGrid
          //Možnost nastavit order jako object
          :order={
            column: "ID"
            dir: "asc"
          }
          //Možnost nastavit order jako string ("-" = desc)
          order="-ID"
        >
        </DataGrid>
      </template>
    '
                >
                </Preview>
            </Example>

            <Example title="RowFormatter">
                <p>rowFormatter umožňuje pro každý řádek nastavoval formátovaní. Funkce má 3 parametry (row, data, props).</p>
                <p class="mt-2">
                    row - html element řádku (zatím v nové verzi vrací vždy null)<br />
                    data - data řádku<br />
                    props - obsahuje zatím pouze style
                </p>

                <Preview
                    code='
      <script setup>
        const rowFormatter = (row, data, props) => {
            if(data.ID === 2){
                props.style["--rowColor"] = "red"; //nastaví barevný pruh na začátku řádku
                props.style.backgroundColor = "green"; //nastaví pozadí řádku
            }
        }
      </script>

      <template>
        <DataGrid
          :rowFormatter="rowFormatter"
        >
        </DataGrid>
      </template>
    '
                >
                </Preview>
            </Example>

            <Example title="useGrid">
                <p>Každý grid by měl mít jedinečné ID. Pokud píšeme vlastní grid, měli bychom zároveň umožnit programátorům při použití gridu ID přepsat, aby si pak mohl být jistý že je jedinečné atd.</p>
                <Preview
                    code='
          <script setup>
            const props = defineProps({
              id: {
                type: String,
                default: "mujGrid",
              }
            })
          </script>

          <template>
            <DataGrid
              title="Zaměstnanci"
              :manager="&apos;admin/employee&apos;"
              selectType="multi_checkbox"
              :id="props.id"
            >
            </DataGrid>
          </template>
        '
                >
                    <template #header> Ukázka práce s id gridu </template>
                </Preview>

                <p class="mt-4">Abychom si nemuseli předávat grid skrze xy komponent, můžeme použít useGrid(id), které nám vráti object DataGrid s daným id v aktuální stránce(tabu)</p>
                <Preview
                    code="
          <script setup>
            import { useGrid } from '@/DataGrid/js/useGrid.js';

            const { grid } = useGrid('mojeIDgridu');

            grid.refresh();
          </script>
        "
                >
                </Preview>
            </Example>

            <Example title="Propojení gridů">
                <p>Propojení funguje tak, že se nejprve inicializuje celý parentGrid a až potom začne inicializace child gridu, do kterého se předá již inicializovaný parentGrid. do propu parent můžeme dát i pole více objektů na propojení více gridů </p>
                <Preview
                    code='
&lt;script setup&gt;
    const {getGrid} = usePage();

    //První varianta
    const permissionGrid = computed(() => {
        return getGrid("permission") ?? null;
    })

    //Druhá varianta přes useGrid
    const { grid: permissionGrid } = useGrid("permission");
&lt;/script&gt;

<template>
    <div class="row">
        <div class="col-12 md:col-6">
            <PermissionGrid
                class="section"
            />
        </div>
        <div class="col-12 md:col-6">
            <UserPermissionGrid
                :parent="{
                    ref: permissionGrid,
                    parent: "ID",
                    child: "Permission_ID",
                }"
                class="section"
            />
        </div>
    </div>
</template>
        '
                >
                    <template #header> Ukázka propojení gridů </template>
                </Preview>

                <p class="mt-4">Abychom si nemuseli předávat grid skrze xy komponent, můžeme použít useGrid(id), které nám vráti object DataGrid s daným id v aktuální stránce(tabu)</p>
                <Preview
                    code="
          <script setup>
            import { useGrid } from '@/DataGrid/js/useGrid.js';

            const { grid } = useGrid('mojeIDgridu');

            grid.refresh();
          </script>
        "
                >
                </Preview>
            </Example>

            <Example title="Lokální gridy">
                <p>Pokud nepředáme do gridu prop manager, tak nebude stahovat data ze serveur a můžeme mu data předat přes prop data. Data příjma array objectů.</p>
                <Preview
                    code='
<script setup>
    const data = [
        { ID: 1, asdf: "1" },
        { ID: 2, asdf: "2" },
    ];
</script>

<template>
    <DataGrid
        :data="data"
    >
    </DataGrid>
</template>
        '
                >
                </Preview>

                <p class="mt-4">Pokud chceme i editor, musíme si vytvořit editor taky bez manageru a předat mu správná data gridu.</p>
                <Preview
                    code='
<script setup>
    const data = [
        { ID: 1, asdf: "1" },
        { ID: 2, asdf: "2" },
    ];
</script>

<template>
    <DataGrid
        :data="data"
    >
        <template #editorDialog="{ id, grid }">
            <Editor :id="id" :state="id ? grid.getCurrentItem() : {}">
                <template #default="{ data }">
                    <InputField v-model="data.asdf" name="asdf" />
                </template>
            </Editor>
        </template>
    </DataGrid>
</template>
        '
                >
                </Preview>

                <p class="mt-4">Pokud chceme data tabulky poslat jako data (subgridu), musíme si už kolem toho napsat vlastní logiku v editoru. Nejlépe navěsit na editor eventy jako @beforeUpdate</p>
            </Example>

            <Example title="Presety">
                <p>Presety jsou zatím v experimentální verzi a defaultně jsou vypnuté. Dají se zapnout na každém gridu pomocí propu <Prop>preset</Prop> (boolean) a nebo globálné zapnout. Globálně se nastavují i jestli presety budou lokální, nebo se ukládat na server, popřípadě na jakou URL adresu</p>
                <Preview
                    code='
<script setup>
    //import { PresetSetting } from "@/DataGrid/js/Settings/PresetSetting.js";
    //import { DataGrid } from "@/DataGrid/js/DataGrid.js";

    PresetSetting.SAVE_TYPE = PresetSetting.SAVE_TYPE_SERVERSIDE; //default PresetSetting.SAVE_TYPE_LOCAL
    PresetSetting.SERVERSIDE_URL = "/default/preset"; //default "/default/preset"
    DataGrid.USE_PRESETS = true; //zatím defaultně false
</script>
        '
                >
                    <template #header> Globální nastavení (např v Layoutu) </template>
                </Preview>
            </Example>

            <Example title="RowReorder">
                <p>Zapnutí rowReorderu přidá nové tlačítko nad grid, který otevře modál ve kterém probíhá řazení drag and dropem. Musíme předat jaký je sloupec na řazení, a sloupce které chceme vidět v tabulce pro řazení.</p>
                <Preview
                    code='
  <template>
            <DataGrid
              :rowReorder="{
                column: "Rank", //sloupec který ukládá pořadí
                //tableColumns říká jaké sloupce chceme vidět v tabulce na řazení
                tableColumns: [
                  {
                    data: "ID",
                    label: "ID",
                  },
                  {
                    data: "Name",
                    label: _l("Název"),
                  },
                ],
              }"
            />
  </template>
          '
                >
                    <template #header></template>
                </Preview>
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
                                <td class="px-4 py-2 font-mono"><Prop>title</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Nadpis tabulky.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>manager</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Příjmá stejné options jako useManager.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>enabledActions</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Zobrazit/skryt akce (add/edit/remove).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>editorURL</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Router název pro otevření editoru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>selectType</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Režim výběru řádků (<code>single</code>, <code>multi</code>, <code>multi_checkbox</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>filter</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazit tlačítko pro filtr.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>columnsSetting</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazit tlačítko pro nastavení sloupců.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>refresh</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazit tlačítko pro refresh.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>editorModal</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Parametry modalu pro inline editor.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>fetchData</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Načíst externí data před zobrazením tabulky.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>search</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Vazba na vyhledávací input (reactive).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>ajaxCount</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Počet řádků na stránku.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>order</Prop></td>
                                <td class="px-4 py-2"><code>Object | String</code></td>
                                <td class="px-4 py-2">Nastavení řazení gridu</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>rowFormatter</Prop></td>
                                <td class="px-4 py-2"><code>Function</code></td>
                                <td class="px-4 py-2">Nastavení formátovaní řádků</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>preset</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zapne/vypne presety na gridu. Pokud není prop předaný bere se z globální konfigurace</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>rowHeight</Prop></td>
                                <td class="px-4 py-2"><code>Number | String</code></td>
                                <td class="px-4 py-2">Nastavení výšky řádků v pixelech</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>actionLabels</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Nastaví jestli chceme u base actions labely, nebo pouze ikony (defaultně true)</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>height</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Nastavuje velikost gridu. Je potřeba předat string včetně jednotek (např 200px, 60vh...) (defaultně 68vh)</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>actionsColumn</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda se přidá actionColumn, který obsahuje tlačítka jako edit atd. (defaultně true)</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>exportAction</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda se přidá akce do kontextového menu pro export dat do csv. (defaultně false)</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>onAfterInlineEditConfirm</Prop></td>
                                <td class="px-4 py-2"><code>Function</code></td>
                                <td class="px-4 py-2">Fuknce která se zavlá po inline editaci (parametry: call, newData, oldData). V případě že funkce vrátí false, neprovede se refresh gridu.</td>
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
                                <th class="px-4 py-2 whitespace-nowrap">Událost</th>
                                <th class="px-4 py-2 whitespace-nowrap">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>rowDblclick</code></td>
                                <td class="px-4 py-2">Argumenty event, row</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>rowSelect</code></td>
                                <td class="px-4 py-2">Argumenty event, row</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>rowBeforeSelect</code></td>
                                <td class="px-4 py-2">Argumenty event, row</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>rowDeselect</code></td>
                                <td class="px-4 py-2">Argumenty event, row</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>rowBeforeDeselect</code></td>
                                <td class="px-4 py-2">Argumenty event, row</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>rowClick</code></td>
                                <td class="px-4 py-2">Argumenty event, row</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>rowBeforeClick</code></td>
                                <td class="px-4 py-2">Argumenty event, row</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
