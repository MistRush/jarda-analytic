<script setup>
import DocPage from "@/Docs/DocPage.vue";
import DirectoryTree from "@/Components/Other/DirectoryTree/DirectoryTree.vue";
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";

const projectFiles = {
    name: "vue",
    children: [
        { name: "node_modules", children: [] },
        { name: "public", children: [] },
        {
            name: "src",
            children: [
                { name: "assets [asety (css/img...)]", children: [] },
                {
                    name: "components",
                    children: [
                        { name: "grids [gridy]", children: [] },
                        { name: "editors [editory]", children: [] },
                        { name: "modals [modály]", children: [] },
                        { name: "*** [další komponenty]", children: [] },
                    ],
                },
                { name: "composables [composables funkce]", children: [{ name: "models [modelové composables (produkty, ava, uživatelé)]", children: [] }] },
                { name: "js", children: [] },
                { name: "layouts [layouty]", children: [] },
                {
                    name: "pages [stránky]",
                    children: [
                        {
                            name: "default",
                            children: [
                                {
                                    name: "product",
                                    children: [
                                        { name: "index.vue", children: [] },
                                        { name: "editor.vue [/default/product/editor]", children: [] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { name: "components.d.ts", children: [] },
                { name: "main.js", children: [] },
            ],
        },
        { name: "jsconfig.json", children: [] },
        { name: "package.json", children: [] },
        { name: "tsconfig.json", children: [] },
        { name: "vite.config.ts", children: [] },
    ],
};
</script>

<template>
    <DocPage>
        <template #title> App </template>

        <template #content>
            <Example title="useApp">
                useApp composable funkce vrací object App, který obsahuje věci jako settings, user, layout, menu, router atd.

                <div class="mt-2">
                    <b>Funkce obsahuje:</b>
                    <ul class="pl-4">
                        <li>- <Prop>app</Prop>: celý obejct app, který obasuhuje i věci níže</li>
                        <li>- <Prop>router</Prop>: aktuální router aplikace včetně další logiky</li>
                        <li>- <Prop>layout</Prop>: object layoutu, který obasuje například menu</li>
                        <li>- <Prop>settings</Prop>: obsahuje předané parametry z php, (v latte baseParams)</li>
                        <li>- <Prop>user</Prop>: obsahuje object usera předaný z php</li>
                    </ul>
                </div>

                <Preview
                    code="
          <script setup>
            import {useApp} from '@/App/composables/useApp';

            const { user } = useApp();
          </script>
        "
                >
                </Preview>
            </Example>

            <Example title="Importy">
                Importy z jolandy začínají "@/..."
                <br />
                Importy z projektové složky "@project/..."
            </Example>

            <Example title="Adresářová struktura">
                <DirectoryTree :files="projectFiles" />
            </Example>

            <Example title="npm">
                pro start aplikace použijeme přikaz "npm run dev"
                <br />
                pro build apliakce "npm run build"
                <br /><br />
                Aplikace sama detekuje jestli na portu definovaném v jolanda.ini běži vite server a podle toho nalinkuje zbuilděnou aplikaci, nebo develop verzi.
            </Example>
        </template>
    </DocPage>
</template>
