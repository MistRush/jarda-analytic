<script setup>
import RadioBool from "@/Components/Inputs/RadioBool.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    value: true,
});
</script>

<template>
    <DocPage import="global">
        <template #title> RadioBool </template>
        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <strong>RadioBool</strong> nabízí rychlou možnost výběru <Prop>true</Prop> nebo <Prop>false</Prop> s lokalizovanými labely <strong>Ano / Ne</strong>.</p>
                <Preview
                    code='
          <template>
            <RadioBool v-model="value" label="Souhlasíte?" />
          </template>
        '
                >
                    <RadioBool v-model="state.value" label="Souhlasíte?" />
                </Preview>
            </Example>

            <Example title="Volba žádné hodnoty">
                <p>Pokud nastavíš <Prop>noneOption</Prop> na <code>true</code>, přibude možnost <strong>Žádný</strong> s hodnotou <code>null</code>.</p>
                <Preview
                    code='
          <template>
            <RadioBool v-model="value" label="Volba se třetí možností" :noneOption="true" />
          </template>
        '
                >
                    <RadioBool v-model="state.value" label="Volba se třetí možností" :noneOption="true" />
                </Preview>
            </Example>

            <Example title="Směr vykreslení">
                <p>Pomocí <Prop>direction</Prop> můžeš určit, jestli se mají volby zobrazit <code>column</code> (výchozí) nebo <code>row</code>.</p>
                <Preview
                    code='
          <template>
            <RadioBool v-model="value" label="Souhlasíte?" direction="row" />
          </template>
        '
                >
                    <RadioBool v-model="state.value" label="Souhlasíte?" direction="row" />
                </Preview>
            </Example>

            <Example title="Chyba">
                <p>Přes prop <Prop>error</Prop> můžeš zobrazit chybovou hlášku pod volbami.</p>
                <Preview
                    code='
          <template>
            <RadioBool v-model="value" label="Souhlasíte?" error="Tato volba je povinná" />
          </template>
        '
                >
                    <RadioBool v-model="state.value" label="Souhlasíte?" error="Tato volba je povinná" />
                </Preview>
            </Example>

            <Example title="Povinné pole">
                <p>Hodnotu <Prop>required</Prop> nastav na <code>true</code> pro přidání hvězdičky k názvu pole.</p>
                <Preview
                    code='
          <template>
            <RadioBool v-model="value" label="Souhlasíte?" required />
          </template>
        '
                >
                    <RadioBool v-model="state.value" label="Souhlasíte?" required />
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
            <RadioBool v-model="value" label="Souhlasíte?" help="Nápověda" />
          </template>
        '
                >
                    <RadioBool v-model="state.value" label="Souhlasíte?" help="Nápověda" />
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
                                <td class="px-4 py-2"><code>Boolean | null</code></td>
                                <td class="px-4 py-2">Aktuální hodnota (<code>true</code>, <code>false</code> nebo <code>null</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název skupiny pro radio inputy.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek komponenty.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>required</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazí hvězdičku u popisku a označí jako povinné.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Chybová hláška pod komponentou.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>noneOption</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Přidá možnost „Žádný“ (<code>null</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>optionAttribute</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Atribut použité jako label pro volby (default <code>'label'</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>valueAttribute</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Atribut použité jako hodnota volby (default <code>'value'</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>direction</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Směr zobrazení: <code>'row'</code> nebo <code>'column'</code> (default <code>'column'</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>help</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí nápovědu v tooltipu.</td>
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
                                <td class="px-4 py-2 text-muted italic" colspan="2">Tato komponenta nemá žádné specifické události.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
