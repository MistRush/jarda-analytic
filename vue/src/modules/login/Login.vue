<template>
  <div class="login-holder">
    <div class="google-holder">
      <a class="google-login">
        <img src="https://denikpleti.evidsoft.cz/img/front/google.svg" alt="Google">
        Pokračovat přes Google
      </a>
    </div>
    <div class="separator">
      Nebo se přihlaste
    </div>

    <form id="main-form">
      <div class="customer-row align-items-center">
        <input
            id="Name"
            type="text"
            name="Name"
            placeholder="Email"
            autocomplete="email"
            v-model="formData.name"
            :class="{ 'failed': nameError }"

        >
        <div class="field-error">{{ nameErrorMessage }}</div>
      </div>

      <div class="customer-row align-items-center">
        <input
            id="Password"
            type="password"
            placeholder="Heslo"
            name="Password"
            autocomplete="current-password"
            v-model="formData.password"
            :class="{ 'failed': passwordError }"
        >
        <div class="field-error">{{ passwordErrorMessage }}</div>
      </div>

      <div v-if="errorMessage" class="error-box mt-2">{{ errorMessage }}</div>

      <div class="text-right">
        <a href="/customer/lost-password/" class="link-next-to-button">Zapomněli jste heslo?</a>
      </div>

      <div class="mt-3">
        <button
            class="btn-green"
            type="button"
            :disabled="isSubmitting"
            @click.prevent.stop="handleLogin"
        >
          {{ isSubmitting ? 'Přihlašuji...' : 'Přihlásit se' }}
        </button>
      </div>
    </form>

    <div class="no-account">
      Nemáte účet? <a href="/customer/register">Zaregistrovat se</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const formData = ref({
  name: '',
  password: ''
});

const nameErrorMessage = ref('');
const passwordErrorMessage = ref('');

const nameError = ref(false);
const passwordError = ref(false);
const showPasswordError = ref(false);
const errorMessage = ref('');
const isSubmitting = ref(false);

const handleLogin = async () => {
  console.log('handleLogin called');

  nameError.value = false;
  passwordError.value = false;
  nameErrorMessage.value = '';
  passwordErrorMessage.value = '';
  errorMessage.value = '';

  let hasErrors = false;

  if (!formData.value.name) {
    console.log('Name validation failed');
    nameError.value = true;
    nameErrorMessage.value = 'Vyplňte email.';
    hasErrors = true;
  }

  if (!formData.value.password) {
    console.log('Password validation failed');
    passwordError.value = true;
    passwordErrorMessage.value = 'Zadejte heslo.';
    hasErrors = true;
  }

  if (hasErrors) {
    console.log('Form validation failed, stopping here');
    return;
  }

  console.log('Starting login request');
  isSubmitting.value = true;

  try {
    const response = await axios.post('/customer/process-login', {
      name: formData.value.name,
      password: formData.value.password
    });

    console.log('Login response:', response);

    if (response.data.status === 'success') {
      console.log('Login successful - redirecting');
      window.location.href = response.data.redirect || '/';
    } else {
      console.log('Login failed:', response.data.message);
      errorMessage.value = response.data.message;
    }

  } catch (error) {
    console.error('Login error:', error);

    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Došlo k chybě při přihlašování. Zkuste to prosím znovu.';
    }
  } finally {
    console.log('Login request finished');
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.error {
  border-color: #dc3545 !important;
}

.password-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}

.field-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  height: 1rem;
  padding-left: 5px;
}

input {
  margin-bottom: 0 !important;
}

.error-box {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 15px;
}

.btn-green {
  justify-content: center;
}

.btn-green:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>