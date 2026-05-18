<script setup>
import InputField from "@/Components/Inputs/InputField.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    value: "",
    type: "text",
    size: "default",
    readonly: false,
    showClear: true,
    currencyValue: 0,
});
</script>

<template>
    <DocPage import="global">
        <template #title> InputField </template>
        <template #content>
            <Example title="Základní použití">
                <p>Základní textový input přes <Prop>v-model</Prop> a <Prop>label</Prop>.</p>
                <Preview
                    code='
          <template>
            <InputField v-model="value" label="Jméno" placeholder="Zadejte jméno" />
          </template>
        '
                >
                    <InputField v-model="state.value" label="Jméno" placeholder="Zadejte jméno" />
                </Preview>
            </Example>

            <Example title="Typ inputu">
                <p>Prop <Prop>type</Prop> určuje typ vstupu – např. <code>text</code>, <code>number</code>, <code>email</code>, nebo speciálně <code>currency</code>, který násobí hodnotu * 100.</p>
                <Preview
                    code='
          <template>
            <InputField v-model="value" type="currency" label="Cena" />
          </template>
        '
                >
                    <InputField v-model="state.currencyValue" type="currency" label="Cena" />
                </Preview>
            </Example>

            <Example title="Velikost inputu">
                <p>Pomocí <Prop>size</Prop> můžeš měnit velikost inputu – např. <code>small</code>, <code>default</code>, <code>large</code>.</p>
                <Preview
                    code='
          <template>
            <InputField v-model="value" size="large" label="Velký input" />
          </template>
        '
                >
                    <InputField v-model="state.value" size="large" label="Velký input" />
                </Preview>
            </Example>

            <Example title="Readonly">
                <p>Pokud chceš input pouze pro čtení, použij <Prop>readonly</Prop>.</p>
                <Preview
                    code='
          <template>
            <InputField v-model="value" label="Pouze pro čtení" readonly />
          </template>
        '
                >
                    <InputField v-model="state.value" label="Pouze pro čtení" readonly />
                </Preview>
            </Example>

            <Example title="Ikona">
                <p>Prop <Prop>icon</Prop> zobrazí ikonu uvnitř inputu. Barvu můžeš upravit přes <Prop>iconColor</Prop>.</p>
                <Preview
                    code='
          <template>
            <InputField v-model="value" label="S ikonou" icon="search" />
          </template>
        '
                >
                    <InputField v-model="state.value" label="S ikonou" icon="search" />
                </Preview>
            </Example>

            <Example title="Clear tlačítko">
                <p>Pokud je <Prop>showClear</Prop> aktivní a input obsahuje hodnotu, zobrazí se ikona pro vymazání obsahu.</p>
                <Preview
                    code='
          <template>
            <InputField v-model="value" label="Mazatelný input" :showClear="true" />
          </template>
        '
                >
                    <InputField v-model="state.value" label="Mazatelný input" :showClear="state.showClear" />
                </Preview>
            </Example>

            <Example title="Chyba">
                <p>Chybu můžeš zobrazit pomocí <Prop>error</Prop>.</p>
                <Preview
                    code='
          <template>
            <InputField v-model="value" error="Pole je povinné" label="E-mail" />
          </template>
        '
                >
                    <InputField v-model="state.value" error="Pole je povinné" label="E-mail" />
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
            <InputField v-model="value" label="E-mail" help="Nápověda" />
          </template>
        '
                >
                    <InputField v-model="state.value" label="E-mail" help="Nápověda" />
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
                                <td class="px-4 py-2"><code>String | Number</code></td>
                                <td class="px-4 py-2">Hodnota pole (pro v-model).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">HTML ID inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>type</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Typ inputu, např. <code>text</code>, <code>number</code>, <code>currency</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>placeholder</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Placeholder text.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>required</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazí hvězdičku a validaci povinnosti.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>size</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Velikost inputu: <code>small</code>, <code>default</code>, <code>large</code>, <code>large-xl</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>readonly</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Vstup je pouze pro čtení.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>showClear</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazí ikonku pro vymazání hodnoty.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>variant</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Styl komponenty (např. <code>default</code>, <code>fancy</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>icon</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí ikonu vlevo v inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>iconColor</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Barva ikony (např. <code>black</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>inputRef</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Externí reference na input element.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Jméno inputu pro formulář.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí chybovou zprávu pod inputem.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>step</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Hodnota kroku pro <code>type=number</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>dark</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Změní na tmavé pozadí.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>loading</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazí načítací ikonu.</td>
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
                                <td class="px-4 py-2">Změna hodnoty inputu (v-model).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@blur</code></td>
                                <td class="px-4 py-2">Ztráta focusu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@change</code></td>
                                <td class="px-4 py-2">Změna hodnoty (při opuštění pole).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@set-input-ref</code></td>
                                <td class="px-4 py-2">Vrací referenci na vnitřní <code>input</code> element.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
