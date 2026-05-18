<script setup>
import Preview from "@/Docs/Preview.vue";
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Prop from "@/Docs/Prop.vue";
</script>

<template>
    <DocPage import="global">
        <template #title> EditorFileInputDoc </template>
        <template #content>
            <p>Tato komponenta slouží pro nahrávání souboru uvnitř editoru. Musí být použitá pouze v Editor komponentě. Interně rozšiřuje komponentu FileInput a příjmá všechny její props</p>

            <Example title="Základní použití">
                <Preview
                    code='
          <template>
            <EditorFileInput
              name="PTImage_ID"
              v-model="data.PTImage_ID"
              label="Obrázek"
              uploadAttributes="product-type-image"
              :file-name="data.PTImageFileName"
              accept="image/*"
            />
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Preview obrázku">
                <p>Pro zapnutí preview musím nastavit prop preview a path (cesta k souboru pro zobrazení)</p>
                <Preview
                    code='
          <template>
            <EditorFileInput
              name="PTImage_ID"
              v-model="data.PTImage_ID"
              label="Obrázek"
              uploadAttributes="product-type-image"
              :file-name="data.PTImageFileName"
              accept="image/*"
              preview
              path="/files/images/product-type-images/"
            />
          </template>
        '
                >
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
                                <td class="px-4 py-2"><code>String | Number</code></td>
                                <td class="px-4 py-2">Hodnota pole (pro v-model) [ID obrázku].</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Popisek inputu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>name</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Jméno inputu pro formulář.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>uploadUrl</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">URL pro upload obrázku. Defaultní: /common/file/upload</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>fileName</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název souboru + extension pro správne zobrazení nahraného souboru a preview</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>folder</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2"></td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>uploadAttributes</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Parametry které se pošlou na uploadURL. Pokud předáme string, nastaví se urlParametr <code>type</code> na tuto hodnotu</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>placeholder</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Placeholder text.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>size</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Velikost inputu: <code>default</code>, <code>size-small</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>readonly</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Vstup je pouze pro čtení.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>variant</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">?</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>variant</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Styl komponenty (např. <code>default</code>, <code>fancy</code>).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>preview</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Zapne zobrazení preview</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>path</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Cesta k souboru k náhledu pro preview</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>accept</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Typy souboru povolené k výběru (html accept)</td>
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
                                <td class="px-4 py-2 font-mono text-gray-400 italic" colspan="2">Žádné</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
