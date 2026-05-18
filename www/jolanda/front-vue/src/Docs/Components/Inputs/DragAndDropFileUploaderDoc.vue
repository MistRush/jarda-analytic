<script setup>
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage import="global">
        <template #title> DragAndDropFileUploader </template>
        <template #content>
            <p>DragAndDropFileUploader komponenta slouží pro instatní upload obrázku na server a vytvoření i návazné relace.</p>

            <Example title="Základní použití">
                <p>Komponenta má emit <prop>change</prop>, přes kterou můžeme zachytit přidání/smazání souboru a následné na to zavěsit vlastní logiku.</p>

                <ul class="mt-2">
                    <li>parentID - parent ID</li>
                    <li>parentColumn - Název parent sloupce v relační tabulce</li>
                    <li>manager - manager k relační tabulce</li>
                    <li>path - cesta ke složce pro náhled nahraného obrázku</li>
                </ul>

                <Preview
                    code='
          <template>
            <DragAndDropFileUploader
                uploadAttributes="product-type-image"
                :parentID="data.ID"
                parentColumn="Product_ID"
                manager="admin/product-image"
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
                                <td class="px-4 py-2 font-mono"><Prop>uploadUrl</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">URL pro nahrání souboru. Defaultně '/common/file/upload'</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>uploadAttributes</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Parametry které se pošlou na uploadURL. Pokud předáme string, nastaví se urlParametr <code>type</code> na tuto hodnotu</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>manager</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Manager pro relační tabulku</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>parentID</Prop></td>
                                <td class="px-4 py-2"><code>String | Number</code></td>
                                <td class="px-4 py-2">ParentID pro relační tabulku</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>parentColumn</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název parent sloupce v relační tabulce</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>fileColumn</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název file sloupce v relační tabulce. Defaultně 'File_ID'</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>path</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Cesta k nahranému souboru na serveru pro preview</td>
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
                                <td class="px-4 py-2 font-mono"><code>change</code></td>
                                <td class="px-4 py-2">Emitováno při přidání, nebo smazání souboru.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
