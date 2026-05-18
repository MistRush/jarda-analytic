<script setup>
import { ref, watch, onMounted   } from 'vue';
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

const { searchFood: searchFoodAPI, searchResults } = useFoodAPI();
const notificationRef = ref(null);
const activeSearch = ref({ fieldName: null, index: null });

const validationErrors = ref({
  breakfast: [],
  morningSnack: [],
  lunch: [],
  afternoonSnack: [],
  dinner: []
});

const validateForm = () => {
  let isValid = true;
  const newErrors = {
    breakfast: [],
    morningSnack: [],
    lunch: [],
    afternoonSnack: [],
    dinner: []
  };

  const fields = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner'];

  fields.forEach(field => {
    formData.value[field].forEach((item, index) => {
      if (item.food && (!item.grams || item.grams <= 0)) {
        newErrors[field][index] = true;
        isValid = false;
      } else {
        newErrors[field][index] = false;
      }
    });
  });

  validationErrors.value = newErrors;
  return isValid;
};

const emit = defineEmits(['save-data']);

const formData = ref({
  breakfast: [{ food: '', grams: 100, nutrients: null }],
  morningSnack: [{ food: '', grams: 100, nutrients: null }],
  lunch: [{ food: '', grams: 100, nutrients: null }],
  afternoonSnack: [{ food: '', grams: 100, nutrients: null }],
  dinner: [{ food: '', grams: 100, nutrients: null }],
});

const suggestions = ref({
  breakfast: [],
  morningSnack: [],
  lunch: [],
  afternoonSnack: [],
  dinner: []
});

const showSuggestions = ref({
  breakfast: [],
  morningSnack: [],
  lunch: [],
  afternoonSnack: [],
  dinner: []
});

const searchFood = async (fieldName, index, query) => {
  if (query.length < 3) {
    showSuggestions.value[fieldName][index] = false;
    activeSearch.value = { fieldName: null, index: null };
    return;
  }

  showSuggestions.value[fieldName][index] = true;
  suggestions.value[fieldName] = [];

  activeSearch.value = { fieldName, index };

  searchFoodAPI(query);
};

const selectFood = (fieldName, index, foodName, nutrients) => {

  console.log('=== Selected Food ===');
  console.log('Field:', fieldName);
  console.log('Index:', index);
  console.log('Food name:', foodName);
  console.log('Nutrients:', nutrients);
  console.log('==================');

  formData.value[fieldName][index].food = foodName;
  formData.value[fieldName][index].nutrients = nutrients;
  showSuggestions.value[fieldName][index] = false;
};

const addField = (fieldName) => {
  formData.value[fieldName].push({ food: '', grams: 100, nutrients: null });
};

const removeField = (fieldName, index) => {
  if (formData.value[fieldName].length > 1) {
    formData.value[fieldName].splice(index, 1);
  }
};

watch(() => props.selectedDay, (newDay) => {
  console.log('Day changed to:', newDay);
  loadFoodData(newDay);
});

watch(searchResults, (newResults) => {
  if (activeSearch.value.fieldName && newResults.length > 0) {
    suggestions.value[activeSearch.value.fieldName] = newResults;
    showSuggestions.value[activeSearch.value.fieldName][activeSearch.value.index] = true;
  }
}, { deep: true });

const loadFoodData = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      formData.value = {
        breakfast: [{ food: '', grams: 100, nutrients: null }],
        morningSnack: [{ food: '', grams: 100, nutrients: null }],
        lunch: [{ food: '', grams: 100, nutrients: null }],
        afternoonSnack: [{ food: '', grams: 100, nutrients: null }],
        dinner: [{ food: '', grams: 100, nutrients: null }],
      };
      return;
    }

    const response = await axios.get(`/meal/get-meal/${numericDayId}`);

    if (response.data.status === 'success' && response.data.data) {
      formData.value = response.data.data;
    } else {
      formData.value = {
        breakfast: [{ food: '', grams: 100, nutrients: null }],
        morningSnack: [{ food: '', grams: 100, nutrients: null }],
        lunch: [{ food: '', grams: 100, nutrients: null }],
        afternoonSnack: [{ food: '', grams: 100, nutrients: null }],
        dinner: [{ food: '', grams: 100, nutrients: null }],
      };
    }
  } catch (error) {
    formData.value = {
      breakfast: [{ food: '', grams: 100, nutrients: null }],
      morningSnack: [{ food: '', grams: 100, nutrients: null }],
      lunch: [{ food: '', grams: 100, nutrients: null }],
      afternoonSnack: [{ food: '', grams: 100, nutrients: null }],
      dinner: [{ food: '', grams: 100, nutrients: null }],
    };
  }
};

