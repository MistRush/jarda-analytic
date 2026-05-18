<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage>
        <template #title> Error handler </template>

        <template #content>
            <p>Odchytávání a reportování Vue runtime a Axios chyb</p>

            <Example title="main.js">
                <p>Při mountování appky v main.js nastavíme endpoint na který chceme odesílat odchycené chyby. Tímto error handler zaktivníme.</p>
                <Preview
                    lang="js"
                    code="
    jolandaApp.mountApp({
        errorPath: '/default/jolanda/vue-error',
    });

"
                />
            </Example>

            <Example title="Chybový objekt">
                <p>Odchycený chybový objekt je následně této struktury:</p>
                <Preview lang="json" code='
    {
        "message": string,
        "host": string,
        "path": string,
        "component": {
            "name": string,
            "attrs": object,
            "props": object,
            "parentComponent": ... // Rekurzivně objekt stejné struktury
        },
        "ajax": {
            "url": string,
            "method": string,
            "status": number,
            "response": ? // Vráceno serverem
        }
    }

'
                />
            </Example>

            <Example title="PHP">
                <p>Na nastavený endpoint se odešle chybový objekt, který můžeme dále zpracovat, například odeslat emailem vývojářům.</p>
                <Preview
                    lang="php"
                    code='
    public function vueErrorAction() {
        $error = json_decode($this->getRequest()->getParam("error"), true);

        // Zpracování $error
    }

                '
                 />

                <p>Pro standardní využítí posláním chybového mailu je předpřipravená šablona</p>
                <Preview
                    lang="php"
                    code='
    public function vueErrorAction() {
        $error = json_decode($this->getRequest()->getParam("error"), true);
        $htmlBody = \Jolanda\ErrorHandler\ErrorHandler::renderVueErrorHTML($error, "user")

        // Odeslání mailu
    }

'
                />
            </Example>
        </template>
    </DocPage>
</template>
