<script setup>
import Select from "@/Components/Inputs/Select.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    selected: null,
    multiple: false,
    filterable: false,
});
</script>

<template>
    <DocPage import="global">
        <template #title> Select </template>
        <template #content>
            <Example title="Základní použití">
                <p>
                    Komponenta
                    <Prop>Select</Prop>
                    podporuje základní výběr jedné hodnoty z pole
                    <Prop>options</Prop>
                    .
                </p>
                <Preview
                    code="
          <template>
            <Select
              v-model=&quot;selected&quot;
              :options=&quot;[{ text: 'Jablko', value: 'apple' }, { text: 'Banán', value: 'banana' }]&quot;
              label=&quot;Ovoce&quot;
            />
          </template>
        "
                >
                    <Select
                        v-model="state.selected"
                        :options="[
                            { text: 'Jablko', value: 'apple' },
                            { text: 'Banán', value: 'banana' },
                        ]"
                        label="Ovoce"
                    />
                </Preview>
            </Example>

            <Example title="Vícenásobný výběr">
                <p>
                    Pomocí
                    <Prop>multiple</Prop>
                    lze vybírat více možností najednou.
                </p>
                <Preview
                    code="
          <template>
            <Select
              v-model=&quot;selected&quot;
              multiple
              :options=&quot;[{ text: 'A', value: 'a' }, { text: 'B', value: 'b' }]&quot;
              label=&quot;Možnosti&quot;
            />
          </template>
        "
                >
                    <Select
                        v-model="state.selected"
                        multiple
                        :options="[
                            { text: 'A', value: 'a' },
                            { text: 'B', value: 'b' },
                        ]"
                        label="Možnosti"
                    />
                </Preview>
            </Example>

            <Example title="Vyhledávání">
                <p>
                    Nastavením
                    <Prop>filterable</Prop>
                    zpřístupníš vstup pro filtrování položek v dropdownu.
                </p>
                <Preview
                    code="
          <template>
            <Select
              v-model=&quot;selected&quot;
              filterable
              :options=&quot;[{ text: 'Praha', value: 'prague' }, { text: 'Brno', value: 'brno' }]&quot;
              label=&quot;Město&quot;
            />
          </template>
        "
                >
                    <Select
                        v-model="state.selected"
                        filterable
                        :options="[
                            { text: 'Praha', value: 'prague' },
                            { text: 'Brno', value: 'brno' },
                        ]"
                        label="Město"
                    />
                </Preview>
            </Example>

            <Example title="Načítání ze serveru">
                <p>
                    Pomocí propů
                    <Prop>manager</Prop>
                    může komponenta načítat data z API. Automaticky podporuje lazy loading při scrollování.
                </p>
                <Preview
                    code='
          <template>
            <Select
              v-model="selected"
              :manager="{
                 store: &apos;admin/product&apos;, // Manager pro výběr produktu, podporuje stejné options jako useManager
              }"
              label="Země"
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Vrácení objektu">
                <p>
                    Nastavením
                    <Prop>returnObject</Prop>
                    bude modelValue obsahovat celý objekt vybrané položky.
                </p>
                <Preview
                    code='
          <template>
            <Select
              v-model="selected"
              :options="[{ text: &apos;CZ&apos;, value: { code: &apos;cz&apos; } }]"
              returnObject
              label="Země"
            />
          </template>
        '
                >
                    <Select v-model="state.selected" :options="[{ text: 'CZ', value: { code: 'cz' } }]" returnObject label="Země" />
                </Preview>
            </Example>

            <Example title="Placeholder a mazání">
                <p>
                    Pokud máš
                    <Prop>placeholder</Prop>
                    a není
                    <Prop>required</Prop>
                    , komponenta umožní vymazat výběr.
                </p>
                <Preview
                    code="
          <template>
            <Select
              v-model=&quot;selected&quot;
              placeholder=&quot;Vyberte zemi&quot;
              :options=&quot;[{ text: 'CZ', value: 'cz' }, { text: 'SK', value: 'sk' }]&quot;
              label=&quot;Země&quot;
            />
          </template>
    "
                >
                    <Select
                        v-model="state.selected"
                        placeholder="Vyberte zemi"
                        :options="[
                            { text: 'CZ', value: 'cz' },
                            { text: 'SK', value: 'sk' },
                        ]"
                        label="Země"
                    />
                </Preview>
            </Example>

            <Example title="Chyba">
                <p>
                    Přes prop
                    <Prop>error</Prop>
                    zobrazíš chybovou hlášku pod selectem.
                </p>
                <Preview
                    code='
          <template>
            <Select
              v-model="selected"
              :options="[&apos;A&apos;, &apos;B&apos;]"
              error="Tato volba je povinná"
              label="Volba"
            />
          </template>
    '
                >
                    <Select v-model="state.selected" :options="['A', 'B']" error="Tato volba je povinná" label="Volba" />
                </Preview>
            </Example>
            <Example title="Help">
                <p>
                    Prop
                    <Prop>help</Prop>
                    umožňuje zobrazit nápovědu.
                </p>
                <Preview
                    code="
          <template>
            <Select
              v-model=&quot;selected&quot;
              :options=&quot;[{ text: 'Jablko', value: 'apple' }, { text: 'Banán', value: 'banana' }]&quot;
              label=&quot;Ovoce&quot;
              help=&quot;Nápověda&quot;
            />
          </template>
        "
                >
                    <Select
                        v-model="state.selected"
                        :options="[
                            { text: 'Jablko', value: 'apple' },
                            { text: 'Banán', value: 'banana' },
                        ]"
                        label="Ovoce"
                        help="Nápověda"
                    />
                </Preview>
            </Example>
            <Example title="Optgroup">
                <p>
                    Optgroup se nastavuje přes prop <prop>group-by</prop>
                </p>
                <Preview
                        code="
          <template>
            <Select
                :options=&quot;[
                    { value: 1, text: 'Carrot', category: 'Veg' },
                    { value: 2, text: 'Apple', category: 'Fruit' },
                    { value: 3, text: 'Mimo skupinu' },
                    { value: 4, text: 'Onion', category: 'Veg' },
                ]&quot;
                group-by=&quot;category&quot;
            />
          </template>
        "
                >
                    <Select
                        :options="[
                            { value: 1, text: 'Carrot', category: 'Veg' },
                            { value: 2, text: 'Apple', category: 'Fruit' },
                            { value: 3, text: 'Mimo skupinu' },
                            { value: 4, text: 'Onion', category: 'Veg' },
                        ]"
                        group-by="category"
                    />
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
                                <td class="px-4 py-2 font-mono"><Prop>options</Prop></td>
                                <td class="px-4 py-2"><code>Array | Object</code></td>
                                <td class="px-4 py-2">Seznam možností pro výběr (statický).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>modelValue</Prop></td>
                                <td class="px-4 py-2"><code>String | Object | Array</code></td>
                                <td class="px-4 py-2">Aktuální hodnota.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>placeholder</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Text zobrazený při prázdné hodnotě.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek pole.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>filterable</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda je možné možnosti filtrovat textem.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>filterableParam</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název parametru pro filtrování při AJAXu (default <code>q</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>url</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">URL pro vzdálené načítání dat.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>manager</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Manager pro automatické generování URL a parametrů.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>pageSize</Prop></td>
                                <td class="px-4 py-2"><code>Number | Boolean</code></td>
                                <td class="px-4 py-2">Počet načtených záznamů najednou (default 10). Pokud chceme načíst všechna data najednou předáme <code>false</code></td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>multiple</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Umožňuje výběr více možností.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>returnObject</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Vrací celý objekt místo hodnoty.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>remoteName</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název vlastnosti obsahující název (text) v AJAXu (default <code>Name</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>remoteIdentifier</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Identifikátor položky z AJAXu (default <code>ID</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>remoteValueObject</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Vrací celý objekt jako hodnotu i při načtení z AJAXu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>textFromValue</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Vytváří text z hodnoty (pro objektové hodnoty).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>textProperty</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název klíče, odkud se čte text (při <code>textFromValue</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>readonly</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Znepřístupní výběr.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>size</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Velikost inputu: <code>small</code>, <code>default</code>, <code>large</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">HTML id inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí chybovou hlášku pod polem.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>help</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí nápovědu v tooltipu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>minSearchLength</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Minimální počet znaků pro ajaxové vyhledávání. (default <code>3</code>)</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>groupBy</Prop></td>
                                <td class="px-4 py-2"><code>String | Function</code></td>
                                <td class="px-4 py-2">
                                    Zapne seskupování (optgroup) v seznamu. Pokud je <code>String</code>, bere se jako název property v objektu option (např. <code>"category"</code>). Pokud je <code>Function</code>, dostane jako parametr option a má vrátit název skupiny (string). Option bez skupiny spadnou do <code>ungroupedLabel</code>.
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>groupSort</Prop></td>
                                <td class="px-4 py-2"><code>Function</code></td>
                                <td class="px-4 py-2">
                                    Vlastní řazení skupin. Funkce dostane <code>(a, b)</code> (labely skupin) a má vrátit hodnotu pro sort (jako u <code>Array.sort</code>). Pokud není zadané, skupiny se řadí abecedně.
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>ungroupedLabel</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">
                                    Název skupiny pro položky, které nemají hodnotu pro <code>groupBy</code> (chybí / je <code>null</code> / prázdný string). Pokud je prázdné, skupina se nevykreslí jako nadpis a položky se zobrazí bez group headeru.
                                </td>
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
                                <td class="px-4 py-2 font-mono"><code>@update:modelValue</code></td>
                                <td class="px-4 py-2">Vyvoláno při změně vybrané hodnoty.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@change</code></td>
                                <td class="px-4 py-2">Alias pro <code>@update:modelValue</code>, odesílá novou hodnotu.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
