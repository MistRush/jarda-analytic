<script setup>
import HighlightText from "@/Components/Other/HighlightText.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
import { reactive } from "vue";

const state = reactive({
    text: "Zvýrazníme slova v tomto textu.",
    highlight: "slova",
});
</script>

<template>
    <DocPage import="@/Components/Other/HighlightText.vue">
        <template #title> HighlightText </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>HighlightText</code> zvýrazní výskyty slova nebo slov v řetězci pomocí HTML. Vstupní text se předává přes prop <Prop>text</Prop>, hledaný řetězec přes <Prop>highlight</Prop>.</p>
                <Preview
                    code='
          <template>
            <HighlightText
              text="Zvýrazníme slova v tomto textu."
              highlight="slova"
            />
          </template>
        '
                >
                    <HighlightText text="Zvýrazníme slova v tomto textu." highlight="slova" />
                </Preview>
            </Example>

            <Example title="Více slov">
                <p>Prop <Prop>highlight</Prop> může být také pole – zvýrazní se více různých výrazů.</p>
                <Preview
                    code="
          <template>
            <HighlightText
              text=&quot;Tento text zvýrazní více slov najednou.&quot;
              :highlight=&quot;['text', 'slov']&quot;
            />
          </template>
        "
                >
                    <HighlightText text="Tento text zvýrazní více slov najednou." :highlight="['text', 'slov']" />
                </Preview>
            </Example>

            <Example title="Interaktivní ukázka">
                <p>Pomocí vstupních polí můžeme dynamicky měnit text a výraz(y), které se mají zvýraznit.</p>
                <Preview
                    code='
          <template>
            <HighlightText :text="state.text" :highlight="state.highlight" />
          </template>
        '
                >
                    <template #header>
                        <InputField class="w-[49%]!" label="Text" v-model="state.text" />
                        <InputField class="w-[49%]!" label="Highlight" v-model="state.highlight" />
                    </template>
                    <HighlightText :text="state.text" :highlight="state.highlight" />
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
                                <td class="px-4 py-2 font-mono"><Prop>highlight</Prop></td>
                                <td class="px-4 py-2"><code>String | Array</code></td>
                                <td class="px-4 py-2">Text nebo pole textů, které se mají zvýraznit ve vstupním <Prop>text</Prop>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>text</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Vstupní text, ve kterém se vyhledává zvýraznění.</td>
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