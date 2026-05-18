<script setup>
import Modal from "@/Components/Modal/Modal.vue";
import Button from "@/Components/Inputs/Button.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    showFirst: false,
    showSecond: false,
    showThird: false,
});
</script>

<template>
    <DocPage import="global">
        <template #title> Modal </template>
        <template #content>
            <Example title="Základní použití">
                <p><Prop>Modal</Prop> slouží k zobrazení překryvného okna. Viditelnost se řídí pomocí <Prop>v-model:isVisible</Prop>. Lepší ale použít isVisible="true" (defaultní hondota) a řídit viditelnost pomocí v-if</p>
                <Preview
                    code='
          <template>
            <Button @click="show = true">Zobrazit modal</Button>
            <Modal v-model:isVisible="show">
              <template #header>Hlavička</template>
              <template #body>Tělo modalu</template>
              <template #footer>
                <Button @click="show = false">Zavřít</Button>
              </template>
            </Modal>
          </template>
        '
                >
                    <Button @click="state.showFirst = true">Zobrazit modal</Button>
                    <Modal v-model:isVisible="state.showFirst">
                        <template #header>Hlavička</template>
                        <template #body>Tělo modalu</template>
                        <template #footer>
                            <Button @click="state.showFirst = false">Zavřít</Button>
                        </template>
                    </Modal>
                </Preview>
            </Example>

            <Example title="Velikost a pozice">
                <p>Pomocí <Prop>size</Prop> (<code>small</code>, <code>medium</code>, <code>large</code>, <code>fullscreen</code>) a <Prop>position</Prop> (<code>center</code> nebo <code>right</code>) nastavíš umístění a šířku.</p>
                <Preview
                    code='
          <template>
            <Button @click="show = true">Zobrazit</Button>
            <Modal v-model:isVisible="show" size="large" position="right">
              <template #body>Velký modal vpravo</template>
            </Modal>
          </template>
        '
                >
                    <Button @click="state.showSecond = true">Zobrazit</Button>
                    <Modal v-model:isVisible="state.showSecond" size="large" position="right">
                        <template #body>Velký modal vpravo</template>
                    </Modal>
                </Preview>
            </Example>

            <Example title="Zavírací tlačítko">
                <p>Prop <Prop>closeButton</Prop> přidá tlačítko <code>Zavřít</code> do spodního slotu.</p>
                <Preview
                    code='
          <template>
            <Modal v-model:isVisible="show" :closeButton="true">
              <template #body>Obsah modalu</template>
            </Modal>
          </template>
        '
                >
                    <Modal v-model:isVisible="state.showThird" :closeButton="true">
                        <template #body>Obsah modalu</template>
                    </Modal>
                </Preview>
            </Example>

            <Example title="Načtení dat AJAXem">
                <p>Pokud zadáš prop <Prop>dataURL</Prop>, modal se pokusí načíst data přes Ajax a zpřístupní je do slotu <Prop>#body</Prop> jako slot prop <code>data</code>.</p>
                <Preview
                    code='
          <template>
            <Modal v-model:isVisible="show" dataURL="/api/data">
              <template #body="{ data }">
                <pre>{{ JSON.stringify(data, null, 2) }}</pre>
              </template>
            </Modal>
          </template>
        '
                >
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
                                <td class="px-4 py-2 font-mono"><Prop>isVisible</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazení/zavření modalu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>size</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Předdefinovaná velikost: <code>extraSmall</code>, <code>small</code>, <code>medium</code>, <code>large</code>, <code>fullscreen</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>sizeExact</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Přesná šířka (např. <code>900px</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>position</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Pozice modalu: <code>center</code>, <code>right</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>blockPage</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda blokuje stránku pod sebou (přidává overlay).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>fullHeight</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda má modal plnou výšku stránky.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>zIndex</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Z-index modalu (výchozí: <code>1000</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>dataURL</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">URL pro automatické načtení dat (AJAX).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>closeButton</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazení výchozího zavíracího tlačítka.</td>
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
                                <td class="px-4 py-2 font-mono"><code>@update:isVisible</code></td>
                                <td class="px-4 py-2">Aktualizuje zobrazení modalu (např. <code>v-model:isVisible</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@close</code></td>
                                <td class="px-4 py-2">Vyvoláno při zavření modalu (včetně kliknutí na ikonu zavřít).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
