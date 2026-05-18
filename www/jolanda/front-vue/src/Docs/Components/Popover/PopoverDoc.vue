<script setup>
import Popover from "@/Components/Popover/Popover.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
import { ref } from "vue";

const open = ref(false);
</script>

<template>
    <DocPage import="global">
        <template #title> Popover </template>

        <template #content>
            <Example title="Základní použití">
                <p>Popover se otevírá kliknutím. Slot <code>default</code> slouží pro spouštěcí element, slot <code>panel</code> pro obsah popoveru.</p>

                <Preview
                    code="
          <template>
            <Popover>
              <template #default>
                <button>Otevřít</button>
              </template>
              <template #panel>
                <div class='p-2'>Obsah</div>
              </template>
            </Popover>
          </template>
        "
                >
                    <Popover>
                        <template #default>
                            <button>Otevřít</button>
                        </template>
                        <template #panel>
                            <div class="p-2">Obsah</div>
                        </template>
                    </Popover>
                </Preview>
            </Example>

            <Example title="Řízení otevření přes prop">
                <p>Otevření lze řídit přes <Prop>v-model:open</Prop>.</p>

                <Preview
                    code='
          <template>
            <Popover v-model:open="open">
              <template #default>
                <button>Toggle</button>
              </template>
              <template #panel>
                <div>Panel řízený v-model</div>
              </template>
            </Popover>
          </template>
        '
                >
                    <Popover v-model:open="open">
                        <template #default>
                            <button>Toggle</button>
                        </template>
                        <template #panel>
                            <div>Panel řízený v-model</div>
                        </template>
                    </Popover>
                </Preview>
            </Example>

            <Example title="Hover mód">
                <p>Popover se může otevírat při přejetí myší pomocí prop <Prop>mode</Prop> = <code>hover</code>.</p>
                <Preview
                    code='
          <template>
            <Popover mode="hover">
              <template #default>
                <button>Hover me</button>
              </template>
              <template #panel>
                <div>Hover panel</div>
              </template>
            </Popover>
          </template>
        '
                >
                    <Popover mode="hover">
                        <template #default>
                            <button>Hover me</button>
                        </template>
                        <template #panel>
                            <div>Hover panel</div>
                        </template>
                    </Popover>
                </Preview>
            </Example>

            <Example title="Overlay">
                <p>Pomocí prop <Prop>overlay</Prop> zobrazíte pozadí při otevření.</p>
                <Preview
                    code="
          <template>
            <Popover overlay>
              <template #default>
                <button>Overlay</button>
              </template>
              <template #panel>
                <div class='p-2'>S překrytím</div>
              </template>
            </Popover>
          </template>
        "
                >
                    <Popover overlay>
                        <template #default>
                            <button>Overlay</button>
                        </template>
                        <template #panel>
                            <div class="p-2">S překrytím</div>
                        </template>
                    </Popover>
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
                                <td class="px-4 py-2 font-mono"><Prop>mode</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Režim aktivace: <code>'click'</code> nebo <code>'hover'</code> (default <code>'click'</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>open</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Řízené otevření/zavření z rodiče.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>disabled</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Deaktivuje interakci s popoverem.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>openDelay</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Zpoždění otevření při <code>hover</code> v milisekundách (default <code>250</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>closeDelay</Prop></td>
                                <td class="px-4 py-2"><code>Number</code></td>
                                <td class="px-4 py-2">Zpoždění zavření při <code>hover</code> v milisekundách (default <code>250</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>overlay</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zda zobrazit překryvnou vrstvu pozadí.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>popper</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Volitelná konfigurace pozice (např. <code>placement</code>, <code>offsetDistance</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>class</Prop></td>
                                <td class="px-4 py-2"><code>String | Object | Array</code></td>
                                <td class="px-4 py-2">Předané CSS třídy pro root element.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>ui</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Vlastní UI konfigurace (rezervováno pro budoucí použití).</td>
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
                                <td class="px-4 py-2 font-mono"><Event>update:open</Event></td>
                                <td class="px-4 py-2">Emitována při otevření nebo zavření (<code>true</code>/<code>false</code>).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>

<style scoped>
.p-2 {
    padding: 0.5rem;
}
</style>
