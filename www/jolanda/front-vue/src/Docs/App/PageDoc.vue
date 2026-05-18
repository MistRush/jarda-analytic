<script setup>
import DocPage from '@/Docs/DocPage.vue';
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";

</script>

<template>
  <DocPage>
    <template #title>
      Page
    </template>

    <template #content>
      <p>
        Stránky se dávají do složky <Prop>pages</Prop>, kde adresářová struktura odpovídá url adrese.
      </p>
      <p class="mt-2">
        Ligicky je <Prop>Page</Prop> podřízená <Prop>Tab</Prop>
      </p>

      <Example title="Vytvoření nové stránky">
        <p>
          Pro vytvoření stránky je třeba vytvořit soubor ve složce <Prop>pages</Prop>, kde se dodržuje přesná struktura dané url adresy stránky.
        </p>

        <div class="mt-4">
          <b>Postup vytvoření stránky /default/order:</b>
          <ul class="pl-4">
            <li>- Vytvořit soubor index.vue do složky pages/order/</li>
            <li>- Do controlleru Order, funkce indexAction, přidáme renderVue funkci místo renderLatte</li>
          </ul>
        </div>

        <Preview code="
          <script setup>
          </script>

          <template>
            Toto je order/index stránka
          </template>
        ">
          <template #header>
            pages/order/index.vue
          </template>
        </Preview>

        <Preview code="
          public function indexAction(){
            $this->renderVue($params, $useAcl); //Více v dokumentaci renderVue funkce
          }
        ">
          <template #header>
            OrderController.php
          </template>
        </Preview>

      </Example>


      <Example title="renderVue funkce">
        <p>
          renderVue funkce nahrazuje renderLatte funkci. Má dva parametry (params = [], useAcl = true).
        </p>
        <p class="mt-2">
          Funkce funguje tak, že pokud se v requestu vyžádá content: html, tak se vrátí základní layout stránky pro SPA apklikaci a pokud se vyžádá contentType: json, tak vrátí předané params jako json.
        </p>
        <p class="mt-2">
          Pokud chceme dále pracovat s params ve vue, použijeme <Prop>usePage</Prop> composable funkci
        </p>
      </Example>

      <Example title="usePage">
        <p>
          usePage je composable funkce, která obasuhe state pro aktuální stránku a další funkce na práci se stránkou.
        </p>

        <p class="mt-2">
          Funkce může být použítá v jakékoliv vnořené komponentě a vždy odkazuje na aktuální stránku ve které se komponenta nachází.
        </p>

        <div class="mt-2">
          <b>Funkce obsahuje:</b>
          <ul class="pl-4">
            <li>- <Prop>state</Prop>: celý state</li>
            <li>- <Prop>query</Prop>: get parametry</li>
            <li>- <Prop>pageData</Prop>: object obsahující informace o předanýhc datech z renderVue php funkce</li>
            <li class="ml-4">- <Prop>pageData.data</Prop>: params předané v renderVue php funkci</li>
            <li class="ml-4">- <Prop>pageData.status</Prop>: HTTP response status code</li>
            <li class="ml-4">- <Prop>pageData.fetched</Prop>: zda byly data úspěsné získané ze serveru</li>
            <li>- <Prop>setPageData</Prop>: možnost manuálně nastavit data stránky při úspéšném načtení</li>
            <li>- <Prop>setPageError</Prop>: možnost manuálně nastavit data stránky při neúspéšném načtení</li>
            <li>- <Prop>resetPageData</Prop>: resetuje data</li>
            <li>- <Prop>setTile</Prop>: nastavuje metatitle stránky</li>
            <li>- <Prop>getGrid</Prop>: získá grid použitý v jakékoliv komonentě na dané stránce podle id gridu [slouží pro to i samostatná funce <Prop>useGrid</Prop>]</li>
            <li>- <Prop>getAllGrids</Prop>: získá všechny gridy použité v jakékoliv komonentě na dané stránce</li>
          </ul>
        </div>

        <Preview code="
          <script setup>
            import {usePage} from '@/App/composables/usePage';

            const {pageData, query} = usePage();
          </script>

          <template>
            <MojeKomponenta :products=&quot;pageData.data.products&quot; :id=&quot;query.ID&quot; />
          </template>
        ">
          <template #header>
            Příklad použití params z renderVue funkce a get parametrů na stránce
            <br /><br />
            //Controler Action funkce
            <br />
            $this->renderVue(['products' => $products]);
          </template>
        </Preview>
      </Example>
    </template>
  </DocPage>
</template>
