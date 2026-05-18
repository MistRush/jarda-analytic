<script setup>
import Copy from "@/Components/Other/Helper/Copy.vue";
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
</script>

<template>
    <DocPage import="global">
        <template #title> Copy </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>Copy</code> umožňuje zkopírovat text do schránky po kliknutí. Zobrazuje ikonu <code>copy</code> nebo <code>checkmarkcircle</code> podle toho, zda byl text úspěšně zkopírován. Je obalena do <code>Tooltip</code> komponenty.</p>

                <Preview
                    code='
          <template>
            <Copy text="Toto je text ke zkopírování" title="Zkopírovat" />
          </template>
        '
                >
                    <Copy text="Toto je text ke zkopírování" title="Zkopírovat" />
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
                                <td class="px-4 py-2 font-mono"><Prop>text</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Text, který se má zkopírovat do schránky.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>title</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Text zobrazený v tooltipu po najetí na ikonu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>alert</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda se má vyhodit alert. Defaultně true</td>
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
                                <td class="px-4 py-2 font-mono"><code>@copied</code></td>
                                <td class="px-4 py-2">Vyvolána po úspěšném zkopírování textu do schránky. Vrací zkopírovaný text.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