const handleSubmit = async (event) => {
  if (event) {
    event.preventDefault();
  }

  if (!validateForm()) {
    notificationRef.value.showNotification('Vyplňte prosím gramy u všech jídel', 'error');
    return;
  }

  console.log('Submitting food form:', formData.value);

  try {
    const response = await axios.post('/meal/save-meal', {
      day: props.selectedDay,
      data: formData.value
    });

    if (response.data.status === 'success') {
      console.log('Meal saved successfully:', response.data.message);

      notificationRef.value.showNotification(response.data.message, 'success');

      emit('save-data', {
        type: 'food',
        day: props.selectedDay,
        data: formData.value
      });
    } else {
      console.error('Error:', response.data.message);
      notificationRef.value.showNotification(response.data.message, 'error');
    }
  } catch (error) {
    console.error('Error saving meal:', error);

    if (error.response && error.response.data && error.response.data.message) {
      notificationRef.value.showNotification(error.response.data.message, 'error');
    } else {
      notificationRef.value.showNotification('Došlo k chybě při ukládání jídla. Zkuste to prosím znovu.', 'error');
    }
  }
};

const validateField = (field) => {
  console.log(`Validating field: ${field}`);
};

onMounted(() => {
  if (props.selectedDay) {
    loadFoodData(props.selectedDay);
  }
});
</script>

