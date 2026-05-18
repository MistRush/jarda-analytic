<script setup>
import GridStack from "@/Components/Other/GridStack/GridStack.vue";
import GridStackItem from "@/Components/Other/GridStack/GridStackItem.vue";
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
</script>

<template>
    <DocPage import="@/Components/Other/GridStack/GridStack.vue">
        <template #title> GridStack </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>GridStack</code> obaluje knihovnu <code>gridstack.js</code> a umožňuje vytvářet dynamické mřížky s přetahovatelnými widgety. Podporuje přidávání, odebírání widgetů a správu layoutu.</p>

                <Preview
                    code='
          <template>
            <GridStack :options="{ cellHeight: 50, float: true, column: 4, }">
              <GridStackItem gs-w="1" gs-h="2" class="bg-outline">
                <div>
                  #1
                </div>
              </GridStackItem>
              <GridStackItem gs-w="1" gs-h="2" gs-y="0" gs-x="2" class="bg-outline">
                <div>
                  #2
                </div>
              </GridStackItem>
            </GridStack>
          </template>
        '
                >
                    <GridStack :options="{ cellHeight: 50, float: true, column: 4 }" class="w-full h-[100px]">
                        <GridStackItem gs-w="1" gs-h="2" class="bg-outline">
                            <div>#1</div>
                        </GridStackItem>
                        <GridStackItem gs-w="1" gs-h="2" gs-y="0" gs-x="2" class="bg-outline">
                            <div>#2</div>
                        </GridStackItem>
                    </GridStack>
                </Preview>
            </Example>

            <Example title="Vlastnosti">
                <ul>
                    <li><Prop>options</Prop> <code>(Object)</code>: Konfigurační objekt pro inicializaci gridstack. Výchozí nastavení lze přepsat viz (<a href="https://github.com/gridstack/gridstack.js">https://github.com/gridstack/gridstack.js</a>).</li>
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
                                <td class="px-4 py-2 font-mono"><Prop>options</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Konfigurační objekt předávaný do <code>GridStack.init</code> (např. <code>cellHeight</code>, <code>float</code>, <code>margin</code> apod.).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>default</Prop></td>
                                <td class="px-4 py-2"><code>Slot</code></td>
                                <td class="px-4 py-2">Obsah gridu – očekává slot s prvky s třídou <code>grid-stack-item</code>.</td>
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
                                <td class="px-4 py-2 font-mono text-gray-400 italic" colspan="2">Tato komponenta aktuálně neemituje žádné vlastní události.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
