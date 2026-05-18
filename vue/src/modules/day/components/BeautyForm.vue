<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useBeautyAPI } from './../../composables/useBeautyAPI.js';
import Notification from './../../components/Notification.vue';

const props = defineProps({
  selectedDay: {
    type: [Number, String],
    required: true
  },
  recommendation: {
    type: Object,
    default: () => ({})
  }
});

const { searchBeauty: searchBeautyAPI } = useBeautyAPI();
const notificationRef = ref(null);

const emit = defineEmits(['save-data']);

const formData = ref({
  cosmetics: [''],
});

const suggestions = ref({
  cosmetics: [],
});

const showSuggestions = ref({
  cosmetics: [],
});

const searchBeauty = async (fieldName, index, query) => {
  if (query.length < 3) {
    showSuggestions.value[fieldName][index] = false;
    return;
  }

  const results = await searchBeautyAPI(query);

  if (results.length > 0) {
    suggestions.value[fieldName] = results;
    showSuggestions.value[fieldName][index] = true;
  } else {
    showSuggestions.value[fieldName][index] = false;
  }
};

const selectBeauty = (fieldName, index, productName) => {
  formData.value[fieldName][index] = productName;
  showSuggestions.value[fieldName][index] = false;
};

const addField = (fieldName) => {
  formData.value[fieldName].push('');
  if (!showSuggestions.value[fieldName]) {
    showSuggestions.value[fieldName] = [];
  }
  showSuggestions.value[fieldName].push(false);
};

const removeField = (fieldName, index) => {
  if (formData.value[fieldName].length > 1) {
    formData.value[fieldName].splice(index, 1);
  }
};

watch(() => props.selectedDay, (newDayId) => {
  console.log('Day ID changed to:', newDayId);
  loadBeautyData(newDayId);
});

onMounted(() => {
  if (props.selectedDay) {
    loadBeautyData(props.selectedDay);
  }
});

const loadBeautyData = async (dayId) => {
  try {
    console.log(`Loading beauty data for day ${dayId}`);

    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;
    console.log(`Loading beauty data for day ${numericDayId}`);

    if (!numericDayId) {
      console.log('No day ID provided, using empty form');
      formData.value = {
        cosmetics: [''],
      };
      return;
    }

    const response = await axios.get(`/cosmetics/get-cosmetics/${dayId}`);

    if (response.data.status === 'success' && response.data.data) {
      if (response.data.data.cosmetics && response.data.data.cosmetics.length > 0) {
        formData.value.cosmetics = response.data.data.cosmetics;
      } else {
        formData.value.cosmetics = [''];
      }
      console.log('Beauty data loaded:', formData.value);
    } else {
      formData.value = {
        cosmetics: [''],
      };
    }
  } catch (error) {
    console.error('Error loading beauty data:', error);
    formData.value = {
      cosmetics: [''],
    };
  }
};

const handleSubmit = async (event) => {
  if (event) {
    event.preventDefault();
  }

  try {
    const response = await axios.post('/cosmetics/save-cosmetics', {
      day: props.selectedDay,
      data: formData.value
    });

    if (response.data.status === 'success') {
      notificationRef.value.showNotification(response.data.message, 'success');

      emit('save-data', {
        type: 'cosmetics',
        day: props.selectedDay,
        data: formData.value
      });
    } else {
      alert('Chyba: ' + response.data.message);
    }
  } catch (error) {

    if (error.response && error.response.data && error.response.data.message) {
      notificationRef.value.showNotification(error.response.data.message, 'error');
    } else {
      notificationRef.value.showNotification('Došlo k chybě při ukládání kosmetiky. Zkuste to prosím znovu.', 'error');
    }
  }
};

const validateField = (field) => {
  console.log(`Validating field: ${field}`);
};

const hideSuggestions = (fieldName, index) => {
  setTimeout(() => {
    showSuggestions.value[fieldName][index] = false;
  }, 200);
};
</script>

<template>
  <Notification ref="notificationRef" />
  <div>
    <h2 class="with-image cosmetics">Kosmetika</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <label for="cosmetics">Použitá kosmetika</label>
        <div
            v-for="(item, index) in formData.cosmetics"
            :key="`cosmetics-${index}`"
            class="input-group"
        >
          <div class="autocomplete-wrapper">
            <input
                type="text"
                :id="`cosmetics-${index}`"
                placeholder="Zadejte kosmetický produkt"
                v-model="formData.cosmetics[index]"
                @input="searchBeauty('cosmetics', index, formData.cosmetics[index])"
                @blur="hideSuggestions('cosmetics', index)"
            />
            <ul v-if="showSuggestions.cosmetics[index]" class="suggestions">
              <li
                  v-for="(suggestion, i) in suggestions.cosmetics"
                  :key="i"
                  @click="selectBeauty('cosmetics', index, suggestion.name)"
              >
                {{ suggestion.name }}
                <span v-if="suggestion.brand" class="brand">{{ suggestion.brand }}</span>
              </li>
            </ul>
          </div>
          <button
              v-if="formData.cosmetics.length > 1"
              type="button"
              class="remove-btn"
              @click="removeField('cosmetics', index)"
          >
            ×
          </button>
        </div>
        <div class="add-new" @click="addField('cosmetics')">
          Přidat záznam <img src="http://denikpleti.localhost/img/front/icons/add.svg">
        </div>
      </div>

      <div class="recomendation">
        <div class="headline">
          <img src="http://denikpleti.localhost/img/front/icons/light.svg">
          Doporučení
        </div>
        <div class="text">
          {{ recommendation.Description }}
        </div>
      </div>

      <div class="form-row">
        <button type="submit" class="btn-submit">
          Uložit
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.btn-submit {
  background-color: #9CFFBD;
  color: #013B53;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}

.btn-submit:hover {
  background-color: #74f89f;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  position: relative;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  margin-left: 10px;
  cursor: pointer;
  position: absolute;
  right: 10px;
}

h2 {
  &.with-image {
    padding-left: 20px;
    &.cosmetics {
      &:before {
        content: url(/img/front/cosmetics-icon.svg);
        position: absolute;
        top: 0px;
        left: 0px;
      }
    }
  }
}

.add-new {
  cursor: pointer;
  color: #0E1B36;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: Urbanist;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  line-height: 18px;
}

.add-new:hover {
  text-decoration: underline;
}

.autocomplete-wrapper {
  position: relative;
  flex: 1;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 0 0 4px 4px;
}

.suggestions li {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}

.brand {
  font-size: 0.9em;
  color: #666;
  margin-left: 5px;
}
</style>