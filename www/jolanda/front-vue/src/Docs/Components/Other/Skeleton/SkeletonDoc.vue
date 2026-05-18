<script setup>
import Skeleton from "@/Components/Other/Skeleton/Skeleton.vue";
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage import="@/Components/Other/Skeleton/Skeleton.vue">
        <template #title> Skeleton </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>Skeleton</code> slouží jako jednoduchý skeleton loader, tedy placeholder s efektem pulzování, který se často používá při načítání obsahu.</p>

                <Preview
                    code='
          <template>
            <Skeleton class="w-full">
              <div class="h-6 bg-gray-300 rounded-md w-full">Ahoj Světě!</div>
            </Skeleton>
          </template>
        '
                >
                    <Skeleton class="w-full">
                        <div class="h-6 bg-gray-300 rounded-md w-full"></div>
                    </Skeleton>
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
                                <td class="px-4 py-2 font-mono"><Prop>default</Prop></td>
                                <td class="px-4 py-2"><code>Slot</code></td>
                                <td class="px-4 py-2">Slot pro vlastní skeleton/shimmer obsah, např. pruhy, kruhy, atd.</td>
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
