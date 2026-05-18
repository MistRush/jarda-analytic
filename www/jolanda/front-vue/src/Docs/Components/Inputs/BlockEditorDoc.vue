<script setup>
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";
import BlockEditor from "@/Components/Inputs/BlockEditor.vue";

const state = reactive({
    Content: null,
    Content2: null,
});

const addBlocks = (editor) => {
    editor.BlockManager.add("block-image", {
        type: "block-image",
        label: "Obrázek",
        content: '<img class="block-image w-100 h-auto" src="https://placehold.co/700x300.png">',
        category: "Hlavní",
        attributes: {
            title: "Vložit obrázek",
        },
    });
};
</script>

<template>
    <DocPage import="@/Components/Inputs/BlockEditor.vue">
        <template #title> BlockEditor </template>
        <template #content>
            <p>BlockEditor slouží k sestavení html stránky pomocí drag and drop bloků ve stylu elementoru. Bloky si musíme definovat sami na každém projektu</p>

            <Example title="Základní požití">
                <Preview
                    code='
          <template>
            <BlockEditor name="Content" v-model="state.Content" label="Content"  />
          </template>
        '
                >
                    <BlockEditor name="Content" v-model="state.Content" label="Content" class="w-full" />
                </Preview>
            </Example>

            <Example title="Vlastní bloky">
                <p>Ukázka vložení vlastního bloku. Dále už se postupuje podle dokumentace grapesjs</p>

                <Preview
                    code='
          <script setup>
              const addBlocks = (editor) => {
                    editor.BlockManager.add("block-image", {
                        type: "block-image",
                        label: "Obrázek",
                        content: "<img class=&apos;block-image w-100 h-auto&apos; src=&apos;https://placehold.co/700x300.png&apos;>",
                        category: "Hlavní",
                        attributes: {
                            title: "Vložit obrázek"
                        }
                    });
              }
          </script>

          <template>
            <BlockEditor name="Content2" v-model="state.Content2" label="Content2" @addBlocks="addBlocks"  />
          </template>
        '
                >
                    <BlockEditor name="Content2" v-model="state.Content2" label="Content2" class="w-full" @addBlocks="addBlocks" />
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
                                <td class="px-4 py-2 font-mono"><Prop>modelValue</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Hodnota pole (pro v-model).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">HTML ID inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>required</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zobrazí hvězdičku a validaci povinnosti.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Jméno inputu pro formulář.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono">
                                    <Prop>help</Prop>
                                </td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí nápovědu v tooltipu.</td>
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
                                <td class="px-4 py-2 font-mono"><code>@addBlocks</code></td>
                                <td class="px-4 py-2">Zde přidáváme vlastní bloku. Má parametr editor, což je object grapesjs</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
