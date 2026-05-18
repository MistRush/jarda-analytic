<script setup>
import Tooltip from "@/Components/Other/Tooltip.vue";
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
</script>

<template>
    <DocPage import="@/Components/Other/Tooltip.vue">
        <template #title> Tooltip </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>Tooltip</code> zobrazí bublinu s textem při najetí myší na obalový prvek. Text se zadává pomocí prop <Prop>text</Prop>.</p>
                <Preview
                    code='
          <template>
            <Tooltip text="Tohle je tooltip">
              <button>Najet myší</button>
            </Tooltip>
          </template>
        '
                >
                    <Tooltip text="Tohle je tooltip">
                        <button>Najet myší</button>
                    </Tooltip>
                </Preview>
            </Example>

            <Example title="HTML obsah v tooltipu">
                <p>Pokud chceš použít HTML uvnitř tooltipu, nastav <Prop>html</Prop> na <code>true</code>.</p>
                <Preview
                    code='
          <template>
            <Tooltip text="&lt;b&gt;Zvýrazněný&lt;/b&gt; tooltip" :html="true">
              <span style="text-decoration: underline;">Najet</span>
            </Tooltip>
          </template>
        '
                >
                    <Tooltip text="<b>Zvýrazněný</b> tooltip" :html="true">
                        <span style="text-decoration: underline">Najet</span>
                    </Tooltip>
                </Preview>
            </Example>

            <Example title="Maximální šířka">
                <p>Pomocí prop <Prop>maxWidth</Prop> můžeš omezit šířku tooltipu, výchozí je <code>250px</code>.</p>
                <Preview
                    code='
          <template>
            <Tooltip :text="&apos;Toto je opravdu velmi dlouhý text v tooltipu, který se zalomí, pokud překročí maximální šířku.&apos;" maxWidth="150px">
              <span>Hover</span>
            </Tooltip>
          </template>
        '
                >
                    <Tooltip :text="'Toto je opravdu velmi dlouhý text v tooltipu, který se zalomí, pokud překročí maximální šířku.'" maxWidth="150px">
                        <span>Hover</span>
                    </Tooltip>
                </Preview>
            </Example>

            <Example title="Preferovaná pozice">
                <p>Pomocí prop <Prop>preferredPosition</Prop> lze tooltip umístit <code>'above'</code> nebo <code>'below'</code> (výchozí).</p>
                <Preview
                    code='
          <template>
            <Tooltip text="Tooltip nad prvkem" preferredPosition="above">
              <span>Hover sem</span>
            </Tooltip>
          </template>
        '
                >
                    <Tooltip text="Tooltip nad prvkem" preferredPosition="above">
                        <span>Hover sem</span>
                    </Tooltip>
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
                                <td class="px-4 py-2">Text nebo HTML obsah zobrazený v tooltipu (povinné).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>maxWidth</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Maximální šířka tooltipu, např. <code>250px</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>preferredPosition</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Preferovaná pozice tooltipu: <code>above</code> nebo <code>below</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>html</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Pokud je aktivní, prop <code>text</code> bude vykreslen jako HTML (ne bezpečně).</td>
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
