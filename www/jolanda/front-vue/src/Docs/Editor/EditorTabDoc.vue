<script setup>
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage import="global">
        <template #title> EditorTab </template>

        <template #content>
            <Example title="Použití EditorTab">
                <p>Komponenta <Prop>EditorTab</Prop> definuje sekci v rámci editoru. Musí být použita uvnitř komponenty <Prop>Editor</Prop>.</p>
                <Preview
                    code='
          <template>
            <Editor
              :manager="&apos;admin/user&apos;"
              :schema="schema"
            >
              <template #default="{ data }">
                <EditorTab title="Základní informace">
                  <!--     Inputy, nebo EditorGroup        -->
                </EditorTab>
                <EditorTab title="Další sekce">
                  <!--     Inputy, nebo EditorGroup        -->
                </EditorTab>
              </template>
            </Editor>
          </template>
        '
                >
                </Preview>
            </Example>

            <Example title="Vlastnosti EditorTab">
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
                                <td class="px-4 py-2 font-mono"><Prop>title</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název sekce zobrazený v levém menu editoru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>icon</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Název ikony, zobrazená v listu tabů. Předává se do komponenty <prop>Icon</prop>, takže příjmá stejné values</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
