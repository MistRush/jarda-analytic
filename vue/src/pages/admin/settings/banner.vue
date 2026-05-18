<script setup>
import BannerGrid from "@project/components/grids/settings/BannerGrid.vue";
import Gallery from "@/Components/Gallery/Gallery.vue";
import GalleryItem from "@/Components/Gallery/GalleryItem.vue";
import { ref } from "vue";

const banerFileName = ref(null)

const onRowSelect = async (row) => {
  banerFileName.value = row.data().FileName;
};
</script>

<template>
    <div class="row">
      <div class="col-9">
        <BannerGrid class="section" @onRowSelect="onRowSelect" />
      </div>
      <div class="col-3">
        <div v-if="banerFileName" class="section">
          Náhled banneru
          <Gallery>
            <GalleryItem :href="'/files/images/banner/' + banerFileName" width="auto" height="auto">
              <img :src="'/files/images/banner/' + banerFileName" alt="Náhled" />
            </GalleryItem>
          </Gallery>
        </div>
      </div>
    </div>
</template>