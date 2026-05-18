<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage>
        <template #title> Layout </template>

        <template #content>
            <p>Aplikace obsahuje defaultní layout, který je možný rozšířit nebo si nastavit svůj vlastní.</p>

            <Example title="Rozšíření layoutu">
                <p>Layout obsahuje sloty <Prop>headRight</Prop> <Prop>userImg</Prop> <Prop>userPanel</Prop> <Prop>menuAfterItems</Prop> <Prop>menuBeforeItems</Prop></p>

                <p>Pro rozšíření layoutu si vytvoříme vlastní kompoenentu, kde přes sloty rošíříme defaultní layout</p>

                <Preview
                    code="
          <script setup>
            import Layout from '@/App/Layout/Layout.vue';
          </script>

          <template>
            <Layout>
               <template #userImg>
                  ...
               </template>
               <template #headRight>
                  ...
               </template>
            </Layout>
          </template>
        "
                >
                    <template #header> Ukázka rozšíření layoutu. Vlastní Layout komponenta ve složce /layouts/Layout.vue </template>
                </Preview>

                <p>Následné musíme v main.js nastavit že se má použít tento layout pro aplikaci</p>

                <Preview
                    code="
          import Layout from './layouts/Layout.vue';

          const jolandaApp = App.createInstance();
          if (jolandaApp) {
              jolandaApp.layout.setComponent(Layout); //nastavíme layout před mountem aplikace
              jolandaApp.router.initRoutes();
              jolandaApp.mountApp();
          }
        "
                >
                    <template #header> main.js </template>
                </Preview>
            </Example>

            <Example title="Menu">
                Menu má vlastní object v app.layout.menu, přes který můžeme přistupovat do menu a programově ho upravovat.

                <Preview
                    code="
          const { app } = useApp;

          app.layout.menu.addItem(id, name, url, icon);
        "
                >
                    <template #header> Příklad vložení vlastní položky do menu </template>
                </Preview>
            </Example>
        </template>
    </DocPage>
</template>
