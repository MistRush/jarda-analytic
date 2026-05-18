<script setup>
import TreeView from "@/Components/Other/TreeView/TreeView.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
import { reactive } from "vue";

const exampleItems = [
    {
        id: 1,
        text: "Root 1",
        children: [
            { id: 2, text: "Child 1" },
            { id: 3, text: "Child 2" },
        ],
    },
    {
        id: 4,
        text: "Root 2",
    },
];

const state = reactive({
    selected: [],
});
</script>

<template>
    <DocPage import="@/Components/Other/TreeView/TreeView.vue">
        <template #title> TreeView </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>TreeView</code> slouží pro zobrazení stromové struktury. Pomocí prop <Prop>items</Prop> předáme pole dat, které bude zobrazeno.</p>

                <Preview
                    code="
          <script>
            const exampleItems = [
                {
                    id: 1,
                    text: 'Root 1',
                    children: [
                        { id: 2, text: 'Child 1' },
                        { id: 3, text: 'Child 2' },
                    ],
                },
                {
                    id: 4,
                    text: 'Root 2',
                },
            ];
          </script>
          <template>
            <TreeView :items='exampleItems' />
          </template>
        "
                >
                    <TreeView :items="exampleItems" label="Kategorie" v-model="state.selected" />
                </Preview>
            </Example>

            <Example title="Načítání z URL">
                <p>Můžete předat prop <Prop>dataUrl</Prop> pro dynamické načtení stromu přes GET požadavek.</p>

                <Preview
                    code='
          <template>
            <TreeView dataUrl="/api/tree" />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Model synchronizace">
                <p>Vybrané hodnoty jsou dostupné přes <Prop>v-model</Prop>. Komponenta emitne <code>update:modelValue</code> při změně výběru.</p>

                <Preview
                    code='
          <template>
            <TreeView :items="[...]" v-model="selectedItems" />
          </template>
        '
                >
                    <TreeView :items="exampleItems" label="Výběr" v-model="state.selected" />
                    <p class="mt-2">Vybrané ID: {{ state.selected }}</p>
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
                                <td class="px-4 py-2 font-mono"><Prop>items</Prop></td>
                                <td class="px-4 py-2"><code>Array</code></td>
                                <td class="px-4 py-2">Pole objektů pro zobrazení stromové struktury. Nepoužívá se, pokud je definován <code>dataUrl</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>dataUrl</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">URL adresa pro načtení dat stromu pomocí AJAX požadavku.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>modelValue</Prop></td>
                                <td class="px-4 py-2"><code>Array</code></td>
                                <td class="px-4 py-2">Aktuálně vybrané hodnoty ve stromu. Využívá se s <code>v-model</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazovaný nadpis stromu.</td>
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
                                <td class="px-4 py-2">Vyvoláno při změně výběru ve stromu. Vrací nové pole vybraných hodnot.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>

<style scoped>
.mt-2 {
    margin-top: 0.5rem;
}
</style>
