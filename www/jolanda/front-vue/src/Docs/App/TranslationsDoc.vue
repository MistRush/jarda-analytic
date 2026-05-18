<script setup>
import DocPage from '@/Docs/DocPage.vue';
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";

</script>

<template>
  <DocPage>
    <template #title>
      Translations
    </template>

    <template #content>
      <p>
        Překlady fungují stejně jako ve staré Jolandě. Ve .vue a .js souborech se používá funkce <Prop>_l</Prop>. Překlady se automaticky parsují do .po stejně jako z Latte šablon.
      </p>

      <Example title="_l">
        <p>
          Funkce <Prop>_l</Prop> překládá texty do zvoleného jazyka. Při použítí čistě v template není potřeba importovat.
        </p>

        <Preview code="
          <template>
            {{ _l('Text pro překlad') }}
          </template>
        ">
          <template #header>
            Ukázka _l v template
          </template>
        </Preview>
      </Example>

      <Example title="useTranslation">
        <p>
          Composable funkce pro překlady a práci s jazyky.
        </p>

        <div class="mt-2">
          <b>Funkce obsahuje:</b>
          <ul class="pl-4">
            <li>- <Prop>translations</Prop>: core Jolanda překlady</li>
            <li>- <Prop>translate</Prop>: alias pro _l funkci</li>
            <li>- <Prop>_l</Prop>: přeloží text do aktuálního jazyka</li>
            <li>- <Prop>locale</Prop>: aktuální jazyk</li>
            <li>- <Prop>activeLanguages</Prop>: seznam aktivních jazyků</li>
          </ul>
        </div>

        <p>
          Pokud se používá _l ve script, už se importovat musí.
        </p>

        <Preview code="
          <script setup>
            import { useTranslations } from '@/Composables/useTranslation.js';

            const { _l } = useTranslations();

            alert(_l('Text k překladu'));
          </script>
        ">
          <template #header>
            Ukázka _l v template
          </template>
        </Preview>
      </Example>
    </template>
  </DocPage>
</template>
