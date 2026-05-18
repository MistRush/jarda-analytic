<script setup>
import Slider from "@/Components/Inputs/Slider.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    value: 25,
});
</script>

<template>
    <DocPage import="global">
        <template #title> Slider </template>
        <template #content>
            <Example title="Základní použití">
                <p><Prop>Slider</Prop> umožňuje výběr číselné hodnoty pomocí posuvníku. Funguje s <Prop>v-model</Prop>.</p>
                <Preview
                    code='
          <template>
            <Slider v-model="value" label="Úroveň" />
          </template>
        '
                >
                    <Slider v-model="state.value" label="Úroveň" />
                </Preview>
            </Example>

            <Example title="Rozsah a krok">
                <p>Můžeš nastavit <Prop>min</Prop>, <Prop>max</Prop> a <Prop>step</Prop> pro jemnější kontrolu hodnoty.</p>
                <Preview
                    code='
          <template>
            <Slider v-model="value" :min="10" :max="50" :step="5" label="Rozsah" />
          </template>
        '
                >
                    <Slider v-model="state.value" :min="10" :max="50" :step="5" label="Rozsah" />
                </Preview>
            </Example>

            <Example title="Read-only">
                <p>Pokud je slider <Prop>readonly</Prop>, nelze s ním hýbat. Hodnota zůstává viditelná.</p>
                <Preview
                    code='
          <template>
            <Slider v-model="value" readonly label="Nelze měnit" />
          </template>
        '
                >
                    <Slider v-model="state.value" readonly label="Nelze měnit" />
                </Preview>
            </Example>

            <Example title="Chyba">
                <p>Přes <Prop>error</Prop> můžeš zobrazit chybovou hlášku pod sliderem.</p>
                <Preview
                    code='
          <template>
            <Slider v-model="value" error="Tato hodnota je neplatná" label="S chybou" />
          </template>
        '
                >
                    <Slider v-model="state.value" error="Tato hodnota je neplatná" label="S chybou" />
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
            <Slider v-model="value" label="S helpem" help="Nápověda" />
          </template>
        '
                >
                    <Slider v-model="state.value" label="S helpem" help="Nápověda" />
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
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Aktuální hodnota slideru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek k inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">ID inputu (HTML atribut).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>min</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Minimální hodnota (výchozí <code>0</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>max</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Maximální hodnota (výchozí <code>100</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>step</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Krok posuvu slideru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>readonly</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Znepřístupní slider.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název inputu (např. pro formulář).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí chybovou hlášku pod sliderem.</td>
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
                                <td class="px-4 py-2 font-mono"><code>@update:modelValue</code></td>
                                <td class="px-4 py-2">Vyvoláno při změně hodnoty slideru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@change</code></td>
                                <td class="px-4 py-2">Alias pro update, vyvolán při změně hodnoty.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
