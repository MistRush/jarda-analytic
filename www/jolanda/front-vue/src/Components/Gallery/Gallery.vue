<script setup>
import { useId, onMounted } from "vue";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";

const props = defineProps({
  options: Object,
});

const id = useId();

onMounted(async () => {
  const lightbox = new PhotoSwipeLightbox({
    gallery: "#" + id,
    children: "a",
    pswpModule: PhotoSwipe,
    ...props.options ?? {},
  });
  lightbox.init();
});
</script>

<template>
  <div :id="id">
    <slot />
  </div>
</template>