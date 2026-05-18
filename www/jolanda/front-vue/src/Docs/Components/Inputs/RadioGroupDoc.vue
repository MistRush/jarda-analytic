<script setup>
import RadioGroup from "@/Components/Inputs/RadioGroup.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    selected: "banana",
    direction: "column",
});
</script>

<template>
    <DocPage import="global">
        <template #title> RadioGroup </template>
        <template #content>
            <Example title="Základní použití">
                <p>
                    <Prop>RadioGroup</Prop>
                    vykresluje skupinu radio tlačítek z pole
                    <Prop>options</Prop>
                    . Každý prvek může být jednoduchý string nebo objekt s vlastními atributy.
                </p>
                <Preview
                    code="
          <template>
            <RadioGroup
              v-model=&quot;selected&quot;
              :options=&quot;['apple', 'banana', 'cherry']&quot;
                label=&quot;Oblíbené ovoce&quot;
              />
          </template>
        "
                >
                    <RadioGroup v-model="state.selected" :options="['apple', 'banana', 'cherry']" label="Oblíbené ovoce" />
                </Preview>
            </Example>

            <Example title="Volby jako objekty">
                <p>
                    Pokud chceš předat pole objektů, můžeš specifikovat, který klíč se použije pro
                    <Prop>label</Prop>
                    a který pro
                    <Prop>value</Prop>
                    .
                </p>
                <Preview
                    code='
          <template>
            <RadioGroup
              v-model="selected"
              :options="[
                { title: &apos;Jablko&apos;, id: &apos;apple&apos; },
                { title: &apos;Banán&apos;, id: &apos;banana&apos; },
                ]"
              optionAttribute="title"
              valueAttribute="id"
              label="Výběr ovoce"
            />
          </template>
        '
                >
                    <RadioGroup
                        v-model="state.selected"
                        :options="[
                            { title: 'Jablko', id: 'apple' },
                            { title: 'Banán', id: 'banana' },
                        ]"
                        optionAttribute="title"
                        valueAttribute="id"
                        label="Výběr ovoce"
                    />
                </Preview>
            </Example>

            <Example title="Chyba">
                <p>
                    Pomocí
                    <Prop>error</Prop>
                    zobrazíš chybovou hlášku pod radio skupinou.
                </p>
                <Preview
                    code='
          <template>
            <RadioGroup
              v-model="selected"
              :options="[&apos;a&apos;, &apos;b&apos;]"
              error="Tato volba je povinná"
              label="Výběr"
            />
          </template>
        '
                >
                    <RadioGroup v-model="state.selected" :options="['a', 'b']" error="Tato volba je povinná" label="Výběr" />
                </Preview>
            </Example>

            <Example title="Povinné pole">
                <p>
                    Při nastavení
                    <Prop>required</Prop>
                    se u legendy zobrazí hvězdička.
                </p>
                <Preview
                    code='
          <template>
            <RadioGroup
              v-model="selected"
              :options="[&apos;Ano&apos;, &apos;Ne&apos;]"
              label="Souhlasíte?"
              required
            />
          </template>
        '
                >
                    <RadioGroup v-model="state.selected" :options="['Ano', 'Ne']" label="Souhlasíte?" required />
                </Preview>
            </Example>

            <Example title="Horizontální rozložení">
                <p>
                    Prop
                    <Prop>direction</Prop>
                    může být <code>column</code> (výchozí) nebo <code>inline</code> pro horizontální zobrazení.
                </p>
                <Preview
                    code='
          <template>
            <RadioGroup
              v-model="selected"
              :options="[&apos;A&apos;, &apos;B&apos;, &apos;C&apos;]"
              label="Volba"
              direction="inline"
            />
          </template>
          '
                >
                    <RadioGroup v-model="state.selected" :options="['A', 'B', 'C']" label="Volba" direction="inline" />
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
            <RadioGroup
              v-model="selected"
              :options="[&apos;apple&apos;, &apos;banana&apos;, &apos;cherry&apos;]"
                label="Oblíbené ovoce"
              />
              help="Nápověda"
          </template>
        '
                >
                    <RadioGroup v-model="state.selected" :options="['apple', 'banana', 'cherry']" label="Oblíbené ovoce" help="Nápověda" />
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
                                <td class="px-4 py-2"><code>String | Number | Object | Boolean | null</code></td>
                                <td class="px-4 py-2">Aktuálně vybraná hodnota radio skupiny.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Jméno použité pro všechna radio tlačítka.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>options</Prop></td>
                                <td class="px-4 py-2"><code>Array</code></td>
                                <td class="px-4 py-2">Seznam možností – může být pole stringů nebo objektů.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>optionAttribute</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Klíč použítý jako label z objektu (default <code>'label'</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>valueAttribute</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Klíč použítý jako hodnota z objektu (default <code>'value'</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Text nad radio skupinou.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>required</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazí hvězdičku, značí povinné pole.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>error</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Chybová hláška.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>direction</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Směr zobrazení: <code>'column'</code> (default) nebo <code>'inline'</code>.</td>
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
