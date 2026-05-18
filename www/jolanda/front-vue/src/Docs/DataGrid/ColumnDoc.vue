<script setup>
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage>
        <template #title> Column </template>

        <template #content>
            <Example title="Základní sloupec">
                <p>
                    Komponenta
                    <Prop>Column</Prop>
                    se používá uvnitř
                    <Prop>DataGrid</Prop>
                    a definuje jednotlivý sloupec tabulky.
                </p>
                <Preview
                    code='
          <template>
            <DataGrid :manager="&apos;admin/user&apos;" title="Uživatelé">
              <template #columns>
                <Column data="Name" label="Jméno" />
              </template>
            </DataGrid>
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Formát a zarovnání">
                <p>
                    Pomocí
                    <Prop>format</Prop>
                    lze nastavit typ zobrazení (např. <code>text</code>, <code>currency</code>, <code>boolean</code> apod.).
                </p>
                <ul class="pl-4">
                    <li>- <Prop>text</Prop></li>
                    <li>- <Prop>number</Prop></li>
                    <li>- <Prop>date</Prop></li>
                    <li>- <Prop>time</Prop></li>
                    <li>- <Prop>datetime</Prop></li>
                    <li>- <Prop>bool</Prop></li>
                    <li>- <Prop>timestamp</Prop></li>
                    <li>- <Prop>currency</Prop>: Přes prop currency můžeme předat currency mark. (CZK, EUR, USD, GBP, PLN)</li>
                    <li>- <Prop>enum</Prop>: Vyžaduje předat enumValues prop</li>
                    <li>- <Prop>checkbox</Prop></li>
                    <li>- <Prop>longtext</Prop></li>
                    <li>- <Prop>percent</Prop></li>
                    <li>- <Prop>gallery</Prop></li>
                    <li>- <Prop>counter</Prop></li>
                    <li>- <Prop>html</Prop></li>
                </ul>

                <Preview
                    code='
          <template>
            <Column data="Price" label="Cena" format="currency" currency="CZK" />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Custom vykreslení">
                <p>
                    Pomocí slotu <code>cell</code> nebo
                    <Prop>formatFunction</Prop>
                    lze vykreslit vlastní obsah buňky.
                </p>
                <Preview
                    code='
          <template>
            <Column data="Email" label="Email">
              <template #cell="{ data, cell }">
                <a :href="`mailto:${data}`">{{ data }}  {{cell.rowData.ID}}</a>
              </template>
            </Column>
          </template>
        '
                />
            </Example>

            <Example title="Currency">
                <p>Na Column typ Currency můžeme defaultné zapnout ať se vždy dělí hodnota 100. Například do Layoutu přidáme globální nastavení pro tento typ sloupce. Defaultně vypnuto.</p>
                <Preview
                    code='
          <script>
            //import { ColumnTypeCurrency } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCurrency.js";

            ColumnTypeCurrency.VALUE_IS_DECIMAL = false;
          </script>
        '
                />

                <p class="mt-2">Popřípadě můžeme toto nastavovat individuálné pro každý sloupec pomocí prop <Prop>currencyIsDecimal</Prop>. Pokud ho nezadáme nastaví se globálné nastavený (defaultně true). Můžeme taky u každého sloupce individuálně (případné globálně, viz níže) nastavit počet desetinných míst.</p>
                <Preview
                    code='
          <template>
            <Column data="Price" label="Cena" format="currency" currency="CZK" :currencyIsDecimal="false" :decimals="4" />
          </script>
        '
                />

                <p class="mt-2">Můžeme nastavit globálně počet desetinných míst pro column currency (defaultně 2)</p>
                <Preview
                    code='
          <template>
            //import { ColumnTypeCurrency } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCurrency.js";

            ColumnTypeCurrency.DECIMALS = 4;
          </script>
        '
                />
            </Example>

            <Example title="Gallery">
                <p class="mt-2">Format gallery vykreslí sloupec jako náhledy fotek s možností otevřít je jako galerii. Pokud data sloupce nejsou přímo cesta s k souboru musíme předat funkci imgPath, která definuje cestu k souboru.</p>
                <Preview
                    code='
          <template>
            <Column
              v-if="user.Type !== User.TYPE_SUPPLIER"
              data="BrandName"
              :label="_l("Výrobce dílu")"
              width="75"
              :filter="false"
              format="gallery"
              :img-path="
                (data) => {
                  return (
                    "/project/img/brands/" +
                    data
                    .toLowerCase()
                    .replace(/[^a-zA-Z -\/]/, "")
                    .replace(/[ \/]/, "-")
                    .replace(/[ \/]/, "-") +
                    ".png"
                  );
                }
              "
            />
          </template>
        '
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
                                <td class="px-4 py-2 font-mono">
                                    <Prop>data</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název pole v datech.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>label</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Záhlaví sloupce.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>format</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Formát zobrazení (např. <code>text</code>, <code>currency</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>formatFunction</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Function</code></td>
                                <td class="px-4 py-2">Vlastní funkce pro formátování hodnoty.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>editable</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda je buňka editovatelná.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>defaultContent</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Text pokud je hodnota prázdná.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>visible</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda je sloupec viditelný (default <code>true</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>orderable</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda lze sloupec třídit (default <code>true</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>width</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String | Number</code></td>
                                <td class="px-4 py-2">Pevná šířka sloupce.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>minWidth</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String | Number</code></td>
                                <td class="px-4 py-2">Minimální šířka sloupce.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>enumValues</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Mapování hodnot pro enum typy.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>selectValues</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Array</code></td>
                                <td class="px-4 py-2">Možné hodnoty pro select typ.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>currency</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Používaná měna (při <code>format='currency'</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>currencyIsDecimal</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Nastavuje jestli se má měna dělit 100 (při <code>format='currency'</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>filter</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda se sloupec objeví v panelu filtrů (default <code>true</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>preview</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda se sloupec objeví v preview modálu (default <code>true</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>imgPath</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Function</code></td>
                                <td class="px-4 py-2">Definuje cestu k obrázku, pokud použijeme format="gallery"</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>overflowPreview</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda se na sloupci bude ukazovat overflowPreview (default <code>true</code>)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
