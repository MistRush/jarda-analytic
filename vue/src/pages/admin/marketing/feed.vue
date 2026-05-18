<script setup>
import { onMounted } from 'vue'
import { usePage } from '@/App/composables/usePage';

const { pageData, query } = usePage();

onMounted(() => {
  console.log('asdf');
  console.log(pageData.value.data.eshops)
})
</script>

<template>
  <h1>Feedy</h1>
  <div class="section mb-5 pb-5">
    <h2>Google Merchant</h2>
    <a href="/common/cron/google-merchant" target="_blank">Přegenerovat feedy</a><br><br>
    <a v-for="eshop in pageData.data.eshops" :key="eshop.ID" :href="eshop.URL + '/files/feeds/google-merchant-' + eshop.language.Code + '.xml'" target="_blank">Google Merchant {{ eshop.Name }}</a><br>
  </div>

  <div class="section mb-5 pb-5">
    <h2>Heureka</h2>
    <a href="/common/cron/heureka-feed" target="_blank">Přegenerovat feedy</a><br><br>
    <a v-for="eshop in pageData.data.eshops" :key="eshop.ID" :href="eshop.URL + '/files/feeds/heureka-feed-' + eshop.language.Code + '.xml'" target="_blank">Heureka {{ eshop.Name }}</a><br>
  </div>

  <div class="section mb-5 pb-5">
    <h2>Zboží</h2>
    <a href="/common/cron/zbozi-feed" target="_blank">Přegenerovat feedy</a><br><br>
    <a v-for="eshop in pageData.data.eshops" :key="eshop.ID" :href="eshop.URL + '/files/feeds/zbozi-feed-' + eshop.language.Code + '.xml'" target="_blank">Zboží {{ eshop.Name }}</a><br>
  </div>
</template>