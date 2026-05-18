<script setup>
import { ref, watch, onMounted } from 'vue';
import { useFoodAPI } from './../../composables/useFoodAPI.js';
import axios from 'axios';
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

// Správné použití composable - stejně jako v FoodForm
const { searchFood: searchFoodAPI, searchResults, isLoading: isLoadingAPI, isLoadingOFF } = useFoodAPI();
const notificationRef = ref(null);
const activeSearch = ref({ fieldName: null, index: null });

const validationErrors = ref({
  drinks: []
});

const validateForm = () => {
  let isValid = true;
  const newErrors = {
    drinks: []
  };

  formData.value.drinks.forEach((item, index) => {
    if (item.drink && (!item.ml || item.ml <= 0)) {
      newErrors.drinks[index] = true;
      isValid = false;
    } else {
      newErrors.drinks[index] = false;
    }
  });

  validationErrors.value = newErrors;
  return isValid;
};

const emit = defineEmits(['save-data']);

const formData = ref({
  drinks: [{ drink: '', ml: 250, nutrients: null }],
});

const suggestions = ref({
  drinks: []
});

const showSuggestions = ref({
  drinks: []
});

const hideSuggestions = (fieldName, index) => {
  setTimeout(() => {
    showSuggestions.value[fieldName][index] = false;
  }, 200);
};

const searchFood = async (fieldName, index, query) => {
  console.log('🔎 Component searchFood called:', { fieldName, index, query });

  if (query.length < 3) {
    console.log('⚠️ Query too short, hiding suggestions');
    showSuggestions.value[fieldName][index] = false;
    activeSearch.value = { fieldName: null, index: null };
    return;
  }

  showSuggestions.value[fieldName][index] = true;
  suggestions.value[fieldName] = [];

  activeSearch.value = { fieldName, index };

  // Volání API funkce - výsledky se uloží do searchResults
  searchFoodAPI(query);
};

const selectFood = (fieldName, index, drinkName, nutrients) => {
  console.log('=== Selected Drink ===');
  console.log('Field:', fieldName);
  console.log('Index:', index);
  console.log('Drink name:', drinkName);
  console.log('Nutrients:', nutrients);
  console.log('==================');

  formData.value[fieldName][index].drink = drinkName;
  formData.value[fieldName][index].nutrients = nutrients;
  showSuggestions.value[fieldName][index] = false;
};

const addField = (fieldName) => {
  formData.value[fieldName].push({ drink: '', ml: 250, nutrients: null });
};

const removeField = (fieldName, index) => {
  if (formData.value[fieldName].length > 1) {
    formData.value[fieldName].splice(index, 1);
  }
};

watch(searchResults, (newResults) => {
  if (activeSearch.value.fieldName && newResults.length > 0) {
    suggestions.value[activeSearch.value.fieldName] = newResults;
    showSuggestions.value[activeSearch.value.fieldName][activeSearch.value.index] = true;
  }
}, { deep: true });

watch(() => props.selectedDay, (newDay) => {
  console.log('Day changed to:', newDay);
  loadDrinkData(newDay);
});

const loadDrinkData = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      formData.value = {
        drinks: [{ drink: '', ml: 250, nutrients: null }],
      };
      return;
    }

    const response = await axios.get(`/meal/get-drink/${numericDayId}`);

    if (response.data.status === 'success' && response.data.data) {
      formData.value = response.data.data;
    } else {
      formData.value = {
        drinks: [{ drink: '', ml: 250, nutrients: null }],
      };
    }
  } catch (error) {
    console.log('No existing drink data, using default');
    formData.value = {
      drinks: [{ drink: '', ml: 250, nutrients: null }],
    };
  }
};

