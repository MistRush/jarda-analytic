<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage>
        <template #title> AppRouterLink </template>

        <p>AppRouterLink je komponenta která rozšiřuje RouterLink z vue-router a měla by se používat na odkazy v jolandí aplikaci. Kontruluje jestli je url adresa v routeru a pokud né udělá klasický a href</p>

        <template #content>
            <Example title="Záklandí použití">
                <Preview
                    code='
          <template>
            <AppRouterLink to="/admin/order/list">
                Objednávky
            </AppRouterLink>
          </template>

        '
                >
                    <template #header></template>
                </Preview>

                <Preview
                    code='
          <script setup>
            //import { useRouter } from "vue-router";

            const router = useRouter();

            router.push({ name: "/admin/order/list" });
          </script>

        '
                >
                    <template #header>Pokud chceme programově přejít na jinou url využijeme klasicky vue-router</template>
                </Preview>
            </Example>
        </template>
    </DocPage>
</template>
