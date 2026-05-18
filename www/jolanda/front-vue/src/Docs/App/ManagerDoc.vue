<script setup>
import DocPage from '@/Docs/DocPage.vue';
import Prop from "@/Docs/Prop.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";

</script>

<template>
  <DocPage>
    <template #title>
      Manager
    </template>

    <template #content>
      <p>
        useManager je composable funkce která umožňuje práci s php managerama
      </p>

      <p>
        Některé komponenty jako input Select, nebo DataGrid mají prop [manager], který příjmá stejné nastavení jako useManager.
      </p>

      <Example title="useManager">
        <p>
          Funkce příjmá dva parametry. První je nastavení manageru se kterým chceme pracovat a druhý jestli se má používat schema (defaultně true). Schema je popsáno dále v této stránce
        </p>

        <p class="mt-2">
          Nastavení manageru je možné přes string, nebo object. Možnosti jsou vypsané v následujícím examplu níže.
        </p>

        <div class="mt-2">
          <b>Funkce obsahuje:</b>
          <ul class="pl-4">
            <li>- <Prop>getURLs</Prop>: seznam url adres [*/data-list, */data-update, ...] sestavené na základě předaných options</li>
            <li>- <Prop>getParams</Prop>: vrací params z předaných options</li>
            <li>- <Prop>urls</Prop>: computed proměnná, pod</li>
            <li>- <Prop>schema</Prop>: získané schema z manageru</li>
            <li>- <Prop>fetchSchema</Prop>: fetchne schema ze serveru</li>
            <li>- <Prop>applySchemaToObject</Prop>: aplikuje schema na object</li>
            <li>- <Prop>applySchemaToRecord</Prop></li>
            <li>- <Prop>applySchemaToRecords</Prop></li>
            <li>- <Prop>getData</Prop>: fetche a vrátí data-list data a případné aplikuje schema na výsledek</li>
          </ul>
        </div>

        <Preview code="
          <script setup>
            import { useManager } from '@/Composables/useManager.js';

            //nastavení manageru jako string
            const { getData } = useManager('admin/order');

            //nastavení manageru jako object s předáním params
            useManager({
              store: 'admin/order',
              params: {
                ID: 1,
              }
            });

            //nastavení manageru jako object, store jako object
            useManager({
              store: {
                module: 'admin',
                controller: 'order'
              },
              params: {
                ID: 1,
              }
            });
          </script>
        ">
          <template #header>
            Inicializace useManager
          </template>
        </Preview>
      </Example>

      <Example title="Schema">
        <p>Jestli se má získat schema ze serveru určuje druhý parametr funkce useManager, který je defaultně true </p>
        <p class="mt-2">Použití schema znamená, že se ze serveru krom dat v data-listu, vrátí i "schema", které popisuje jaké všechny child managery má získávaný manager a následné se totot schema použije pro vytvoření objectu pro každý řádek. Tedy pokud neexistují data pro nějaký cild manager, tak pomocí schema se nastaví object cild manageru na null, nebo prázdný object.</p>
        <p class="mt-2">Tohle je důležité hlavně pro například Editory a další javascriptové objecty, které neumí magicky pracovat s get a jinak dynamicky manipulovat s objectem skrze vue reaktivitu v-model atd.</p>

        <Preview code="
          <script setup>
            import { useManager } from '@/Composables/useManager.js';

            //Řekněme že má order child manager order-info, ale order s ID: 1, nemá v DB order-info
            //Takový manažer defaultně nevrátí v datech orderInfo: {}, ale orderInfo nebude vracené vůbec.
            const { getData } = useManager('admin/order', true); //defaultně true

            //Toto vrátí object doplněný o schema, tzn doplní do orderu prop orderInfo: {}
            const data = getData({ID: 1});

            //Toto nám umožní v template do inputu předat například v-model=&quot;data.orderInfo.OrderNumber&quot;
            //Bez schema by orderInfo v objectu data vůbec nebyl a v-model=&quot;data.orderInfo.OrderNumber&quot; by tak spadl na chybě,
            // že odkazujeme OrderNumber na undefined
          </script>
        ">
          <template #header>
            Příklad
          </template>
        </Preview>
      </Example>
    </template>
  </DocPage>
</template>