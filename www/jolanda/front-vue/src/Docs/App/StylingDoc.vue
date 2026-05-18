<script setup>
import DocPage from '@/Docs/DocPage.vue';
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";

</script>

<template>
  <DocPage>
    <template #title>
      Styling
    </template>

    <template #content>
      <p>
        Pro css se používá tailwind.
      </p>

      <Example title="Responzivita">
        <p>
          Klasicky se používá tailwind responzivita rozšířená o vlastní třídy row a col
        </p>

        <p>
          row i col jsou dynamické třídy. Můžeme psát row-* (defaultní 12), col-*
        </p>

        <Preview code="
          <template>
            <div class=&quot;row&quot;>
              <div class=&quot;col-12 md:col-6&quot;></div>
            </div>
          </template>
        ">
          <template #header>
            Defaultní row (12)
          </template>
        </Preview>

        <Preview code="
          <template>
            <div class=&quot;row-2&quot;>
              <div class=&quot;col-2 md:col-1&quot;></div>
            </div>
          </template>
        ">
          <template #header>
            row-2
          </template>
        </Preview>
      </Example>

      <Example title="Section">
        <p>Třída <Prop>section</Prop> je nastylovaná s ohraničením pro určitý blok stránky. Například grid atd.  </p>

        <Preview code="
          <template>
            <div class=&quot;row&quot;>
              <div class=&quot;col-12 md:col-6&quot;>
                <AdminProductGrid class=&quot;section&quot; />
              </div>
              <div class=&quot;col-12 md:col-6&quot;>
                <UserGrid class=&quot;section&quot; />
              </div>
            </div>
          </template>
        ">
        </Preview>
      </Example>

      <Example title="Rozšíření, přepis">
        <p>V assets/index.css můžeme přidávat vlastní globální styly, nebo přepisovat barvy</p>

        <Preview code="
          @import &quot;tailwindcss&quot; source(none);

          @source &quot;../&quot;;
          @source &quot;../../../www/jolanda/front-vue/src&quot;;

          @import &quot;../../../www/jolanda/front-vue/src/assets/index.css&quot;

          :root{
            --color-primary: var(--color-red);
            /*...*/
          }
        ">
        </Preview>
      </Example>
    </template>
  </DocPage>
</template>
