<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const formData = ref({
  email: '',
  password: '',
  passwordAgain: '',
  terms: false,
  gdpr: false,
  newsletter: false
});

const emailError = ref('');
const passwordError = ref('');
const passwordAgainError = ref('');
const termsError = ref('');
const gdprError = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isSubmitting = ref(false);

let recaptchaLoaded = ref(false);

const validateEmail = async () => {
  emailError.value = '';

  if (!formData.value.email) {
    emailError.value = 'Vyplňte e-mail.';
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    emailError.value = 'Vyplňte e-mail ve správném formátu.';
    return false;
  }

  try {
    const response = await axios.post('/customer/check-register-email', {
      email: formData.value.email
    });

    if (response.data.exists) {
      emailError.value = 'Tento uživatel je již registrován.';
      return false;
    }
  } catch (error) {
    console.error('Error checking email:', error);
  }

  return true;
};

const validatePassword = () => {
  passwordError.value = '';

  if (!formData.value.password) {
    passwordError.value = 'Zadejte heslo.';
    return false;
  }

  if (formData.value.password.length < 5) {
    passwordError.value = 'Heslo musí obsahovat alespoň 5 znaků.';
    return false;
  }

  if (formData.value.passwordAgain) {
    validatePasswordAgain();
  }

  return true;
};

const validatePasswordAgain = () => {
  passwordAgainError.value = '';

  if (!formData.value.passwordAgain) {
    passwordAgainError.value = 'Zopakujte heslo.';
    return false;
  }

  if (formData.value.password !== formData.value.passwordAgain) {
    passwordAgainError.value = 'Zadaná hesla se neshodují.';
    return false;
  }

  return true;
};

const validateTerms = () => {
  console.log('validateTerms called, formData.terms:', formData.value.terms);
  termsError.value = '';

  if (!formData.value.terms) {
    termsError.value = 'Musíte souhlasit s obchodními podmínkami.';
    console.log('Terms error set:', termsError.value);
    return false;
  }

  console.log('Terms validation passed');
  return true;
};

const validateGdpr = () => {
  console.log('validateGdpr called, formData.gdpr:', formData.value.gdpr);
  gdprError.value = '';

  if (!formData.value.gdpr) {
    gdprError.value = 'Musíte souhlasit se zpracováním osobních údajů.';
    console.log('GDPR error set:', gdprError.value);
    return false;
  }

  console.log('GDPR validation passed');
  return true;
};

const loadRecaptcha = () => {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6Ld4ogArAAAAAN-5fVn8mxHa848vSIN4pqJ41BYy';
    script.onload = () => {
      window.grecaptcha.ready(() => {
        recaptchaLoaded.value = true;
        resolve();
      });
    };
    document.head.appendChild(script);
  });
};

const getRecaptchaToken = () => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha || !recaptchaLoaded.value) {
      reject('reCAPTCHA not loaded');
      return;
    }

    window.grecaptcha.execute('6Ld4ogArAAAAAN-5fVn8mxHa848vSIN4pqJ41BYy', { action: 'registration' })
        .then((token) => {
          resolve(token);
        })
        .catch(reject);
  });
};

const handleRegistration = async (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  console.log('handleRegistration called');
  errorMessage.value = '';
  successMessage.value = '';

  emailError.value = '';
  passwordError.value = '';
  passwordAgainError.value = '';
  termsError.value = '';
  gdprError.value = '';

  const emailValid = await validateEmail();
  const passwordValid = validatePassword();
  const passwordAgainValid = validatePasswordAgain();
  const termsValid = validateTerms();
  const gdprValid = validateGdpr();

  console.log('Validation results:', {
    emailValid,
    passwordValid,
    passwordAgainValid,
    termsValid,
    gdprValid
  });

  if (!emailValid || !passwordValid || !passwordAgainValid || !termsValid || !gdprValid) {
    console.log('Form validation failed, stopping here');
    return;
  }

  isSubmitting.value = true;

  try {
    //const recaptchaToken = await getRecaptchaToken();

    const response = await axios.post('/customer/register-user', {
      email: formData.value.email,
      password: formData.value.password,
      passwordAgain: formData.value.passwordAgain,
      terms: formData.value.terms,
      gdpr: formData.value.gdpr,
      newsletter: formData.value.newsletter,
      //recaptchaToken: recaptchaToken
    });

    if (response.data.status === 'success') {
      successMessage.value = response.data.message || 'Registrace byla úspěšně dokončena.';
      console.log('Registration successful:', response.data);

      // Reset form
      formData.value = {
        email: '',
        password: '',
        passwordAgain: '',
        terms: false,
        gdpr: false,
        newsletter: false
      };

      setTimeout(() => {
        window.location.href = response.data.redirect || '/customer/login';
      }, 2000);

    } else {
      errorMessage.value = response.data.message || 'Registraci se nepodařilo dokončit.';
    }

  } catch (error) {
    console.error('Registration error:', error);

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Došlo k chybě při registraci. Zkuste to prosím znovu.';
    }
  } finally {
    isSubmitting.value = false;
  }
};


