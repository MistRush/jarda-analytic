<script setup>
import Tabs from '@/Components/Other/Tabs.vue';
import Tab from '@/Components/Other/Tab.vue';
import DocPage from '@/Docs/DocPage.vue';
import Example from '@/Docs/Example.vue';
import Preview from '@/Docs/Preview.vue';
import Prop from '@/Docs/Prop.vue';
import { reactive } from 'vue';

const state = reactive({
    activeTab: 'tab1'
});
</script>

<template>
    <DocPage import="global">
        <template #title>
            Tabs & Tab
        </template>
        
        <template #description>
            Komponenty <Prop>Tabs</Prop> a <Prop>Tab</Prop> slouží k vytvoření tabového rozhraní. <Prop>Tabs</Prop> je kontejner, který spravuje aktivní tab, zatímco <Prop>Tab</Prop> reprezentuje jednotlivé záložky s obsahem.
        </template>

        <template #content>
            <Example title="Základní použití">
                <p>
                    Základní tabové rozhraní se skládá z komponenty <Prop>Tabs</Prop> obsahující jednotlivé <Prop>Tab</Prop> komponenty.
                </p>
                <Preview code="
          <template>
            <Tabs>
              <Tab name=&quot;tab1&quot; title=&quot;První tab&quot;>
                <p>Obsah prvního tabu.</p>
              </Tab>
              <Tab name=&quot;tab2&quot; title=&quot;Druhý tab&quot;>
                <p>Obsah druhého tabu.</p>
              </Tab>
              <Tab name=&quot;tab3&quot; title=&quot;Třetí tab&quot;>
                <p>Obsah třetího tabu.</p>
              </Tab>
            </Tabs>
          </template>
        ">
                    <Tabs>
                        <Tab name="tab1" title="První tab">
                            <p>Obsah prvního tabu.</p>
                        </Tab>
                        <Tab name="tab2" title="Druhý tab">
                            <p>Obsah druhého tabu.</p>
                        </Tab>
                        <Tab name="tab3" title="Třetí tab">
                            <p>Obsah třetího tabu.</p>
                        </Tab>
                    </Tabs>
                </Preview>
            </Example>

            <Example title="Horizontální layout">
                <p>
                    Pomocí prop <Prop>horizontal</Prop> můžeš zobrazit taby horizontálně v řadě místo vertikálně.
                </p>
                <Preview code="
          <template>
            <Tabs horizontal>
              <Tab name=&quot;info&quot; title=&quot;Informace&quot;>
                <div class=&quot;p-4&quot;>
                  <h3 class=&quot;font-bold mb-2&quot;>Základní informace</h3>
                  <p>Zde jsou základní informace o produktu.</p>
                </div>
              </Tab>
              <Tab name=&quot;specs&quot; title=&quot;Specifikace&quot;>
                <div class=&quot;p-4&quot;>
                  <h3 class=&quot;font-bold mb-2&quot;>Technické specifikace</h3>
                  <ul>
                    <li>Rozměry: 100x50x25 cm</li>
                    <li>Hmotnost: 2.5 kg</li>
                  </ul>
                </div>
              </Tab>
            </Tabs>
          </template>
        ">
                    <Tabs horizontal>
                        <Tab name="info" title="Informace">
                            <div class="p-4">
                                <h3 class="font-bold mb-2">Základní informace</h3>
                                <p>Zde jsou základní informace o produktu.</p>
                            </div>
                        </Tab>
                        <Tab name="specs" title="Specifikace">
                            <div class="p-4">
                                <h3 class="font-bold mb-2">Technické specifikace</h3>
                                <ul>
                                    <li>Rozměry: 100x50x25 cm</li>
                                    <li>Hmotnost: 2.5 kg</li>
                                </ul>
                            </div>
                        </Tab>
                    </Tabs>
                </Preview>
            </Example>

            <Example title="S ikonami">
                <p>
                    Taby mohou obsahovat ikony pomocí prop <Prop>icon</Prop> na komponentě <Prop>Tab</Prop>.
                </p>
                <Preview code="
          <template>
            <Tabs horizontal>
              <Tab name=&quot;user&quot; title=&quot;Uživatel&quot; icon=&quot;user&quot;>
                <div class=&quot;p-4&quot;>
                  <p>Informace o uživateli</p>
                </div>
              </Tab>
              <Tab name=&quot;settings&quot; title=&quot;Nastavení&quot; icon=&quot;settings&quot;>
                <div class=&quot;p-4&quot;>
                  <p>Nastavení aplikace</p>
                </div>
              </Tab>
              <Tab name=&quot;help&quot; title=&quot;Nápověda&quot; icon=&quot;help&quot;>
                <div class=&quot;p-4&quot;>
                  <p>Nápověda a dokumentace</p>
                </div>
              </Tab>
            </Tabs>
          </template>
        ">
                    <Tabs horizontal>
                        <Tab name="user" title="Uživatel" icon="user">
                            <div class="p-4">
                                <p>Informace o uživateli</p>
                            </div>
                        </Tab>
                        <Tab name="settings" title="Nastavení" icon="settings">
                            <div class="p-4">
                                <p>Nastavení aplikace</p>
                            </div>
                        </Tab>
                        <Tab name="help" title="Nápověda" icon="help">
                            <div class="p-4">
                                <p>Nápověda a dokumentace</p>
                            </div>
                        </Tab>
                    </Tabs>
                </Preview>
            </Example>

            <Example title="Výchozí aktivní tab">
                <p>
                    Pomocí prop <Prop>defaultTab</Prop> můžeš určit, který tab má být aktivní při načtení.
                </p>
                <Preview code="
          <template>
            <Tabs defaultTab=&quot;second&quot; horizontal>
              <Tab name=&quot;first&quot; title=&quot;První&quot;>
                <p>První tab</p>
              </Tab>
              <Tab name=&quot;second&quot; title=&quot;Druhý (výchozí)&quot;>
                <p>Tento tab je aktivní při načtení</p>
              </Tab>
              <Tab name=&quot;third&quot; title=&quot;Třetí&quot;>
                <p>Třetí tab</p>
              </Tab>
            </Tabs>
          </template>
        ">
                    <Tabs defaultTab="second" horizontal>
                        <Tab name="first" title="První">
                            <p>První tab</p>
                        </Tab>
                        <Tab name="second" title="Druhý (výchozí)">
                            <p>Tento tab je aktivní při načtení</p>
                        </Tab>
                        <Tab name="third" title="Třetí">
                            <p>Třetí tab</p>
                        </Tab>
                    </Tabs>
                </Preview>
            </Example>

            <Example title="Responzivní chování">
                <p>
                    Na mobilních zařízeních se taby automaticky zobrazí jako dropdown menu pro lepší použitelnost.
                </p>
                <Preview code="
          <template>
            <Tabs horizontal>
              <Tab name=&quot;mobile1&quot; title=&quot;Tab 1&quot;>
                <div class=&quot;p-4&quot;>
                  <p>Na mobilu se zobrazí jako dropdown</p>
                </div>
              </Tab>
              <Tab name=&quot;mobile2&quot; title=&quot;Tab 2&quot;>
                <div class=&quot;p-4&quot;>
                  <p>Automatické přepnutí na základě breakpointu</p>
                </div>
              </Tab>
            </Tabs>
          </template>
        ">
                    <Tabs horizontal>
                        <Tab name="mobile1" title="Tab 1">
                            <div class="p-4">
                                <p>Na mobilu se zobrazí jako dropdown</p>
                            </div>
                        </Tab>
                        <Tab name="mobile2" title="Tab 2">
                            <div class="p-4">
                                <p>Automatické přepnutí na základě breakpointu</p>
                            </div>
                        </Tab>
                    </Tabs>
                </Preview>
            </Example>
        </template>

        <template #props>
            <h3 class="text-lg font-semibold mb-4">Tabs Props</h3>
            <table class="table-auto w-full mb-6">
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
                    <td><code>horizontal</code></td>
                    <td>Boolean</td>
                    <td>false</td>
                    <td>Zobrazí taby horizontálně</td>
                </tr>
                <tr>
                    <td><code>defaultTab</code></td>
                    <td>String</td>
                    <td>null</td>
                    <td>ID tabu, který má být aktivní při načtení</td>
                </tr>
                </tbody>
            </table>

            <h3 class="text-lg font-semibold mb-4">Tab Props</h3>
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
                    <td><code>title</code></td>
                    <td>String</td>
                    <td>-</td>
                    <td>Název tabu (povinný)</td>
                </tr>
                <tr>
                    <td><code>name</code></td>
                    <td>String</td>
                    <td>random</td>
                    <td>Unikátní identifikátor tabu</td>
                </tr>
                <tr>
                    <td><code>icon</code></td>
                    <td>String</td>
                    <td>undefined</td>
                    <td>Ikona zobrazená vedle názvu</td>
                </tr>
                </tbody>
            </table>
        </template>

        <template #events>
            <h3 class="text-lg font-semibold mb-4">Tabs Events</h3>
            <table class="table-auto w-full">
                <thead>
                <tr>
                    <th class="text-left">Event</th>
                    <th class="text-left">Parametry</th>
                    <th class="text-left">Popis</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><code>tab-change</code></td>
                    <td>tabId (String)</td>
                    <td>Vyvolán při změně aktivního tabu</td>
                </tr>
                </tbody>
            </table>
        </template>

        <template #slots>
            <h3 class="text-lg font-semibold mb-4">Tabs Slots</h3>
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
                    <td>Obsahuje Tab komponenty</td>
                </tr>
                </tbody>
            </table>

            <h3 class="text-lg font-semibold mb-4">Tab Slots</h3>
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
                    <td>Obsah tabu</td>
                </tr>
                </tbody>
            </table>
        </template>
    </DocPage>
</template>
