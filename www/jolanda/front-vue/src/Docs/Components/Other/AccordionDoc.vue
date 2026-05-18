<script setup>
import Accordion from '@/Components/Other/Accordion.vue';
import DocPage from '@/Docs/DocPage.vue';
import Example from '@/Docs/Example.vue';
import Preview from '@/Docs/Preview.vue';
import Prop from '@/Docs/Prop.vue';
</script>

<template>
    <DocPage>
        <template #title>
            Accordion
        </template>

        <template #content>
            <Example title="Základní použití">
                <p>
                    Komponenta <code>Accordion</code> umožňuje zobrazit a skrýt obsah kliknutím na hlavičku. Nadpis je povinný
                    a zadává se přes prop <Prop>title</Prop>.
                </p>
                <Preview code="
          <template>
            <Accordion title=&quot;Klikni pro zobrazení&quot;>
              Obsah, který se zobrazí po rozbalení.
            </Accordion>
          </template>
        ">
                    <Accordion title="Klikni pro zobrazení">
                        Obsah, který se zobrazí po rozbalení.
                    </Accordion>
                </Preview>
            </Example>

            <Example title="Otevřeno ve výchozím stavu">
                <p>
                    Pomocí <Prop>defaultOpen</Prop> můžeš určit, zda má být accordion otevřen při načtení.
                </p>
                <Preview code="
          <template>
            <Accordion title=&quot;Předem otevřený&quot; :defaultOpen=&quot;true&quot;>
              Tento obsah je viditelný hned po načtení.
            </Accordion>
          </template>
        ">
                    <Accordion title="Předem otevřený" :defaultOpen="true">
                        Tento obsah je viditelný hned po načtení.
                    </Accordion>
                </Preview>
            </Example>

            <Example title="S barevnou značkou (tag)">
                <p>
                    Prop <Prop>tagNumber</Prop> zobrazí číselnou značku, která může mít vlastní barvu přes <Prop>tagColor</Prop>.
                </p>
                <Preview code="
          <template>
            <Accordion
              title=&quot;Se značkou&quot;
              :tagNumber=&quot;5&quot;
              tagColor=&quot;#e63946&quot;
            >
              Accordion s barevnou značkou.
            </Accordion>
          </template>
        ">
                    <Accordion title="Se značkou" :tagNumber="5" tagColor="#e63946">
                        Accordion s barevnou značkou.
                    </Accordion>
                </Preview>
            </Example>

            <Example title="Slot BeforeTitle">
                <p>
                    Pomocí slotu <code>name=&quot;BeforeTitle&quot;</code> můžeš do hlavičky přidat libovolný obsah před nadpis.
                </p>
                <Preview code="
          <template>
            <Accordion title=&quot;Slot před názvem&quot;&gt;
              <template #BeforeTitle>
                <span style=&quot;font-size: 10px; color: gray;&quot;>🔔</span>
              </template>
              Obsah s ikonou před nadpisem.
            </Accordion>
          </template>
        ">
                    <Accordion title="Slot před názvem">
                        <template #BeforeTitle>
                            <span style="font-size: 10px; color: gray;">🔔</span>
                        </template>
                        Obsah s ikonou před nadpisem.
                    </Accordion>
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
                            <td class="px-4 py-2 font-mono"><Prop>title</Prop></td>
                            <td class="px-4 py-2"><code>String</code></td>
                            <td class="px-4 py-2">Text záhlaví akordeonu.</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 font-mono"><Prop>tagNumber</Prop></td>
                            <td class="px-4 py-2"><code>Number</code></td>
                            <td class="px-4 py-2">Volitelný číselný štítek zobrazený vedle nadpisu.</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 font-mono"><Prop>tagColor</Prop></td>
                            <td class="px-4 py-2"><code>String</code></td>
                            <td class="px-4 py-2">Barva pozadí štítku <Prop>tagNumber</Prop>. Výchozí: <code>#0575E5</code>.</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 font-mono"><Prop>defaultOpen</Prop></td>
                            <td class="px-4 py-2"><code>Boolean</code></td>
                            <td class="px-4 py-2">Určuje, zda má být akordeon otevřen při inicializaci.</td>
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
                            <td class="px-4 py-2 font-mono text-gray-400 italic" colspan="2">Žádné</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Example>

        </template>
    </DocPage>
</template>
