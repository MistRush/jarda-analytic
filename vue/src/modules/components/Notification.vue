<script setup>
import { ref } from 'vue';

const notifications = ref([]);

const showNotification = (message, type = 'success') => {
  const id = Date.now();
  notifications.value.push({ id, message, type });

  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 5000);
};

defineExpose({
  showNotification
});
</script>

<template>
  <div class="notifications">
    <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<style scoped>
.notifications {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
  font-weight: 500;
}

.notification.success {
  background-color: #9CFFBD;
  color: #013B53;
  border-left: 4px solid #10b981;
}

.notification.error {
  background-color: #fee2e2;
  color: #991b1b;
  border-left: 4px solid #dc2626;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>