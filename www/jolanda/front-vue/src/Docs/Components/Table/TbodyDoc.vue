<script setup>
import Tbody from "@/Components/Table/Tbody.vue";
import TbodyTr from "@/Components/Table/TbodyTr.vue";
import TbodyTd from "@/Components/Table/TbodyTd.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import DocPage from "@/Docs/DocPage.vue";
import { ref } from "vue";

const items = ref([
    { id: 1, name: "Položka 1" },
    { id: 2, name: "Položka 2" },
]);
</script>

<template>
    <DocPage import="global">
        <template #title> Tbody </template>

        <template #content>
            <Example title="Slot bez dat">
                <p>Pokud není předán žádný <code>list</code>, <code>Tbody</code> slouží pouze jako slot wrapper pro řádky tabulky.</p>

                <Preview
                    code="
          <template>
            <Tbody>
              <TbodyTr><TbodyTd>Statický řádek</TbodyTd></TbodyTr>
            </Tbody>
          </template>
        "
                >
                    <Tbody>
                        <TbodyTr><TbodyTd>Statický řádek</TbodyTd></TbodyTr>
                    </Tbody>
                </Preview>
            </Example>

            <Example title="Vykreslení z listu">
                <p>Pomocí prop <code>list</code> je možné vygenerovat řádky automaticky.</p>

                <Preview
                    code='
          <template>
            <Tbody :list="items">
              <template #default="{ element }">
                <TbodyTd>{{ element.name }}</TbodyTd>
              </template>
            </Tbody>
          </template>
        '
                >
                    <Tbody :list="items">
                        <template #default="{ element }">
                            <TbodyTd>{{ element.name }}</TbodyTd>
                        </template>
                    </Tbody>
                </Preview>
            </Example>

            <Example title="Draggable režim">
                <p>Pokud je <code>draggable</code> nastaveno na <code>true</code>, <code>Tbody</code> použije komponentu <code>vuedraggable</code> a umožní drag&drop.</p>

                <Preview
                    code='
          <template>
            <Tbody :list="items" draggable>
              <template #default="{ element }">
                <TbodyTd>{{ element.name }}</td>
              </template>
            </Tbody>
          </template>
        '
                >
                    <Tbody :list="items" draggable>
                        <template #default="{ element }">
                            <TbodyTd>{{ element.name }}</TbodyTd>
                        </template>
                    </Tbody>
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
                                <td class="px-4 py-2 font-mono"><Prop>list</Prop></td>
                                <td class="px-4 py-2"><code>Array</code></td>
                                <td class="px-4 py-2">Seznam dat, která budou vykreslena pomocí slotu. Pokud není předán, slouží komponenta jako wrapper pro vlastní sloty.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>draggable</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Aktivuje režim přetahování řádků pomocí knihovny <code>vuedraggable</code>.</td>
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
                                <td class="px-4 py-2 font-mono"><Event>onAfterDrag</Event></td>
                                <td class="px-4 py-2">Emitována po změně pořadí položek při drag&drop. Parametry: <code>(newList, oldList)</code>.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
