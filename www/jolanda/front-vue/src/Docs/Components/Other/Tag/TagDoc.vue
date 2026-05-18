<script setup>
import Tag from "@/Components/Other/Tag/Tag.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    variant: "primary",
    light: false,
});
</script>

<template>
    <DocPage import="global">
        <template #title> Tag </template>
        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <Prop>Tag</Prop> se používá pro zvýraznění hodnot, statusů nebo kategorií.</p>
                <Preview
                    code="
          <template>
            <Tag>Hotovo</Tag>
          </template>
        "
                >
                    <Tag>Hotovo</Tag>
                </Preview>
            </Example>

            <!--      <Example title="Varianty">-->
            <!--        <p>Přes <Prop>variant</Prop> můžeš měnit barevné schéma tagu (např. <code>primary</code>, <code>success</code>, <code>warning</code> atd. — musí být definované ve stylech).</p>-->
            <!--        <Preview code="-->
            <!--          <template>-->
            <!--            <Tag variant=&quot;primary&quot;>Hlavní</Tag>-->
            <!--            <Tag variant=&quot;success&quot;>Úspěch</Tag>-->
            <!--          </template>-->
            <!--        ">-->
            <!--          <Tag variant="primary">Hlavní</Tag>-->
            <!--          <Tag variant="success">Úspěch</Tag>-->
            <!--        </Preview>-->
            <!--      </Example>-->

            <Example title="Světlý režim">
                <p>Pomocí <Prop>light</Prop> můžeš zobrazit světlejší verzi tagu.</p>
                <Preview
                    code='
          <template>
            <Tag :light="true">Světlý tag</Tag>
          </template>
        '
                >
                    <Tag :light="true">Světlý tag</Tag>
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
                                <td class="px-4 py-2">Barevná varianta štítku. Např. <code>primary</code>. Výchozí: <code>primary</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>light</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Použije světlý (light) odstín barvy varianty. Výchozí: <code>false</code>.</td>
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