const handleSubmit = async (event) => {
  if (event) {
    event.preventDefault();
  }

  if (!validateForm()) {
    notificationRef.value.showNotification('Vyplňte prosím mililitry u všech nápojů', 'error');
    return;
  }

  try {
    const response = await axios.post('/meal/save-drink', {
      day: props.selectedDay,
      data: formData.value
    });

    if (response.data.status === 'success') {
      console.log('Drink saved successfully:', response.data.message);
      notificationRef.value.showNotification(response.data.message, 'success');

      emit('save-data', {
        type: 'drinks',
        day: props.selectedDay,
        data: formData.value
      });
    } else {
      console.error('Error:', response.data.message);
      notificationRef.value.showNotification(response.data.message, 'error');
    }
  } catch (error) {
    console.error('Error saving drink:', error);

    if (error.response && error.response.data && error.response.data.message) {
      notificationRef.value.showNotification(error.response.data.message, 'error');
    } else {
      notificationRef.value.showNotification('Došlo k chybě při ukládání nápoje. Zkuste to prosím znovu.', 'error');
    }
  }
};

onMounted(() => {
  if (props.selectedDay) {
    loadDrinkData(props.selectedDay);
  }
});
</script>

<template>
  <div>
    <Notification ref="notificationRef" />

    <h2 class="with-image drink">Pití</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <label for="drinks">Pití</label>
        <div
            v-for="(item, index) in formData.drinks"
            :key="`drinks-${index}`"
            class="input-group"
        >
          <div class="autocomplete-wrapper">
            <input
                type="text"
                :id="`drinks-${index}`"
                placeholder="Zadejte pití"
                v-model="formData.drinks[index].drink"
                @input="searchFood('drinks', index, formData.drinks[index].drink)"
                @focus="searchFood('drinks', index, formData.drinks[index].drink)"
                @blur="hideSuggestions('drinks', index)"
            />

            <!-- Loading spinner z composable -->
            <div v-if="(isLoadingAPI || isLoadingOFF) && activeSearch.fieldName === 'drinks' && activeSearch.index === index" class="loading-spinner">
              <div class="spinner"></div>
            </div>

            <ul v-if="showSuggestions.drinks[index]" class="suggestions">
              <li v-if="suggestions.drinks.length === 0 && (isLoadingAPI || isLoadingOFF)" class="no-results">
                Hledám...
              </li>
              <li
                  v-else-if="suggestions.drinks.length === 0"
                  class="no-results"
              >
                Nic nenalezeno
              </li>
              <li
                  v-for="(suggestion, i) in suggestions.drinks"
                  :key="i"
                  @click="selectFood('drinks', index, suggestion.name, suggestion.nutrients)"
              >
                {{ suggestion.name }}
                <span v-if="suggestion.brand" class="brand">{{ suggestion.brand }}</span>
                <span v-if="suggestion.source" class="source">({{ suggestion.source }})</span>
              </li>
            </ul>
          </div>
          <div class="ml-wrapper">
            <input
                type="number"
                :id="`drinks-ml-${index}`"
                placeholder="Mililitry"
                v-model="formData.drinks[index].ml"
                class="ml-input"
                :class="{ 'ml-error': validationErrors.drinks[index] }"
                min="0"
            />
            <span class="ml-unit">ml</span>
          </div>
          <button
              v-if="formData.drinks.length > 1"
              type="button"
              class="remove-btn"
              @click="removeField('drinks', index)"
          >
            ×
          </button>
        </div>
        <div class="add-new" @click="addField('drinks')">
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
  justify-content: space-between;
  gap: 10px;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  flex-shrink: 0;
}

h2 {
  &.with-image {
    padding-left: 20px;
    &.drink {
      &:before {
        content: url(/img/front/drink-icon.svg);
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
  border-bottom: 1px solid #f0f0f0;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}

.suggestions li:last-child {
  border-bottom: none;
}

.no-results {
  color: #666;
  font-style: italic;
}

.brand {
  font-size: 0.9em;
  color: #666;
  margin-left: 5px;
}

.source {
  font-size: 0.8em;
  color: #999;
  margin-left: 5px;
  font-style: italic;
}

.ml-wrapper {
  position: relative;
  width: 100px;
  flex-shrink: 0;
}

.ml-input {
  width: 100%;
  padding-right: 25px;
}

.ml-unit {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

.ml-input.ml-error {
  border-color: #dc2626;
  background-color: #fee2e2;
}

.loading-spinner {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>