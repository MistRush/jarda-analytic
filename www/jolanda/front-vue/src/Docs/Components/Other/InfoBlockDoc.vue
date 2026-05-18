<script setup>
import InfoBlock from '@/Components/Other/InfoBlock.vue';
import InfoBlockItem from '@/Components/Other/InfoBlockItem.vue';
import DocPage from '@/Docs/DocPage.vue';
import Example from '@/Docs/Example.vue';
import Preview from '@/Docs/Preview.vue';
import Prop from '@/Docs/Prop.vue';
</script>

<template>
    <DocPage import="global">
        <template #title>
            InfoBlock
        </template>
        
        <template #description>
            Komponenta <Prop>InfoBlock</Prop> slouží k zobrazení informačních bloků s volitelným nadpisem. Je navržena jako flexibilní kontejner pro strukturované zobrazení dat s konzistentním stylem. Pro jednotlivé položky informací můžeš použít komponentu <Prop>InfoBlockItem</Prop>.
        </template>

        <template #content>
            <Example title="Základní použití">
                <p>
                    Komponenta <Prop>InfoBlock</Prop> vytváří stylizovaný blok s obsahem. Obsah se zadává do default slotu.
                </p>
                <Preview code="
          <template>
            <InfoBlock>
              <p>Základní obsah InfoBlock komponenty.</p>
              <p>Můžeš zde vložit jakýkoliv obsah.</p>
            </InfoBlock>
          </template>
        ">
                    <InfoBlock>
                        <p>Základní obsah InfoBlock komponenty.</p>
                        <p>Můžeš zde vložit jakýkoliv obsah.</p>
                    </InfoBlock>
                </Preview>
            </Example>

            <Example title="S nadpisem">
                <p>
                    Nadpis se zadává přes slot <Prop>title</Prop>. Nadpis se zobrazí pouze pokud je slot definován.
                </p>
                <Preview code="
          <template>
            <InfoBlock>
              <template #title>Nadpis bloku</template>
              <p>Obsah s nadpisem.</p>
              <ul>
                <li>První položka</li>
                <li>Druhá položka</li>
              </ul>
            </InfoBlock>
          </template>
        ">
                    <InfoBlock>
                        <template #title>Nadpis bloku</template>
                        <p>Obsah s nadpisem.</p>
                        <ul>
                            <li>První položka</li>
                            <li>Druhá položka</li>
                        </ul>
                    </InfoBlock>
                </Preview>
            </Example>

            <Example title="S InfoBlockItem komponentami">
                <p>
                    Pro jednotlivé informační položky můžeš použít komponentu <Prop>InfoBlockItem</Prop>, která poskytuje konzistentní styling pro label a hodnotu.
                </p>
                <Preview code="
          <template>
            <InfoBlock>
              <template #title>Uživatelské informace</template>
              <div class=&quot;grid grid-cols-2 gap-4&quot;>
                <InfoBlockItem label=&quot;Jméno&quot; value=&quot;Jan Novák&quot; />
                <InfoBlockItem label=&quot;Email&quot; value=&quot;jan.novak@example.com&quot; />
                <InfoBlockItem label=&quot;Telefon&quot; value=&quot;+420 123 456 789&quot; />
                <InfoBlockItem label=&quot;Město&quot; value=&quot;Praha&quot; />
              </div>
            </InfoBlock>
          </template>
        ">
                    <InfoBlock>
                        <template #title>Uživatelské informace</template>
                        <div class="grid grid-cols-2 gap-4">
                            <InfoBlockItem label="Jméno" value="Jan Novák" />
                            <InfoBlockItem label="Email" value="jan.novak@example.com" />
                            <InfoBlockItem label="Telefon" value="+420 123 456 789" />
                            <InfoBlockItem label="Město" value="Praha" />
                        </div>
                    </InfoBlock>
                </Preview>
            </Example>

            <Example title="InfoBlockItem varianty">
                <p>
                    InfoBlockItem podporuje různé varianty pro zvýraznění důležitých informací.
                </p>
                <Preview code="
          <template>
            <InfoBlock>
              <template #title>Různé varianty</template>
              <div class=&quot;grid grid-cols-2 gap-4&quot;>
                <InfoBlockItem label=&quot;Normální text&quot; value=&quot;Základní informace&quot; />
                <InfoBlockItem label=&quot;Varování&quot; value=&quot;Důležité upozornění&quot; variant=&quot;warning&quot; />
                <InfoBlockItem label=&quot;Úspěch&quot; value=&quot;Operace dokončena&quot; variant=&quot;success&quot; />
                <InfoBlockItem label=&quot;Chyba&quot; value=&quot;Něco se pokazilo&quot; variant=&quot;danger&quot; />
              </div>
            </InfoBlock>
          </template>
        ">
                    <InfoBlock>
                        <template #title>Různé varianty</template>
                        <div class="grid grid-cols-2 gap-4">
                            <InfoBlockItem label="Normální text" value="Základní informace" />
                            <InfoBlockItem label="Varování" value="Důležité upozornění" variant="warning" />
                            <InfoBlockItem label="Úspěch" value="Operace dokončena" variant="success" />
                            <InfoBlockItem label="Chyba" value="Něco se pokazilo" variant="danger" />
                        </div>
                    </InfoBlock>
                </Preview>
            </Example>

            <Example title="S vlastním obsahem">
                <p>
                    Místo prop <Prop>value</Prop> můžeš použít slot pro komplexnější obsah.
                </p>
                <Preview code="
          <template>
            <InfoBlock>
              <template #title>Pokročilé použití</template>
              <div class=&quot;grid grid-cols-2 gap-4&quot;>
                <InfoBlockItem label=&quot;Webová stránka&quot;>
                  <a href=&quot;https://example.com&quot; class=&quot;text-blue-600 hover:underline&quot;>
                    https://example.com
                  </a>
                </InfoBlockItem>
                <InfoBlockItem label=&quot;Tagy&quot;>
                  <div class=&quot;flex gap-1&quot;>
                    <span class=&quot;px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded&quot;>Vue</span>
                    <span class=&quot;px-2 py-1 bg-green-100 text-green-800 text-xs rounded&quot;>JavaScript</span>
                  </div>
                </InfoBlockItem>
              </div>
            </InfoBlock>
          </template>
        ">
                    <InfoBlock>
                        <template #title>Pokročilé použití</template>
                        <div class="grid grid-cols-2 gap-4">
                            <InfoBlockItem label="Webová stránka">
                                <a href="https://example.com" class="text-blue-600 hover:underline">
                                    https://example.com
                                </a>
                            </InfoBlockItem>
                            <InfoBlockItem label="Tagy">
                                <div class="flex gap-1">
                                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Vue</span>
                                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">JavaScript</span>
                                </div>
                            </InfoBlockItem>
                        </div>
                    </InfoBlock>
                </Preview>
            </Example>

            <Example title="Komplexní obsah">
                <p>
                    InfoBlock může obsahovat jakýkoliv HTML obsah včetně formulářových prvků, tabulek nebo dalších komponent.
                </p>
                <Preview code="
          <template>
            <InfoBlock>
              <template #title>Uživatelské informace (ruční styling)</template>
              <div class=&quot;grid grid-cols-2 gap-4&quot;>
                <div>
                  <label class=&quot;block text-gray-400 text-sm font-medium mb-1&quot;>Jméno</label>
                  <div class=&quot;text-base&quot;>Jan Novák</div>
                </div>
                <div>
                  <label class=&quot;block text-gray-400 text-sm font-medium mb-1&quot;>Email</label>
                  <div class=&quot;text-base&quot;>jan.novak@example.com</div>
                </div>
              </div>
            </InfoBlock>
          </template>
        ">
                    <InfoBlock>
                        <template #title>Uživatelské informace (ruční styling)</template>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-400 text-sm font-medium mb-1">Jméno</label>
                                <div class="text-base">Jan Novák</div>
                            </div>
                            <div>
                                <label class="block text-gray-400 text-sm font-medium mb-1">Email</label>
                                <div class="text-base">jan.novak@example.com</div>
                            </div>
                        </div>
                    </InfoBlock>
                </Preview>
            </Example>

            <Example title="Více bloků">
                <p>
                    InfoBlocky můžeš kombinovat pro vytvoření přehledného layoutu.
                </p>
                <Preview code="
          <template>
            <div class=&quot;space-y-4&quot;>
              <InfoBlock>
                <template #title>První blok</template>
                <p>Obsah prvního bloku.</p>
              </InfoBlock>
              
              <InfoBlock>
                <template #title>Druhý blok</template>
                <p>Obsah druhého bloku.</p>
              </InfoBlock>
            </div>
          </template>
        ">
                    <div class="space-y-4">
                        <InfoBlock>
                            <template #title>První blok</template>
                            <p>Obsah prvního bloku.</p>
                        </InfoBlock>
                        
                        <InfoBlock>
                            <template #title>Druhý blok</template>
                            <p>Obsah druhého bloku.</p>
                        </InfoBlock>
                    </div>
                </Preview>
            </Example>
        </template>

        <template #props>
            <h3 class="text-lg font-semibold mb-4">InfoBlock Props</h3>
            <p class="mb-6">Komponenta InfoBlock nemá žádné props. Veškerá funkcionalita se řídí přes sloty.</p>

            <h3 class="text-lg font-semibold mb-4">InfoBlockItem Props</h3>
            <table class="table-auto w-full">
                <thead>
                <tr>
                    <th class="text-left">Prop</th>
                    <th class="text-left">Typ</th>
                    <th class="text-left">Výchozí</th>
                    <th class="text-left">Popis</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><code>label</code></td>
                    <td>String</td>
                    <td>-</td>
                    <td>Text labelu (povinný)</td>
                </tr>
                <tr>
                    <td><code>value</code></td>
                    <td>String | Number</td>
                    <td>null</td>
                    <td>Hodnota k zobrazení</td>
                </tr>
                <tr>
                    <td><code>emptyText</code></td>
                    <td>String</td>
                    <td>'-'</td>
                    <td>Text zobrazený když je value prázdné</td>
                </tr>
                <tr>
                    <td><code>variant</code></td>
                    <td>String</td>
                    <td>'default'</td>
                    <td>Barevná varianta: default, warning, success, danger</td>
                </tr>
                </tbody>
            </table>
        </template>

        <template #slots>
            <h3 class="text-lg font-semibold mb-4">InfoBlock Slots</h3>
            <table class="table-auto w-full mb-6">
                <thead>
                <tr>
                    <th class="text-left">Slot</th>
                    <th class="text-left">Popis</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><code>default</code></td>
                    <td>Hlavní obsah bloku</td>
                </tr>
                <tr>
                    <td><code>title</code></td>
                    <td>Nadpis bloku (volitelný)</td>
                </tr>
                </tbody>
            </table>

            <h3 class="text-lg font-semibold mb-4">InfoBlockItem Slots</h3>
            <table class="table-auto w-full">
                <thead>
                <tr>
                    <th class="text-left">Slot</th>
                    <th class="text-left">Popis</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><code>default</code></td>
                    <td>Obsah hodnoty (alternativa k prop value)</td>
                </tr>
                </tbody>
            </table>
        </template>
    </DocPage>
</template>