onMounted(() => {
  //loadRecaptcha();
});
</script>
<template>
  <div class="container">
    <div class="register-holder">
      <form id="main-form">
        <div class="form-block">
          <div v-if="errorMessage" class="error" style="display: block">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="success" style="display: block">
            {{ successMessage }}
          </div>

          <div class="row">
            <div class="col-lg-12 no-padding">
              <input
                  id="Email"
                  type="email"
                  placeholder="Email"
                  name="Email"
                  v-model="formData.email"
                  :class="{ 'failed': emailError }"
                  @blur="validateEmail"
              />
              <div class="field-error">{{ emailError }}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 no-padding">
              <input
                  id="Password"
                  type="password"
                  placeholder="Heslo"
                  name="Password"
                  v-model="formData.password"
                  :class="{ 'failed': passwordError }"
                  @blur="validatePassword"
              />
              <div class="field-error">{{ passwordError }}</div>
            </div>
            <div class="col-lg-12 no-padding">
              <input
                  id="PasswordAgain"
                  type="password"
                  placeholder="Heslo znova"
                  name="PasswordAgain"
                  v-model="formData.passwordAgain"
                  :class="{ 'failed': passwordAgainError }"
                  @blur="validatePasswordAgain"
              />
              <div class="field-error">{{ passwordAgainError }}</div>
            </div>
          </div>
        </div>
        <hr>
        <div class="terms-holder mt-0">
          <label class="with-checkbox mb-1">
            <input
                type="checkbox"
                name="terms"
                id="terms"
                v-model="formData.terms"
                :class="{ 'failed-terms': termsError }"
            />
            <span class="checkmark"></span>
            Souhlasím s
            <a href="/page/vseobecne-obchodni-podminky" target="_blank">
              obchodními podmínkami
            </a>.
          </label>
          <div class="terms-error">{{ termsError }}</div>
        </div>
        <div class="gdpr-holder mt-1">
          <label class="with-checkbox mb-1">
            <input
                type="checkbox"
                name="gdpr"
                id="gdpr"
                v-model="formData.gdpr"
                :class="{ 'failed-terms': gdprError }"
            />
            <span class="checkmark"></span>
            Souhlasím se zpracováním svých osobních údajů uvedených výše pro účely zřízení a správy uživatelského účtu a seznámil/a jsem se s
            <a href="/page/ochrana-osobnich-udaju" target="_blank">
              podmínkami zpracování osobních údajů
            </a>.
          </label>
          <div class="terms-error">{{ gdprError }}</div>
        </div>
        <div class="emailing-holder mt-1">
          <label class="with-checkbox">
            <input
                type="checkbox"
                name="newsletter"
                id="newsletter"
                v-model="formData.newsletter"
            />
            <span class="checkmark"></span>
            Souhlasím se zasíláním obchodních sdělení (typu newsletter) na můj e-mail.
          </label>
        </div>
        <div class="text-end">
          <button
              class="g-recaptcha btn-green"
              type="button"
              :disabled="isSubmitting"
              @click.prevent.stop="handleRegistration"
          >
            {{ isSubmitting ? 'Odesílám...' : 'Registrovat' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.field-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  height: 1rem;
  padding-left: 5px;
}

input {
  margin-bottom: 0 !important;
  width: 100%;
}

.terms-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0px;
  margin-bottom: 5px;
  height: 1rem;
  padding-left: 0px;
}

.success {
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin: 0 -15px 15px -15px;

}

input.error {
  border-color: #dc3545 !important;
}

input[type="checkbox"].error {
  border-color: #dc3545 !important;
}

.btn-green {
  display: flex !important;
  justify-content: center;
}
</style>