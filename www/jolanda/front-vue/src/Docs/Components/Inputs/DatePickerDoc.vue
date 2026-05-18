<script setup>
import DatePicker from "@/Components/Inputs/DatePicker.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    singleDate: "2025-05-13",
    singleDate2: "25.04.1998",
    rangeDate: {
        from: "2025-05-01",
        to: "2025-05-13",
    },
    type: "date",
    returnObject: false,
    size: "default",
});
</script>

<template>
    <DocPage import="global">
        <template #title> DatePicker </template>
        <template #content>
            <Example title="Základní použití">
                <p>Komponenta podporuje výběr jednoho data pomocí <Prop>v-model</Prop>. Výchozí typ je <code>date</code>.</p>
                <Preview
                    code='
          <template>
            <DatePicker v-model="date" label="Datum" />
          </template>
        '
                >
                    <DatePicker v-model="state.singleDate" label="Datum" />
                </Preview>
            </Example>

            <Example title="Výběr rozsahu">
                <p>Pokud nastavíme prop <Prop>range</Prop>, komponenta umožní výběr <strong>od - do</strong>.</p>
                <Preview
                    code='
          <template>
            <DatePicker v-model="dateRange" range label="Rozsah dat" />
          </template>
        '
                >
                    <DatePicker v-model="state.rangeDate" range label="Rozsah dat" />
                </Preview>
            </Example>

            <Example title="Typ vstupu">
                <p>Prop <Prop>type</Prop> mění typ vstupu – podporuje <code>date</code>, <code>time</code> a <code>datetime</code>.</p>
                <Preview
                    code='
          <template>
            <DatePicker v-model="date" type="date" label="Datum a čas" />
          </template>
        '
                >
                    <DatePicker v-model="state.singleDate" :type="state.type" label="Datum a čas" />
                </Preview>
            </Example>

            <Example title="Formáty">
                <p>Můžeš ovlivnit formát vracených a zobrazených hodnot pomocí <Prop>returnFormat</Prop> a <Prop>inputFormat</Prop>. Např. <code>DD.MM.YYYY</code>, <code>YYYY-MM-DD</code>, atd.</p>
                <Preview
                    code='
          <template>
            <DatePicker v-model="date" returnFormat="DD.MM.YYYY" inputFormat="DD.MM.YYYY" label="Formátovaný datum" />
          </template>
        '
                >
                    <DatePicker v-model="state.singleDate2" returnFormat="DD.MM.YYYY" inputFormat="DD.MM.YYYY" label="Formátovaný datum" />
                </Preview>
            </Example>

            <Example title="Return jako objekt">
                <p>Pomocí <Prop>returnObject</Prop> můžeš místo stringu získat přímo <code>Date</code> objekt (nebo objekt s <code>from</code> / <code>to</code> u rozsahu).</p>
                <Preview
                    code='
          <template>
            <DatePicker v-model="date" :returnObject="true" label="Datum (objekt)" />
          </template>
        '
                >
                    <DatePicker v-model="state.singleDate" :returnObject="true" label="Datum (objekt)" />
                </Preview>
            </Example>

            <!--  <Example>-->
            <!--    <template #title>Velikost vstupu</template>-->
            <!--    <p>Pomocí <Prop>size</Prop> lze ovlivnit velikost pole, např. <code>default</code> nebo <code>small</code>.</p>-->
            <!--    <Preview code='-->
            <!--      <template>-->
            <!--        <DatePicker v-model="date" size="small" label="Malé pole" />-->
            <!--      </template>-->
            <!--    '>-->
            <!--      <DatePicker v-model="state.singleDate" size="small" label="Malé pole" />-->
            <!--    </Preview>-->
            <!--  </Example>-->

            <Example title="Chyba">
                <p>Chybu můžeš předat pomocí <Prop>error</Prop>.</p>
                <Preview
                    code='
          <template>
            <DatePicker v-model="date" error="Vyplňte prosím datum" label="Datum" />
          </template>
        '
                >
                    <DatePicker v-model="state.singleDate" error="Vyplňte prosím datum" label="Datum" />
                </Preview>
            </Example>

            <Example title="Help">
                <p>
                    Prop
                    <Prop>help</Prop>
                    umožňuje zobrazit nápovědu.
                </p>
                <Preview
                    code='
          <template>
            <DatePicker v-model="date" label="Datum" help="Nápověda" />
          </template>
        '
                >
                    <DatePicker v-model="state.singleDate" label="Datum" help="Nápověda" />
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
                                <td class="px-4 py-2 font-mono"><Prop>modelValue</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Vstupní hodnota. Může být datum nebo objekt <code>{ from, to }</code> v případě rozsahu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>returnObject</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Vrací objekt místo naformátovaného řetězce.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>returnFormat</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Formát výstupního řetězce (např. <code>YYYY-MM-DD</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>inputFormat</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Formát pro vstupní hodnotu (např. <code>YYYY-MM-DD</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>range</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zapne výběr rozsahu <code>{ from, to }</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek vstupu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>type</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Typ výběru – <code>date</code>, <code>time</code>, <code>datetime</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>size</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Velikost vstupu (např. <code>default</code>, <code>small</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">ID vstupu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název pro formulářové odeslání.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Chybová hláška pod vstupem.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>help</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí nápovědu v tooltipu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>readonly</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Vstup je pouze pro čtení.</td>
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
                                <td class="px-4 py-2">Emitováno při změně hodnoty datumu nebo rozsahu.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
