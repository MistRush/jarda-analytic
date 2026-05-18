<script setup>
import LoadingLine from "@/Components/Other/Loading/LoadingLine.vue";
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage import="@/Components/Other/Loading/LoadingLine.vue">
        <template #title> LoadingLine </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>LoadingLine</code> zobrazuje jednoduchý indikátor načítání ve formě pohybující se zelené linky. Slouží k vizuálnímu indikování probíhající operace, například načítání dat.</p>

                <Preview
                    code="
<template>
  <LoadingLine />
</template>
        "
                >
                    <LoadingLine />
                </Preview>
            </Example>

            <Example title="Popis komponenty">
                <p>Komponenta nevyužívá žádné <code>props</code> ani reaktivní data. Vizuálně je řešena pomocí čistého CSS.</p>

                <div class="overflow-x-auto mt-4">
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
                                <td colspan="4" class="px-4 py-2 italic text-muted">Komponenta nemá žádné vstupní vlastnosti.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>

            <Example title="Styly a animace">
                <ul>
                    <li>Výška linky: <code>5px</code>.</li>
                    <li>Barva: <code>#24c586</code>.</li>
                    <li>Animace: <code>@keyframes loading</code>, transformace zleva doprava přes celý prvek.</li>
                    <li>Animace se opakuje nekonečně s funkcí <code>cubic-bezier(0.4, 0, 0.6, 1)</code> pro plynulý efekt.</li>
                    <li>Šířka animovaného prvku: <code>60%</code> šířky rodiče.</li>
                </ul>
            </Example>
        </template>
    </DocPage>
</template>
