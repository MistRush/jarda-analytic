<script setup>
import Importer from "@/Components/Importer/Importer.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage import="@/Components/Importer/Importer.vue">
        <template #title> Importer </template>

        <template #content>
            <Example title="Základní použití">
                <Preview
                    lang="php"
                    code='
    public function importAction(): void {
        $import = new Import("importer-id");
        $import->setImportClass(Importer::class);
        $import->enableOutput();
        $import->addColumn("Column1", "Label1");
        $import->addColumn("Column2", "Label2");
        $importer->handle();

        $this->renderVue([
            "importerProps" => $importer->getVueProps()
        ]);
    }
        '
                />

                <Preview
                    lang="javascript"
                    code='
    import { usePage } from "@/App/composables/usePage.js"
    import Importer from "@/Components/Importer/Importer.vue";

    const { pageData } = usePage();
        '
                />

                <Preview
                    lang="html"
                    code='
    <template>
        <Importer v-bind="pageData.data.importerProps" />
    </template>
        '
                />

                <Preview
                    lang="html"
                    code='
    <template>
        <Importer v-bind="pageData.data.importerProps">
            <template #form>
                <InputField label="Custom input" name="CustomInput" />
            </template>
        </Importer>
    </template>
        '
                />
            </Example>
        </template>
    </DocPage>
</template>
