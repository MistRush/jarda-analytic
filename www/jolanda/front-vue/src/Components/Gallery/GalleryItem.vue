<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
    href: {
        type: String,
        required: true,
    },
});

const width = ref(null);
const height = ref(null);
const imgEl = ref(null);

const loadImageSize = () => {
    const img = new Image();
    img.src = props.href;
    img.onload = () => {
        width.value = img.naturalWidth;
        height.value = img.naturalHeight;
    };
};

onMounted(loadImageSize);
watch(() => props.href, loadImageSize); // kdyby se změnil obrázek
</script>

<template>
    <a :href="props.href" target="_blank" class="gallery-item h-full" :data-pswp-width="width" :data-pswp-height="height">
        <slot />
    </a>
</template>
