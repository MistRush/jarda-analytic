<script setup>
import Loader from "@/Components/Other/Loading/Loader.vue";
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage import="@/Components/Other/Loading/Loader.vue">
        <template #title> Loader </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>Loader</code> zobrazuje animovaný spinner, který signalizuje načítání dat nebo zpracování. Spinner se skládá z 9 animovaných čtverečků s pulzující animací.</p>

                <Preview
                    code="
          <template>
            <Loader :loading='true' />
          </template>
        "
                >
                    <Loader :loading="true" />
                </Preview>
            </Example>

            <Example title="Vlastnosti (props)">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2">Prop</th>
                                <th class="px-4 py-2">Typ</th>
                                <th class="px-4 py-2">Výchozí hodnota</th>
                                <th class="px-4 py-2">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono">loading</td>
                                <td class="px-4 py-2">Boolean</td>
                                <td class="px-4 py-2"><code>true</code></td>
                                <td class="px-4 py-2">Zobrazuje spinner, pokud je <code>true</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">color</td>
                                <td class="px-4 py-2">String</td>
                                <td class="px-4 py-2"><code>'#5dc596'</code></td>
                                <td class="px-4 py-2">Barva čtverečků spinneru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">size</td>
                                <td class="px-4 py-2">String</td>
                                <td class="px-4 py-2"><code>'15px'</code></td>
                                <td class="px-4 py-2">Velikost jednotlivých čtverečků.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">margin</td>
                                <td class="px-4 py-2">String</td>
                                <td class="px-4 py-2"><code>'2px'</code></td>
                                <td class="px-4 py-2">Vnější mezera mezi čtverečky.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">radius</td>
                                <td class="px-4 py-2">String</td>
                                <td class="px-4 py-2"><code>'100%'</code></td>
                                <td class="px-4 py-2">Zaoblení rohů čtverečků (např. <code>0%</code> pro čtverce).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">center</td>
                                <td class="px-4 py-2">Boolean</td>
                                <td class="px-4 py-2"><code>true</code></td>
                                <td class="px-4 py-2">Zarovnání spinneru na střed rodiče.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>

            <Example title="Styling a animace">
                <p>Komponenta využívá CSS animaci <code>v-gridStretchDelay</code> pro plynulý efekt pulsování každého čtverečku s náhodným zpožděním a délkou animace. Díky tomu spinner působí dynamicky a nepřerušovaně.</p>
            </Example>
        </template>
    </DocPage>
</template>
