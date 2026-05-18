<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage>
        <template #title> Alerts </template>

        <template #content>
            <Example title="usealerts">
                <p>Composable funkce která se stará o alerty</p>

                <div class="mt-2">
                    <b>Funkce obsahuje:</b>
                    <ul class="pl-4">
                        <li>- <Prop>alerts</Prop>: všechny alerty</li>
                        <li>- <Prop>push</Prop>: obecná funkce pro push alertu</li>
                        <li>- <Prop>removeAlert</Prop>: smaže alert</li>
                        <li>- <Prop>danger</Prop>: alias pro error</li>
                        <li>- <Prop>info</Prop></li>
                        <li>- <Prop>warning</Prop></li>
                        <li>- <Prop>waiting</Prop></li>
                        <li>- <Prop>success</Prop></li>
                        <li>- <Prop>showHistoryBar</Prop>: zobrazí sidebar s historií alertů</li>
                        <li>- <Prop>isHistoryBarShown</Prop></li>
                        <li>- <Prop>processStatuses</Prop>: funkce pro zobrazování alertů ze statusManageru z php</li>
                    </ul>
                </div>

                <Preview
                    code="
          <script setup>
            import {useAlerts} from '@/Composables/useAlerts.js';

            const { success } = useAlerts();

            success('OK', 'description');
          </script>
        "
                >
                    <template #header> success </template>
                </Preview>

                <Preview
                    code="
          <script setup>
            import {useAlerts} from '@/Composables/useAlerts.js';

            const { waiting } = useAlerts();

            const alert = waiting('Odesílám data', 'description');
            setTimeout(() => {
              alert.changeToSuccess('Odesláno');
            },2000);
          </script>
        "
                >
                    <template #header> waiting </template>
                </Preview>

                <Preview
                    code="
          <script setup>
            import {useAlerts} from '@/Composables/useAlerts.js';

            const { success } = useAlerts();

            success('asd', '<div>asdasd</div>', null, 5000, {textTrusted: true})
            success('<div>asdasd</div>', 'asd', null, 5000, {titleTrusted: true})
          </script>
        "
                >
                    <template #header> Zobrazování HTML v textu, nebo v titulku </template>
                </Preview>
            </Example>

            <Example title="useAlert">
                <p>Funkce jako success, error, waiting, info vrací object useAlert, který obsahuje všechny informace o alertu, které lze i měnit.</p>

                <div class="mt-2">
                    <b>Obsahuje:</b>
                    type, title, message, createdAt, data, areDataShown, toggleData, changeToSuccess, changeToWarning, changeToInfo, changeToError, options
                    <ul class="pl-4">
                        <li>- <Prop>type</Prop>: typ alertu (success, error, ...)</li>
                        <li>- <Prop>title</Prop></li>
                        <li>- <Prop>message</Prop></li>
                        <li>- <Prop>createdAt</Prop></li>
                        <li>- <Prop>data</Prop>: data která se zobrazí při rozkliknutí alertu</li>
                        <li>- <Prop>areDataShown</Prop></li>
                        <li>- <Prop>toggleData</Prop></li>
                        <li>- <Prop>changeToSuccess</Prop></li>
                        <li>- <Prop>changeToWarning</Prop></li>
                        <li>- <Prop>changeToInfo</Prop></li>
                        <li>- <Prop>changeToError</Prop></li>
                    </ul>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
