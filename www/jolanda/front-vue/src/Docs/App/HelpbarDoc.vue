<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage>
        <template #title> Helpbar </template>

        <template #content>
            <p>Pro implementaci helpbaru je nutné provést tyto kroky:</p>

            <Example title="Aktivace helpbaru">
                <p>Nejprve do konfiguračního souboru <b>jolanda.ini</b> přidáme následující nastavení:</p>

                <Preview
                        code="
    ;zde je předchozí nastavení

    [HELPBAR]
    vueHelpbar = 1
    jolandaDocsDatabase = 'd_cdbremante'
                    "
                >
                    <template #header> jolanda.ini </template>
                </Preview>

                <p>
                    Poté vytvoříme v projektu nový admin controller <Prop>DocsController</Prop>, který rozšiřuje stejnojmenný controller
                    v Jolandě. Dobrovolně taky můžeme dodefinovat atribut <b>SessionUserKey</b>, který určuje pod jakým klíčem jsou v
                    PHP sessionu uchovávány informace o přihlášeném uživateli pro účely kontroly přístupu ke změnám v nástroji.

                    Výchozím klíčem k informacím o přihlášeném uživateli je <b>app_user</b> (data budou v <Prop>$_SESSION['app_user']</Prop>)
                </p>

                <Preview
                    code="
    <?php

    class Admin_DocsController extends \Jolanda\Controller\DocsController {
        protected string $SessionUserKey = 'cdb_app_logged_user'; # Výchozí hodnota - 'app_user'
    }

"
                >

                    <template #header>.../modules/admin/controllers/DocsController.php</template>
                </Preview>

                <p>Nakonec už stačí pouze nechat nástroj vygenerovat a zkontrolovat tabulky, a to na adrese
                    "(URL webu)<b>/admin/docs/init</b>"
                </p>
                <p class="pt-2">
                    Kontrolu existence tabulek pro projekt můžeme po provedení všech kroků spustit
                    <a class="underline font-bold hover:no-underline" href="/admin/docs/init">zde</a>
                </p>
            </Example>


        </template>
    </DocPage>
</template>
