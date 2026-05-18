<script setup>
import TinyMCE from "@/Components/Inputs/TinyMCE.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    content: "<p>Ahoj světe!</p>",
});

const alert = (text) => {
    window.alert(text);
};
</script>

<template>
    <DocPage import="global">
        <template #title> TinyMCE </template>
        <template #content>
            <Example title="Základní použití">
                <p>
                    <Prop>TinyMCE</Prop>
                    je vizuální WYSIWYG editor. Připojuje se přes
                    <Prop>v-model</Prop>
                    a podporuje všechny funkce klasického TinyMCE + integraci s formulářem.
                </p>
                <Preview
                    code='
          <template>
            <TinyMCE v-model="content" label="Obsah" />
          </template>
        '
                >
                    <TinyMCE v-model="state.content" label="Obsah" />
                </Preview>
            </Example>

            <Example title="Compact režim">
                <p>
                    Compact mód skryje toolbar a zobrazí jen základní funkce s možností rozbalení. Aktivuješ ho pomocí
                    <Prop>compact</Prop>
                    .
                </p>
                <Preview
                    code='
          <template>
            <TinyMCE v-model="content" label="Popis" compact />
          </template>
        '
                >
                    <TinyMCE v-model="state.content" label="Popis" class="w-full" compact />
                </Preview>
            </Example>

            <Example title="Placeholder a výška">
                <p>
                    Pomocí
                    <Prop>placeholder</Prop>
                    nastavíš výchozí text. Výšku nastavíš přes
                    <Prop>height</Prop>
                    (výchozí: 300).
                </p>
                <Preview
                    code='
          <template>
            <TinyMCE v-model="content" placeholder="Zadej text..." :height="200" />
          </template>
        '
                >
                    <TinyMCE v-model="state.content" placeholder="Zadej text..." :height="200" />
                </Preview>
            </Example>

            <Example title="Vlastní tlačítka">
                <p>
                    Přes
                    <Prop>customActions</Prop>
                    můžeš přidat vlastní akce jako tlačítka do toolbaru.
                </p>
                <Preview
                    code="
          <template>
            <TinyMCE
              v-model=&quot;content&quot;
              :customActions=&quot;[{ id: 'customBold', tooltip: 'Tlustě', icon: 'bold', action: () => alert('tlustě!') }]&quot;
        />
    </template>
    "
                >
                    <TinyMCE
                        v-model="state.content"
                        :customActions="[
                            {
                                id: 'customBold',
                                tooltip: 'Tlustě',
                                icon: 'bold',
                                action: () => alert('tlustě!'),
                            },
                        ]"
                    />
                </Preview>
            </Example>

            <Example title="Chybová hláška">
                <p>
                    Přes prop
                    <Prop>error</Prop>
                    zobrazíš chybovou hlášku pod editorem.
                </p>
                <Preview
                    code='
          <template>
            <TinyMCE v-model="content" label="Text" error="Toto pole je povinné" />
          </template>
        '
                >
                    <TinyMCE v-model="state.content" label="Text" error="Toto pole je povinné" />
                </Preview>
            </Example>

            <Example title="Klávesová zkratka Ctrl+Enter">
                <p>
                    Při stisku <kbd>Ctrl + Enter</kbd> se vyvolá událost
                    <Prop>@ctrl-enter-shortcut-pressed</Prop>
                    .
                </p>
                <Preview
                    code='
          <template>
            <TinyMCE v-model="content" @ctrl-enter-shortcut-pressed="alert(&apos;Odesláno!&apos;)" />
    </template>
    '
                >
                    <TinyMCE v-model="state.content" @ctrl-enter-shortcut-pressed="() => alert('Odesláno!')" />
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
                                <td class="px-4 py-2">Obsah editoru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>height</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Výška editoru v pixelech (výchozí: <code>300</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>compact</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Kompaktní režim – zjednodušené UI.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>customActions</Prop></td>
                                <td class="px-4 py-2"><code>Array</code></td>
                                <td class="px-4 py-2">Seznam vlastních tlačítek v toolbaru editoru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>placeholder</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zástupný text.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Jméno vstupu ve formu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Chybová hláška pod editorem.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">ID elementu pro vazbu s label.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>required</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Značí povinné pole (zobrazí hvězdičku).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek nad editorem.</td>
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
                                <td class="px-4 py-2">Vyvoláno při změně obsahu editoru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@change</code></td>
                                <td class="px-4 py-2">Vyvoláno při rozostření (blur) s novým obsahem.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@ctrl-enter-shortcut-pressed</code></td>
                                <td class="px-4 py-2">Vyvoláno při stisku <kbd>Ctrl + Enter</kbd>.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
