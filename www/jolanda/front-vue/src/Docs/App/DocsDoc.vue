<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage>
        <template #title> Docs </template>

        <template #content>
            <p>Dokumentace Jolandy. Na každém projektu je třeba vytvořit stránku du které se aplikace vloží. Např /default/jolanda/index</p>

            <Example title="/default/jolanda/index.vue">
                <Preview
                    code="
<script setup>
    import Docs from '@/Docs/Docs.vue';
</script>

<template>
    <Docs></Docs>
</template>
        "
                >
                </Preview>
            </Example>

            <Example title="vueDevTools">
                <p>Je možnost přidat si dokumentaci jako další tab do vueDevTools. Musíme jen při mountování apky v main.js nastavit cestu na které nám dokumentace běží.</p>

                <Preview
                    code='
        jolandaApp.mountApp({
            docsUrl: "http://www.cdb.localhost/default/jolanda?_nolayout",
        });
                '
                >
                    <template #header> Příklad mountování apky v main.js </template>
                </Preview>
            </Example>
        </template>
    </DocPage>
</template>
