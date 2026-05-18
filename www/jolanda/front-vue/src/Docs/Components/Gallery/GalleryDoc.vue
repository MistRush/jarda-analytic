<script setup>
import Gallery from "@/Components/Gallery/Gallery.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import DocPage from "@/Docs/DocPage.vue";
</script>

<template>
    <DocPage import="@/Components/Gallery/Gallery.vue">
        <template #title> Gallery </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <code>Gallery</code> využívá <code>PhotoSwipe</code> pro zobrazení lightbox galerie. Uvnitř slotu očekává elementy <code>&lt;a href&gt;</code> s odkazy na obrázky.</p>

                <Preview
                    code='
          <template>
            <Gallery>
              <a href="/images/img1.jpg" data-pswp-width="1200" data-pswp-height="800">
                <img src="/images/thumb1.jpg" alt="Náhled" />
              </a>
            </Gallery>
          </template>
        '
                >
                    <Gallery>
                        <a href="/images/img1.jpg" data-pswp-width="1200" data-pswp-height="800">
                            <img :src="'/images/thumb1.jpg'" alt="Náhled" style="max-width: 150px" />
                        </a>
                    </Gallery>
                </Preview>
            </Example>

            <Example title="Předání PhotoSwipe options">
                <p>Můžete upravit chování galerie pomocí prop <code>options</code>, které se předají přímo do <code>PhotoSwipeLightbox</code> instance.</p>

                <Preview
                    code='
          <template>
            <Gallery :options="{ zoom: false }">
              <a href="/images/img1.jpg" data-pswp-width="1200" data-pswp-height="800">
                <img src="/images/thumb1.jpg" alt="Náhled" />
              </a>
            </Gallery>
          </template>
        '
                >
                    <Gallery :options="{ zoom: false }">
                        <a href="/images/img1.jpg" data-pswp-width="1200" data-pswp-height="800">
                            <img :src="'/images/thumb1.jpg'" alt="Náhled" style="max-width: 150px" />
                        </a>
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
                                <td class="px-4 py-2 font-mono"><Prop>options</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">
                                    Volitelná konfigurace předaná do <code>PhotoSwipeLightbox</code>.<br />
                                    Například: <code>{ showHideAnimationType: 'zoom' }</code>. Slouží k přizpůsobení chování galerie.
                                </td>
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
                                <td class="px-4 py-2 text-muted italic" colspan="2">Tato komponenta neemitujete žádné vlastní události.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
