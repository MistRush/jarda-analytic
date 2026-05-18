<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage>
        <template #title> Ajax </template>

        <template #content>
            <p>Pro ajax dotazy se používá composable useAjax, která v sobě implementuje axios.</p>

            <Example title="useAjax">
                <p>Composable funkce která implementuje axios</p>

                <div class="mt-2">
                    <b>Funkce obsahuje:</b>
                    <ul class="pl-4">
                        <li>- <Prop>get</Prop></li>
                        <li>- <Prop>post</Prop></li>
                        <li>- <Prop>put</Prop></li>
                        <li>- <Prop>postForm</Prop></li>
                        <li>- <Prop>putForm</Prop></li>
                        <li>- <Prop>patchForm</Prop></li>
                    </ul>
                </div>

                <Preview
                    code="
          <script setup>
            import {useAjax} from '@/Composables/useAjax.js';

            const { get } = useAjax();

            const fetchData = () => {
              get('/api/order', {
                params: {
                  ID: 1,
                }
              }).then(({ data }) => {
                console.log(data);
              }).catch(({error}) => {
                console.log(error);
              })
            }
          </script>
        "
                >
                    <template #header> get </template>
                </Preview>

                <Preview
                    code="
          <script setup>
            import {useAjax} from '@/Composables/useAjax.js';

            const { postForm } = useAjax();

            const fetchData = () => {
              postForm('/api/order', {
                  ID: 1,
              }).then(({ data }) => {
                console.log(data);
              }).catch(({error}) => {
                console.log(error);
              })
            }
          </script>
        "
                >
                    <template #header> postForm </template>
                </Preview>
            </Example>

            <Example title="Waiting Alert">
                <p>Možnost zapnou waitning alert, který se zobrazí při spuśtění ajaxového requestu a pak následně lze změnit na některý z klasických stavů.</p>
                <p>waiting alert se dává do ptions parametru funkcí useAjax</p>

                <Preview
                    code="
          <script setup>
            import { useAjax } from '@/Composables/useAjax.js';
            import { useTranslations } from '@/Composables/useTranslation.js';

            const { _l } = useTranslations();
            const { postForm } = useAjax();

            const fetchData = () => {
              postForm('/api/order', {
                  ID: 1,
              }, null, {
                waitingAlert: {
                  title: _l('Ukládám data'),
                }
              }).then(({ data, alert }) => {
                alert.changeToSuccess(_l('Hotovo'));
                console.log(data);
              }).catch(({ error, alert }) => {
                alert.changeToError(_l('Chyba'), error.msg);
                console.log(error);
              })
            }
          </script>
        "
                >
                    <template #header> waiting alert pro postForm </template>
                </Preview>
            </Example>

            <Example title="Download file">
                <p>Stáhne soubor a ve waitingAlertu zobrazí progres bar</p>

                <Preview
                    code="
          <script setup>
            import { useAjax } from '@/Composables/useAjax.js';

            const { postForm } = useAjax();

            downloadFile(
                '/common/file/download',
                {
                    params: {
                        ID: 10245,
                    }
                },
                {
                    waitingAlert: {
                        title: 'Stahuji soubor',
                        message: 'Prosím čekejte.',
                    },
                    filename: 'report-zakaznici.csv',
                },
            ).then(({alert}) => {
                alert.changeToSuccess('Staženo');
            }).catch(({alert, error}) => {
                alert.changeToError('Error', error.msg);
            });
          </script>
        "
                >
                    <template #header> waiting alert pro postForm </template>
                </Preview>
            </Example>
        </template>
    </DocPage>
</template>
