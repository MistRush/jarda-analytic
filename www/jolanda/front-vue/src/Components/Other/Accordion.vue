<script setup>
import {ref, onMounted} from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  tagNumber: {
    type: Number,
    default: null,
  },
  tagColor: {
    type: String,
    default: '#0575E5',
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref(false);

onMounted(() => {
  isOpen.value = props.defaultOpen;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="accordion">
    <div class="header" @click="toggle">
      <slot name="BeforeTitle"/>
      <h3>{{ title }}</h3>
      <span v-if="tagNumber !== null" class="tag" :style="{ backgroundColor: tagColor }">
        {{ tagNumber }}
      </span>
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" class="icon"
             :class="{ open: isOpen }"
        >
          <circle cx="11" cy="11" r="11" fill="#DCE0E8"/>
          <path d="M7 10L11 14L15 10" stroke="#1B1C29" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <transition name="slide">
      <div v-if="isOpen" class="content">
        <slot/>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.accordion {
  margin-bottom: 15px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    gap: 5px;
    border-bottom: 1px solid #D6DCF6;
    padding-bottom: 5px;
    padding-top: 5px;
    margin-bottom: 5px;

    h3 {
      margin: 0;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
    }

    .tag {
      display: inline-flex;
      padding: 1px 7px;
      min-width: 20px;
      border-radius: 12px;
      color: white;
      justify-content: center;
      font-size: 12px;
      align-items: center;
    }

    .icon-wrapper {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: end;

      .icon {
        transition: transform 0.3s ease;
        margin-left: 10px;
      }
    }

    .icon.open {
      transform: rotate(180deg);
    }
  }

  .content {
    overflow: hidden;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  padding: 0;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 200px; /* Adjust as needed or use max-content if dynamic height is desired */
  overflow: hidden;
}
</style>
