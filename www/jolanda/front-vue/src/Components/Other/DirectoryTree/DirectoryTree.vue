<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  files: {
    type: Object,
    required: true
  }
});

// Rekurzivní komponenta (vnořená přímo tady, protože není potřeba ji dávat zvlášť)
const TreeNode = {
  name: 'TreeNode',
  props: {
    node: { type: Object, required: true }
  },
  template: `
    <li>
      <span>{{ node.name }}</span>
      <ul v-if="node.children && node.children.length" class="ml-4">
        <TreeNode
          v-for="child in node.children"
          :key="child.name"
          :node="child"
        />
      </ul>
    </li>
  `
};
</script>

<template>
  <div class="font-mono text-sm">
    <ul class="ml-2">
      <TreeNode :node="files" />
    </ul>
  </div>
</template>
