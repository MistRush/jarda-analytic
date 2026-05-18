<script setup>
import TextArea from "@/Components/Inputs/TextArea.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    text: "",
});
</script>

<template>
    <DocPage import="global">
        <template #title> TextArea </template>
        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <Prop>TextArea</Prop> umožňuje víceřádkový vstup přes <Prop>v-model</Prop>.</p>
                <Preview
                    code='
          <template>
            <TextArea v-model="text" label="Popis" />
          </template>
        '
                >
                    <TextArea v-model="state.text" label="Popis" />
                </Preview>
            </Example>

            <Example title="Počet řádků">
                <p>Pomocí prop <Prop>rows</Prop> nastavíš výšku textového pole v řádcích.</p>
                <Preview
                    code='
          <template>
            <TextArea v-model="text" label="Popis" :rows="6" />
          </template>
        '
                >
                    <TextArea v-model="state.text" label="Popis" :rows="6" />
                </Preview>
            </Example>

            <Example title="Velikost pole">
                <p>Pomocí <Prop>size</Prop> můžeš přepnout velikost textu – např. <code>default</code> nebo <code>large</code>.</p>
                <Preview
                    code='
          <template>
            <TextArea v-model="text" label="Velký popis" size="large" />
          </template>
        '
                >
                    <TextArea v-model="state.text" label="Velký popis" size="large" />
                </Preview>
            </Example>

            <Example title="Resize chování">
                <p>Pomocí <Prop>resize</Prop> můžeš řídit, zda uživatel může měnit velikost pole (<code>none</code>, <code>vertical</code>, <code>horizontal</code>).</p>
                <Preview
                    code='
          <template>
            <TextArea v-model="text" label="Bez změny velikosti" resize="none" />
          </template>
        '
                >
                    <TextArea v-model="state.text" label="Bez změny velikosti" resize="none" />
                </Preview>
            </Example>

            <Example title="Povinné pole">
                <p>Hodnotou <Prop>required</Prop> zobrazíš hvězdičku u labelu a označíš pole jako povinné.</p>
                <Preview
                    code='
          <template>
            <TextArea v-model="text" label="Popis" required />
          </template>
        '
                >
                    <TextArea v-model="state.text" label="Popis" required />
                </Preview>
            </Example>

            <Example title="Chybová hláška">
                <p>Přes prop <Prop>error</Prop> zobrazíš chybovou zprávu pod polem.</p>
                <Preview
                    code='
          <template>
            <TextArea v-model="text" label="Popis" error="Toto pole je povinné" />
          </template>
        '
                >
                    <TextArea v-model="state.text" label="Popis" error="Toto pole je povinné" />
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
            <TextArea v-model="text" label="Popis" help="Nápověda" />
          </template>
        '
                >
                    <TextArea v-model="state.text" label="Popis" help="Nápověda" />
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
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Hodnota vstupu vázaná přes <code>v-model</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek nad polem.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">ID elementu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>placeholder</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zástupný text v poli.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>required</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Značí povinné pole (zobrazí hvězdičku).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>size</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Velikost pole (<code>small</code>, <code>default</code>, <code>large</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>rows</Prop></td>
                                <td class="px-4 py-2"><code>Number | String</code></td>
                                <td class="px-4 py-2">Počet řádků textarey.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>resize</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Směr změny velikosti (<code>none</code>, <code>vertical</code>, <code>horizontal</code>, ...).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Chybová hláška zobrazena pod polem.</td>
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
                                <td class="px-4 py-2">Vyvoláno při změně hodnoty v poli.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@change</code></td>
                                <td class="px-4 py-2">Vyvoláno při změně hodnoty (navíc k update).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
