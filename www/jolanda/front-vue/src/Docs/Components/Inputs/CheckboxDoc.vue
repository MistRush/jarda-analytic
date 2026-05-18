<script setup>
import Checkbox from "@/Components/Inputs/Checkbox.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    checked: true,
    inverted: false,
    size: "default",
});
</script>

<template>
    <DocPage import="global">
        <template #title> Checkbox </template>
        <template #content>
            <Example title="Základní použití">
                <p>
                    Checkbox s klasickým
                    <Prop>label</Prop>
                    a obousměrnou vazbou přes
                    <Prop>v-model</Prop>
                    .
                </p>
                <Preview
                    code='
          <template>
            <Checkbox v-model="true" label="Souhlasím s podmínkami" />
          </template>
        '
                >
                    <Checkbox v-model="state.checked" label="Souhlasím s podmínkami" />
                </Preview>
            </Example>

            <Example title="Inverzní logika">
                <p>
                    Prop
                    <Prop>inverted</Prop>
                    otočí logiku – při zaškrtnutí bude hodnota <code>false</code>.
                </p>
                <Preview
                    code='
          <template>
            <Checkbox v-model="true" :inverted="true" label="Nechci dostávat newsletter" />
          </template>
        '
                >
                    <Checkbox v-model="state.checked" :inverted="true" label="Nechci dostávat newsletter" />
                </Preview>
            </Example>

            <!--  <Example title="Velikost">-->
            <!--    <template #title>Velikost</template>-->
            <!--    <p>Pomocí <Prop>size</Prop> můžeme měnit velikost labelu. Např. <code>default</code>, <code>small</code> apod.</p>-->
            <!--    <Preview code='-->
            <!--      <template>-->
            <!--        <Checkbox v-model="checked" size="small" label="Menší checkbox" />-->
            <!--      </template>-->
            <!--    '>-->
            <!--      <Checkbox v-model="state.checked" size="small" label="Menší checkbox" />-->
            <!--    </Preview>-->
            <!--  </Example>-->

            <Example title="Povinné pole">
                <p>
                    Když nastavíme
                    <Prop>required</Prop>
                    , zobrazí se hvězdička u labelu.
                </p>
                <Preview
                    code='
          <template>
            <Checkbox v-model="true" required label="Souhlasím s podmínkami" />
          </template>
        '
                >
                    <Checkbox v-model="state.checked" required label="Souhlasím s podmínkami" />
                </Preview>
            </Example>

            <Example title="Zobrazení chyby">
                <p>
                    Prop
                    <Prop>error</Prop>
                    umožňuje zobrazit chybovou hlášku pod checkboxem.
                </p>
                <Preview
                    code='
          <template>
            <Checkbox v-model="true" error="Toto pole je povinné" label="Souhlasím s podmínkami" />
          </template>
        '
                >
                    <Checkbox v-model="state.checked" error="Toto pole je povinné" label="Souhlasím s podmínkami" />
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
            <Checkbox v-model="true" label="Souhlasím s podmínkami" help="Nápověda" />
          </template>
        '
                >
                    <Checkbox label="Souhlasím s podmínkami" help="Nápověda" />
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
                                <td class="px-4 py-2 font-mono">
                                    <Prop>id</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">ID elementu checkboxu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>label</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek vedle checkboxu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>modelValue</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean | String | Number</code></td>
                                <td class="px-4 py-2">Vazba na hodnotu checkboxu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>inverted</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Invertuje logiku checkboxu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>size</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Velikost popisku – např. <code>default</code>, <code>small</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>required</Prop>
                                </td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazí hvězdičku u popisku.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>name</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název vstupu pro form.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>error</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí chybovou zprávu pod checkboxem.</td>
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
                                <td class="px-4 py-2">Aktualizuje v-model při změně stavu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@change</code></td>
                                <td class="px-4 py-2">Spuštěno při interakci s checkboxem.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
