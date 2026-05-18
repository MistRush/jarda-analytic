<script setup>
import { inject, onMounted, useId } from "vue";
const props = defineProps({
  title: {
    type: String,
    required: true,
  }
})

const registerExample = inject("registerExample", null);
const id = useId();

onMounted(() => {
  if(registerExample){
    registerExample(id, props.title)
  }
})
</script>

<template>
  <div :id="id">
    <h2 class="relative text-xl text-highlighted font-bold mt-8 mb-3 scroll-mt-[calc(32px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(32px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-lg/6 [&>a>code]:font-bold [&>a>code]:transition-colors">{{props.title}}</h2>
    <slot />
  </div>
</template>