<template>
  <div>
    <Notification ref="notificationRef" />

    <h2 class="with-image food">Jídlo</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <label for="breakfast">Snídaně</label>
        <div
            v-for="(item, index) in formData.breakfast"
            :key="`breakfast-${index}`"
            class="input-group"
        >
          <div class="autocomplete-wrapper">
            <input
                type="text"
                :id="`breakfast-${index}`"
                placeholder="Zadejte snídani"
                v-model="formData.breakfast[index].food"
                @input="searchFood('breakfast', index, formData.breakfast[index].food)"
            />
            <ul v-if="showSuggestions.breakfast[index]" class="suggestions">
              <li v-if="suggestions.breakfast.length === 0" class="no-results">
                Hledám...
              </li>
              <li
                  v-for="(suggestion, i) in suggestions.breakfast"
                  :key="i"
                  @click="selectFood('breakfast', index, suggestion.name, suggestion.nutrients)"
              >
                {{ suggestion.name }}
                <span v-if="suggestion.brand" class="brand">{{ suggestion.brand }}</span>
              </li>
            </ul>
          </div>
          <div class="grams-wrapper">
            <input
                type="number"
                :id="`breakfast-grams-${index}`"
                placeholder="Gramy"
                v-model="formData.breakfast[index].grams"
                class="grams-input"
                :class="{ 'grams-error': validationErrors.breakfast[index] }"
                min="0"
            />
            <span class="grams-unit">g</span>
          </div>
          <button
              v-if="formData.breakfast.length > 1"
              type="button"
              class="remove-btn"
              @click="removeField('breakfast', index)"
          >
            ×
          </button>
        </div>
        <div class="add-new" @click="addField('breakfast')">
          Přidat záznam <img src="http://denikpleti.localhost/img/front/icons/add.svg">
        </div>
      </div>

      <div class="form-row">
        <label for="morningSnack">Svačina</label>
        <div
            v-for="(item, index) in formData.morningSnack"
            :key="`morningSnack-${index}`"
            class="input-group"
        >
          <div class="autocomplete-wrapper">
            <input
                type="text"
                :id="`morningSnack-${index}`"
                placeholder="Zadejte svačinu"
                v-model="formData.morningSnack[index].food"
                @input="searchFood('morningSnack', index, formData.morningSnack[index].food)"
            />
            <ul v-if="showSuggestions.morningSnack[index]" class="suggestions">
              <li v-if="suggestions.morningSnack.length === 0" class="no-results">
                Hledám...
              </li>
              <li
                  v-for="(suggestion, i) in suggestions.morningSnack"
                  :key="i"
                  @click="selectFood('morningSnack', index, suggestion.name, suggestion.nutrients)"
              >
                {{ suggestion.name }}
                <span v-if="suggestion.brand" class="brand">{{ suggestion.brand }}</span>
              </li>
            </ul>
          </div>
          <div class="grams-wrapper">
            <input
                type="number"
                :id="`morningSnack-grams-${index}`"
                placeholder="Gramy"
                v-model="formData.morningSnack[index].grams"
                class="grams-input"
                :class="{ 'grams-error': validationErrors.morningSnack[index] }"
                min="0"
            />
            <span class="grams-unit">g</span>
          </div>
          <button
              v-if="formData.morningSnack.length > 1"
              type="button"
              class="remove-btn"
              @click="removeField('morningSnack', index)"
          >
            ×
          </button>
        </div>
        <div class="add-new" @click="addField('morningSnack')">
          Přidat záznam <img src="http://denikpleti.localhost/img/front/icons/add.svg">
        </div>
      </div>

      <div class="form-row">
        <label for="lunch">Oběd</label>
        <div
            v-for="(item, index) in formData.lunch"
            :key="`lunch-${index}`"
            class="input-group"
        >
          <div class="autocomplete-wrapper">
            <input
                type="text"
                :id="`lunch-${index}`"
                placeholder="Zadejte oběd"
                v-model="formData.lunch[index].food"
                @input="searchFood('lunch', index, formData.lunch[index].food)"
            />
            <ul v-if="showSuggestions.lunch[index]" class="suggestions">
              <li v-if="suggestions.lunch.length === 0" class="no-results">
                Hledám...
              </li>
              <li
                  v-for="(suggestion, i) in suggestions.lunch"
                  :key="i"
                  @click="selectFood('lunch', index, suggestion.name, suggestion.nutrients)"
              >
                {{ suggestion.name }}
                <span v-if="suggestion.brand" class="brand">{{ suggestion.brand }}</span>
              </li>
            </ul>
          </div>
          <div class="grams-wrapper">
            <input
                type="number"
                :id="`lunch-grams-${index}`"
                placeholder="Gramy"
                v-model="formData.lunch[index].grams"
                class="grams-input"
                :class="{ 'grams-error': validationErrors.lunch[index] }"
                min="0"
            />
            <span class="grams-unit">g</span>
          </div>
          <button
              v-if="formData.lunch.length > 1"
              type="button"
              class="remove-btn"
              @click="removeField('lunch', index)"
          >
            ×
          </button>
        </div>
        <div class="add-new" @click="addField('lunch')">
          Přidat záznam <img src="http://denikpleti.localhost/img/front/icons/add.svg">
        </div>
      </div>

      <div class="form-row">
        <label for="afternoonSnack">Odpolední svačina</label>
        <div
            v-for="(item, index) in formData.afternoonSnack"
            :key="`afternoonSnack-${index}`"
            class="input-group"
        >
          <div class="autocomplete-wrapper">
            <input
                type="text"
                :id="`afternoonSnack-${index}`"
                placeholder="Zadejte svačinu"
                v-model="formData.afternoonSnack[index].food"
                @input="searchFood('afternoonSnack', index, formData.afternoonSnack[index].food)"
            />
            <ul v-if="showSuggestions.afternoonSnack[index]" class="suggestions">
              <li v-if="suggestions.afternoonSnack.length === 0" class="no-results">
                Hledám...
              </li>
              <li
                  v-for="(suggestion, i) in suggestions.afternoonSnack"
                  :key="i"
                  @click="selectFood('afternoonSnack', index, suggestion.name, suggestion.nutrients)"
              >
                {{ suggestion.name }}
                <span v-if="suggestion.brand" class="brand">{{ suggestion.brand }}</span>
              </li>
            </ul>
          </div>
          <div class="grams-wrapper">
            <input
                type="number"
                :id="`afternoonSnack-grams-${index}`"
                placeholder="Gramy"
                v-model="formData.afternoonSnack[index].grams"
                class="grams-input"
                :class="{ 'grams-error': validationErrors.afternoonSnack[index] }"
                min="0"
            />
            <span class="grams-unit">g</span>
          </div>
          <button
              v-if="formData.afternoonSnack.length > 1"
              type="button"
              class="remove-btn"
              @click="removeField('afternoonSnack', index)"
          >
            ×
          </button>
        </div>
        <div class="add-new" @click="addField('afternoonSnack')">
          Přidat záznam <img src="http://denikpleti.localhost/img/front/icons/add.svg">
        </div>
      </div>

      <div class="form-row">
        <label for="dinner">Večeře</label>
        <div
            v-for="(item, index) in formData.dinner"
            :key="`dinner-${index}`"
            class="input-group"
        >
          <div class="autocomplete-wrapper">
            <input
                type="text"
                :id="`dinner-${index}`"
                placeholder="Zadejte večeři"
                v-model="formData.dinner[index].food"
                @input="searchFood('dinner', index, formData.dinner[index].food)"
            />
            <ul v-if="showSuggestions.dinner[index]" class="suggestions">
              <li v-if="suggestions.dinner.length === 0" class="no-results">
                Hledám...
              </li>
              <li
                  v-for="(suggestion, i) in suggestions.dinner"
                  :key="i"
                  @click="selectFood('dinner', index, suggestion.name, suggestion.nutrients)"
              >
                {{ suggestion.name }}
                <span v-if="suggestion.brand" class="brand">{{ suggestion.brand }}</span>
              </li>
            </ul>
          </div>
          <div class="grams-wrapper">
            <input
                type="number"
                :id="`dinner-grams-${index}`"
                placeholder="Gramy"
                v-model="formData.dinner[index].grams"
                class="grams-input"
                :class="{ 'grams-error': validationErrors.dinner[index] }"
                min="0"
            />
            <span class="grams-unit">g</span>
          </div>
          <button
              v-if="formData.dinner.length > 1"
              type="button"
              class="remove-btn"
              @click="removeField('dinner', index)"
          >
            ×
          </button>
        </div>
        <div class="add-new" @click="addField('dinner')">
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
  gap: 5px;
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
  flex-grow: 1;
}

.grams-input {
  width: 39%;
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

.grams-wrapper {
  position: relative;
  width: 100px;
  flex-shrink: 0;
}

.grams-input {
  width: 100%;
  padding-right: 20px;
}

.grams-unit {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

.grams-input.grams-error {
  border-color: #dc2626;
  background-color: #fee2e2;
}
</style>