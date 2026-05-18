<script setup>
import Table from "@/Components/Table/Table.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import DocPage from "@/Docs/DocPage.vue";
import TheadTr from "@/Components/Table/TheadTr.vue";
import TheadTh from "@/Components/Table/TheadTh.vue";
import Thead from "@/Components/Table/Thead.vue";
import TbodyTr from "@/Components/Table/TbodyTr.vue";
import TbodyTd from "@/Components/Table/TbodyTd.vue";
import Tbody from "@/Components/Table/Tbody.vue";
</script>

<template>
    <DocPage import="global">
        <template #title> Table </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>Table</code> slouží jako wrapper pro HTML tabulku se základním stylingem a podporou scrollu. Obsah tabulky je vkládán skrze <code>slot</code>.</p>

                <Preview
                    code="
          <template>
            <Table>
              <Thead>
                <TheadTr>
                  <TheadTh>Název</TheadTh>
                  <TheadTh>Hodnota</TheadTh>
                </TheadTr>
              </Thead>
              <Tbody>
                <TbodyTr>
                  <TbodyTd>Položka 1</TbodyTd>
                  <TbodyTd>100</TbodyTd>
                </TbodyTr>
                <TbodyTr>
                  <TbodyTd>Položka 2</TbodyTd>
                  <TbodyTd>200</TbodyTd>
                </TbodyTr>
              </Tbody>
            </Table>
          </template>
        "
                >
                    <Table>
                        <Thead>
                            <TheadTr>
                                <TheadTh>Název</TheadTh>
                                <TheadTh>Hodnota</TheadTh>
                            </TheadTr>
                        </Thead>
                        <Tbody>
                            <TbodyTr>
                                <TbodyTd>Položka 1</TbodyTd>
                                <TbodyTd>100</TbodyTd>
                            </TbodyTr>
                            <TbodyTr>
                                <TbodyTd>Položka 2</TbodyTd>
                                <TbodyTd>200</TbodyTd>
                            </TbodyTr>
                        </Tbody>
                    </Table>
                </Preview>
            </Example>
            <Example title="Vlastnosti">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2">Komponenta</th>
                                <th class="px-4 py-2">Prop</th>
                                <th class="px-4 py-2">Typ</th>
                                <th class="px-4 py-2">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>Table</Prop></td>
                                <td class="px-4 py-2 font-mono">—</td>
                                <td class="px-4 py-2 text-muted italic" colspan="2">Nemá žádné props</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>Thead</Prop></td>
                                <td class="px-4 py-2 font-mono">—</td>
                                <td class="px-4 py-2 text-muted italic" colspan="2">Nemá žádné props</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>TheadTr</Prop></td>
                                <td class="px-4 py-2 font-mono">—</td>
                                <td class="px-4 py-2 text-muted italic" colspan="2">Nemá žádné props</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>TheadTh</Prop></td>
                                <td class="px-4 py-2 font-mono">—</td>
                                <td class="px-4 py-2 text-muted italic" colspan="2">Nemá žádné props</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>Tbody</Prop></td>
                                <td class="px-4 py-2 font-mono">—</td>
                                <td class="px-4 py-2 text-muted italic" colspan="2">Nemá žádné props</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>TbodyTr</Prop></td>
                                <td class="px-4 py-2 font-mono">—</td>
                                <td class="px-4 py-2 text-muted italic" colspan="2">Nemá žádné props</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>TbodyTd</Prop></td>
                                <td class="px-4 py-2 font-mono">—</td>
                                <td class="px-4 py-2 text-muted italic" colspan="2">Nemá žádné props</td>
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
                                <td class="px-4 py-2 text-muted italic" colspan="2">Žádná z těchto komponent neemitujě vlastní události.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
