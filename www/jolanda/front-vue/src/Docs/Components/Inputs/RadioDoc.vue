<script setup>
import Radio from "@/Components/Inputs/Radio.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    selected: "a",
    size: "default",
});
</script>

<template>
    <DocPage import="global">
        <template #title> Radio </template>
        <template #content>
            <Example title="Základní použití">
                <p>Komponenta podporuje <Prop>v-model</Prop> a prop <Prop>value</Prop> pro nastavení návratové hodnoty při výběru.</p>
                <Preview
                    code='
          <template>
            <Radio v-model="selected" value="a" label="Možnost A" />
            <Radio v-model="selected" value="b" label="Možnost B" />
          </template>
        '
                >
                    <Radio v-model="state.selected" value="a" label="Možnost A" />
                    <Radio v-model="state.selected" value="b" label="Možnost B" />
                </Preview>
            </Example>

            <!--  <Example title="Velikost">-->
            <!--    <p>Použij prop <Prop>size</Prop> pro úpravu velikosti inputu (např. <code>small</code> nebo <code>default</code>).</p>-->
            <!--    <Preview code='-->
            <!--      <template>-->
            <!--        <Radio v-model="selected" value="a" size="small" label="Malý" />-->
            <!--        <Radio v-model="selected" value="b" size="small" label="Malý také" />-->
            <!--      </template>-->
            <!--    '>-->
            <!--      <Radio v-model="state.selected" value="a" size="small" label="Malý" />-->
            <!--      <Radio v-model="state.selected" value="b" size="small" label="Malý také" />-->
            <!--    </Preview>-->
            <!--  </Example>-->

            <Example title="Chyba">
                <p>Pomocí <Prop>error</Prop> můžeš zobrazit chybovou hlášku.</p>
                <Preview
                    code='
          <template>
            <Radio v-model="selected" value="a" label="Možnost A" error="Tato volba je povinná" />
          </template>
        '
                >
                    <Radio v-model="state.selected" value="a" label="Možnost A" error="Tato volba je povinná" />
                </Preview>
            </Example>

            <Example title="Povinné pole">
                <p>Pokud je prop <Prop>required</Prop> nastaven na <code>true</code>, zobrazí se hvězdička u labelu.</p>
                <Preview
                    code='
          <template>
            <Radio v-model="selected" value="a" label="Možnost A" required />
          </template>
        '
                >
                    <Radio v-model="state.selected" value="a" label="Možnost A" required />
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
            <Radio v-model="selected" value="a" label="Možnost A" help="Nápověda" />
          </template>
        '
                >
                    <Radio v-model="state.selected" value="a" label="Možnost A" help="Nápověda" />
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
                                <td class="px-4 py-2"><code>String | Number | Boolean | Object</code></td>
                                <td class="px-4 py-2">Aktuálně vybraná hodnota (v-model).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>value</Prop></td>
                                <td class="px-4 py-2"><code>String | Number | Boolean | Object</code></td>
                                <td class="px-4 py-2">Hodnota daného radio inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek vedle radio inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Vlastní ID pro input (jinak se generuje automaticky).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název skupiny (radio inputy se stejným názvem tvoří skupinu).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>size</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Velikost komponenty: např. <code>default</code>, <code>small</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>required</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazí hvězdičku u labelu a označí jako povinné.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Text chybové zprávy.</td>
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
                                <td class="px-4 py-2">Vyvoláno při výběru hodnoty (pro v-model).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@change</code></td>
                                <td class="px-4 py-2">Vyvoláno při změně hodnoty.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
