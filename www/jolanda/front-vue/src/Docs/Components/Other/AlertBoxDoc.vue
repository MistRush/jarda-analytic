<script setup>
import AlertBox from "@/Components/Other/AlertBox.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";
import Select from "@/Components/Inputs/Select.vue";

const state = reactive({
    variant: "info",
});
</script>

<template>
    <DocPage import="global">
        <template #title> AlertBox </template>
        <template #description>
            Komponenta <Prop>AlertBox</Prop> slouží k zobrazení upozornění, informací nebo varování uživateli. Podporuje různé barevné varianty podobné Bootstrap alertům a umožňuje přidat vlastní ikonu a obsah.
        </template>
        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <Prop>AlertBox</Prop> se používá pro zobrazení informací uživateli. Obsah se zadává do default slotu.</p>
                <Preview
                    code='
          <template>
            <AlertBox variant="info">
                <p class="font-bold">Důležitá informace</p>
                <p class="text-sm">Toto je základní použití AlertBox komponenty.</p>
            </AlertBox>
          </template>
        '
                >
                    <AlertBox variant="info">
                        <p class="font-bold">Důležitá informace</p>
                        <p class="text-sm">Toto je základní použití AlertBox komponenty.</p>
                    </AlertBox>
                </Preview>
            </Example>

            <Example title="Varianty">
                <p>Přes prop <Prop>variant</Prop> můžeš měnit barevné schéma alertu. Dostupné varianty: <code>danger</code>, <code>success</code>, <code>warning</code>, <code>info</code>.</p>
                <Preview
                    code='
          <template>
            <AlertBox variant="danger">
                <p class="font-bold">Chyba</p>
                <p class="text-sm">Něco se pokazilo.</p>
            </AlertBox>
            <AlertBox variant="success">
                <p class="font-bold">Úspěch</p>
                <p class="text-sm">Operace proběhla úspěšně.</p>
            </AlertBox>
            <AlertBox variant="warning">
                <p class="font-bold">Varování</p>
                <p class="text-sm">Pozor na tuto situaci.</p>
            </AlertBox>
            <AlertBox variant="info">
                <p class="font-bold">Informace</p>
                <p class="text-sm">Důležitá informace pro uživatele.</p>
            </AlertBox>
          </template>
        '
                >
                    <template #header>
                        <Select 
                            class="w-75!" 
                            label="variant" 
                            :options="[
                                { text: 'danger', value: 'danger' },
                                { text: 'success', value: 'success' },
                                { text: 'warning', value: 'warning' },
                                { text: 'info', value: 'info' }
                            ]" 
                            v-model="state.variant" 
                        />
                    </template>
                    <AlertBox :variant="state.variant">
                        <p class="font-bold">Ukázka varianty</p>
                        <p class="text-sm">Toto je ukázka varianty: {{ state.variant }}</p>
                    </AlertBox>
                </Preview>
            </Example>

            <Example title="S ikonou">
                <p>Pomocí slotu <code>#icon</code> můžeš přidat vlastní ikonu do alertu. Ikona se zobrazí vlevo od obsahu.</p>
                <Preview
                    code='
          <template>
            <AlertBox variant="success">
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="9"/>
                            <path d="m8 12l3 3l5-6"/>
                        </g>
                    </svg>
                </template>
                <p class="font-bold">Úspěšně dokončeno</p>
                <p class="text-sm">Operace byla úspěšně dokončena.</p>
            </AlertBox>
          </template>
        '
                >
                    <AlertBox variant="success">
                        <template #icon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="9"/>
                                    <path d="m8 12l3 3l5-6"/>
                                </g>
                            </svg>
                        </template>
                        <p class="font-bold">Úspěšně dokončeno</p>
                        <p class="text-sm">Operace byla úspěšně dokončena.</p>
                    </AlertBox>
                </Preview>
            </Example>

            <Example title="Bez ikony">
                <p>Ikona je volitelná. Pokud slot <code>#icon</code> není použit, zobrazí se pouze obsah alertu.</p>
                <Preview
                    code='
          <template>
            <AlertBox variant="warning">
                <p class="font-bold">Varování</p>
                <p class="text-sm">Tento alert nemá ikonu.</p>
            </AlertBox>
          </template>
        '
                >
                    <AlertBox variant="warning">
                        <p class="font-bold">Varování</p>
                        <p class="text-sm">Tento alert nemá ikonu.</p>
                    </AlertBox>
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
                                <td class="px-4 py-2 font-mono"><Prop>variant</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Barevná varianta alertu. Možné hodnoty: <code>danger</code>, <code>success</code>, <code>warning</code>, <code>info</code>. Výchozí: <code>info</code>.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>

            <Example title="Sloty">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2">Slot</th>
                                <th class="px-4 py-2">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>default</code></td>
                                <td class="px-4 py-2">Hlavní obsah alertu. Může obsahovat libovolný HTML obsah, například nadpisy, odstavce, seznamy atd.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>#icon</code></td>
                                <td class="px-4 py-2">Volitelný slot pro ikonu zobrazenou vlevo od obsahu. Může obsahovat SVG, ikonu nebo jiný HTML obsah.</td>
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

