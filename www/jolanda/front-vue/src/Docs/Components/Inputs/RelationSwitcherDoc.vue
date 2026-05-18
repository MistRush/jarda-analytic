<script setup>
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage import="global">
        <template #title> RelationSwitcher </template>
        <template #content>
            <Example title="Základní použití">
                <p>Komponenta podporuje <Prop>v-model</Prop> a prop <Prop>value</Prop> pro nastavení návratové hodnoty při výběru.</p>
                <Preview
                    code='
                 <RelationSwitcher
                    source-manager="/user/permission" // Manager podporuje stejné options jako useManager
                    relation-manager="/user/user-has-permission" // Manager podporuje stejné options jako useManager
                    :parentID="data.ID"
                    parentColumn="User_ID"
                    childColumn="Permission_ID"
                    childNameColumn="Name"
                    label="Oprávnění"
                />
        '
                >
                </Preview>
            </Example>

            <Example title="Category tree">
                <p>Náhrada za categoryTree komponentu ze staré jolandy je využít správně nastavený relationSwitcher</p>
                <Preview
                    code='
                    <RelationSwitcher
                        sourceManager="admin/car-category"
                        relationManager="admin/product-car-category"
                        :parentID="id"
                        parentColumn="Product_ID"
                        childColumn="CarCategory_ID"
                        childNameColumn="NameCZ"
                        groupByColumn="CarCategory_ID"
                        groupByNameColumn="NameCZ"
                        :label="_l("Kategorie vozidel")"
              />
          '
                >
                    <template #header> $group->addCategoryTree('body_type_tree', translate('Kategorie vozidel'), ['module' => 'admin', 'controller' => 'car-category'], "Name$langCode", 'admin/product-car-category', 'Product_ID', 'CarCategory_ID', 'CarCategory_ID'); </template>
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
                                <td class="px-4 py-2 font-mono"><Prop>parentID</Prop></td>
                                <td class="px-4 py-2"><code>Number | null</code></td>
                                <td class="px-4 py-2">ID rodičovské entity, pro kterou se spravují relace. Volitelný parametr.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>sourceManager</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Definice správce, který poskytuje seznam všech možných položek (zdrojová data). Povinný.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>relationManager</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Definice správce, který obsluhuje vazby mezi entitami (vytváření/smazání). Povinný.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>parentColumn</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název sloupce v relaci reprezentující rodičovskou entitu. Povinný.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>childColumn</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název sloupce v relaci reprezentující podřízenou entitu. Povinný.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>childNameColumn</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název sloupce, který se použije pro zobrazení názvu podřízené entity (label). Povinný.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>groupByColumn</Prop></td>
                                <td class="px-4 py-2"><code>String | null</code></td>
                                <td class="px-4 py-2">Volitelný sloupec pro seskupení položek do skupin (např. podle typu).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>groupByNameColumn</Prop></td>
                                <td class="px-4 py-2"><code>String | null</code></td>
                                <td class="px-4 py-2">Volitelný sloupec obsahující název skupiny (zobrazovaný u nadpisu skupiny).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>label</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Nadpis komponenty zobrazovaný nad checkboxy. Povinný.</td>
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
                                <td class="px-4 py-2 font-mono"><code>@change</code></td>
                                <td class="px-4 py-2">Vyvolána při změně, před uložením na sever</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@afterChange</code></td>
                                <td class="px-4 py-2">Vyvolána při změně, po uložení na server</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
