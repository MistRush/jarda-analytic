<script setup>
import Pagination from "@/Components/Other/Pagination/Pagination.vue";
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
</script>

<template>
    <DocPage import="@/Components/Other/Pagination/Pagination.vue">
        <template #title> Pagination </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>Pagination</code> slouží k zobrazení stránkování. Vyžaduje počet položek (<Prop>totalItems</Prop>), počet položek na stránku (<Prop>itemsPerPage</Prop>) a aktuální stránku (<Prop>currentPage</Prop>). Aktuální stránka se aktualizuje pomocí v-modelu.</p>
                <Preview
                    code='
          <template>
            <Pagination
              v-model:currentPage="page"
              :totalItems="50"
              :itemsPerPage="10"
            />
          </template>

          <script setup>
          //import { ref } from &apos;vue&apos;;

          const page = ref(1);
          </script>
        '
                >
                    <template #default>
                        <Pagination v-model:currentPage="page" :totalItems="50" :itemsPerPage="10" />
                    </template>
                </Preview>
            </Example>

            <Example title="Vlastnosti">
                <ul>
                    <li><Prop>totalItems</Prop> <code>(Number, povinné)</code>: Celkový počet položek.</li>
                    <li><Prop>itemsPerPage</Prop> <code>(Number, povinné)</code>: Počet položek na jedné stránce.</li>
                    <li><Prop>currentPage</Prop> <code>(Number)</code>: Aktuálně vybraná stránka. Lze ovládat pomocí <code>v-model:currentPage</code>.</li>
                </ul>
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
                                <td class="px-4 py-2 font-mono"><Prop>totalItems</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Celkový počet položek (např. záznamů), které se mají stránkovat.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>itemsPerPage</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Počet položek na jedné stránce.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>currentPage</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Aktuální stránka. Výchozí je <code>1</code>.</td>
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
                                <td class="px-4 py-2 font-mono"><code>@update:currentPage</code></td>
                                <td class="px-4 py-2">Vyvolána při změně aktuální stránky. Vrací číslo nové stránky.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
