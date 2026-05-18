<script setup>
import { inject } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
})

const activeLink = inject('activeLink', null);
const active = inject('active', false);

const handleClick = () => {
  if(activeLink){
    activeLink(props.link);
  }
}

</script>

<template>
  <div
    class="link text-light hover:text-primary mt-2 mb-2 cursor-pointer"
    :class="{
      'text-primary': active === link,
    }"
    @click="handleClick"
  >{{props.title}}</div>
</template>