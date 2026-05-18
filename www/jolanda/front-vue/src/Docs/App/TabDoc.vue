<script setup>
import DocPage from '@/Docs/DocPage.vue';
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";

</script>

<template>
  <DocPage>
    <template #title>
      Tab
    </template>

    <template #content>
      <p>
        Taby jsou uložené v globálním storu pomocí <Prop>useTabStore</Prop>. Pro práci s aktuálním tabek existuje composable funkce <Prop>useTab</Prop>
      </p>

      <Example title="useTab">
        <p>
          Composable funkce která slouží pro manipulaci s tabem, ve kterém je komponenta která useTab volá, podobně jako usePage
        </p>

        <div class="mt-2">
          <b>Funkce obsahuje:</b>
          <ul class="pl-4">
            <li>- <Prop>tab</Prop>: state tabu</li>
            <li>- <Prop>close</Prop>: zavře aktuální tab</li>
            <li>- <Prop>setIcon</Prop>: nastaví ikony tabu</li>
            <li>- <Prop>setDescription</Prop>: nastaví popis tabu pod titulkem</li>
            <li>- <Prop>setTitle</Prop>: nastaví titulek tabu</li>
          </ul>
        </div>

        <div class="mt-2">
          <b>Tab state:</b>
          <ul class="pl-4">
            <li>- <Prop>fromGridId</Prop>: z jákeho gridu byl tab otevřen</li>
            <li>- <Prop>description</Prop>: popis tabu pod titulkem</li>
            <li>- <Prop>id</Prop>: id tabu</li>
            <li>- <Prop>title</Prop>: titulek tabu</li>
            <li>- <Prop>route</Prop>: object routy tabu</li>
            <li>- <Prop>icon</Prop>: ikona tabu (stejně jako komponenta Icon)</li>
            <li>- <Prop>icon</Prop>: ikona tabu (stejně jako u komponenty Icon)</li>
            <li>- <Prop>instanceId</Prop>: jedinečné id instance tabu</li>
            <li>- <Prop>sourceTabInstanceId</Prop>: z jakého tabu byl tento tab otevřen</li>
            <li>- <Prop>page</Prop>: state stránky používaný v <Prop>usePage</Prop> funkci</li>
          </ul>
        </div>

        <Preview code="
          <script setup>
            import {useTab} from '@/App/composables/useTab';

            const {setIcon} = useTab();
            setIcon('close');
          </script>
        ">
          <template #header>
            Ukázka změny ikony tabu
          </template>
        </Preview>
      </Example>
    </template>
  </DocPage>
</template>