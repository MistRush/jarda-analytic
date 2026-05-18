<script setup>
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage import="global">
        <template #title> EditorGroup </template>

        <template #content>
            <Example title="Použití EditorGroup">
                <p>Komponenta <Prop>EditorGroup</Prop> seskupuje část formuláře do vizuálně odděleného bloku. Podporuje sbalení sekce a připnutí do pravého panelu.</p>
                <Preview
                    code='
          <template>
            <EditorGroup title="Nastavení uživatele" :collapsible="true">
                <!--     Inputy         -->
            </EditorGroup>
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Vlastnosti EditorGroup">
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
                                <td class="px-4 py-2 font-mono"><Prop>title</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Nadpis skupiny, zobrazuje se v hlavičce.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>collapsible</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Umožňuje sbalit/rozbalit sekci kliknutím na hlavičku.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>collapsed</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda má být sekce po načtení sbalená.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>row</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Přidá layout ve formě řádku (flex řádek).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>container</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Přidá <code>@container</code> třídu pro container queries.</td>
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
        </template>
    </DocPage>
</template>
