<script setup>
import GalleryItem from "@/Components/Gallery/GalleryItem.vue";
import Gallery from "@/Components/Gallery/Gallery.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage import="@/Components/Gallery/GalleryItem.vue">
        <template #title> GalleryItem </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>GalleryItem</code> je zjednodušený wrapper pro odkazy použité v <code>Gallery</code>. Automaticky nastavuje atributy <code>data-pswp-width</code> a <code>data-pswp-height</code>.</p>

                <Preview
                    code='
          <template>
            <Gallery>
              <GalleryItem href="/images/img1.jpg" width="1200" height="800">
                <img src="/images/thumb1.jpg" alt="Náhled" />
              </GalleryItem>
            </Gallery>
          </template>
        '
                >
                    <Gallery>
                        <GalleryItem href="/images/img1.jpg" width="1200" height="800">
                            <img :src="'/images/thumb1.jpg'" alt="Náhled" style="max-width: 150px" />
                        </GalleryItem>
                    </Gallery>
                </Preview>
            </Example>
            <Example title="Vlastnosti">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2">Prop</th>
                                <th class="px-4 py-2">Typ</th>
                                <th class="px-4 py-2">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>href</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Odkaz na plnou velikost obrázku. Používá se jako <code>href</code> i v galerii.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>width</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Šířka obrázku v pixelech. Slouží pro výpočet poměru stran v <code>PhotoSwipe</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>height</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Výška obrázku v pixelech. Slouží pro výpočet poměru stran v <code>PhotoSwipe</code>.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>

            <Example title="Události">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2 whitespace-nowrap">Událost</th>
                                <th class="px-4 py-2 whitespace-nowrap">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 text-muted italic" colspan="2">Tato komponenta neemitujte žádné vlastní události.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
