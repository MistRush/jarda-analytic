<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import FoodForm from './components/FoodForm.vue';
import DrinkForm from './components/DrinkForm.vue';
import SleepForm from './components/SleepForm.vue';
import StressForm from './components/StressForm.vue';
import BeautyForm from './components/BeautyForm.vue';
import PhotoForm from './components/PhotoUploadForm.vue';
import ResultBox from './components/ResultBox.vue';

const today = new Date();
const selectedDay = ref(today.getDay() === 0 ? 6 : today.getDay() - 1);
const currentDayId = ref(null);

const dayNames = ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne'];

const recommendations = ref({
  meal: {},
  drink: {},
  stress: {},
  sleep: {},
  cosmetics: {},
  photo: {}
});

const daysOfWeek = computed(() => {
  const days = [];
  const startOfWeek = new Date(today);

  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);

    days.push({
      name: dayNames[i],
      number: currentDay.getDate(),
      index: i,
      date: new Date(currentDay),
      isToday: currentDay.toDateString() === today.toDateString()
    });
  }

  return days;
});

const loadRecommendationData = async () => {
  try {
    const response = await axios.get(`/day/get-recommendations/`);

    console.log('🍽️responsssssss',response)

    recommendations.value = {
      meal: response.data.recommendations.meal || {},
      drink: response.data.recommendations.drink || {},
      stress: response.data.recommendations.stress || {},
      sleep: response.data.recommendations.sleep || {},
      cosmetics: response.data.recommendations.cosmetics || {}
    };

    console.log('🍽️ recommendations.meal:', recommendations.value.meal);
  } catch (error) {
    console.error('Error loading day data:', error);
  }
};

const getOrCreateDay = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0];

    const response = await axios.post('/day/get-or-create-day', {
      date: formattedDate
    });

    if (response.data.status === 'success') {
      currentDayId.value = response.data.dayId;
      console.log('Day ID loaded:', currentDayId.value, 'for date:', formattedDate);
      return response.data.dayId;
    } else {
      console.error('Error getting day:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error getting or creating day:', error);
    return null;
  }
};

const selectDay = async (dayIndex) => {
  selectedDay.value = dayIndex;
  const selectedDayData = daysOfWeek.value[dayIndex];
  console.log('Selected day:', selectedDayData);

  const dayId = await getOrCreateDay(selectedDayData.date);
  if (dayId) {
    loadDayData(dayId);
  }
};

const loadDayData = async (dayId) => {
  try {
    console.log(`Loading data for day ID: ${dayId}`);
    // const response = await axios.get(`/api/day-data/${dayId}`);
  } catch (error) {
    console.error('Error loading day data:', error);
  }
};

const saveDayData = async (formData) => {
  try {
    console.log('Saving day data:', formData, 'for day ID:', currentDayId.value);
  } catch (error) {
    console.error('Error saving day data:', error);
  }
};

onMounted(async () => {
  loadRecommendationData();
  const todayData = daysOfWeek.value[selectedDay.value];
  if (todayData) {
    const dayId = await getOrCreateDay(todayData.date);
    if (dayId) {
      loadDayData(dayId);
    }
  }
});
</script>

<template>
  <div class="day-holder">
    <div class="day-container">
      <div class="days-container">
        <div
            v-for="day in daysOfWeek"
            :key="day.index"
            class="day-item"
            :class="{
            active: selectedDay === day.index,
            today: day.isToday
          }"
            @click="selectDay(day.index)"
        >
          <div class="day-name">{{ day.name }}</div>
          <div class="day-number">{{ day.number }}</div>
        </div>
      </div>

      <div class="form-holder">
        <FoodForm
            :selected-day="currentDayId"
            @save-data="saveDayData"
            :recommendation="recommendations.meal"
        />
      </div>
      <div class="form-holder">
        <DrinkForm
            :selected-day="currentDayId"
            @save-data="saveDayData"
            :recommendation="recommendations.drink"
            class="drink-form"
        />
      </div>
      <div class="form-holder">
        <SleepForm
            :selected-day="currentDayId"
            @save-data="saveDayData"
            :recommendation="recommendations.sleep"
            class="sleep-form"
        />
      </div>
      <div class="form-holder">
        <StressForm
            :selected-day="currentDayId"
            @save-data="saveDayData"
            :recommendation="recommendations.stress"
            class="stress-form"
        />
      </div>

      <div class="form-holder">
        <BeautyForm
            :selected-day="currentDayId"
            @save-data="saveDayData"
            :recommendation="recommendations.cosmetics"
            class="stress-form"
        />
      </div>

      <div class="form-holder">
        <PhotoForm
            :selected-day="currentDayId"
            @save-data="saveDayData"
            class="stress-form"
        />
      </div>

      <div class="form-holder">
        <ResultBox
            :selected-day="currentDayId"
            @save-data="saveDayData"
            class="stress-form"
        />
      </div>
    </div>
  </div>
</template>

<!-- zbytek stylů zůstává stejný -->

<style>
.day-container {
  width: 750px;
  margin: 0 auto;

  .form-holder {
    padding: 12px;
    box-shadow: 0px 8px 26.5px -5px #37395C29;

    .drink-form {
      margin-top: 10px;
    }

    .sleep-form {
      margin-top: 10px;
    }

    .stress-form {
      margin-top: 10px;
    }

    .recomendation {
      border: 1px solid #FFB700;
      background-color: rgba(255, 183, 0, 0.24);
      border-radius: 4px;
      padding: 12px;
      .headline {
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: Urbanist;
        font-weight: 600;
        font-style: SemiBold;
        font-size: 14px;
        line-height: 18px;
        color: #0E1B36;
      }

      .text {
        font-family: Urbanist;
        font-weight: 400;
        font-style: Regular;
        font-size: 12px;
        line-height: 18px;
        color: #0E1B36;
        margin-top: 5px;
      }
    }
  }

  form {
    .form-row {
      padding: 5px;

      .add-new {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        justify-content: center;
        margin-top: 10px;
      }

      label {
        font-family: Urbanist;
        font-weight: 500;
        font-style: Medium;
        font-size: 12px;
        line-height: 18px;
      }

      input {
        border: 1px solid #DDEBF3;
        border-radius: 4px;
        font-family: Urbanist;
        font-weight: 500;
        font-style: Medium;
        font-size: 14px;
        line-height: 18px;
        padding: 13px;

        &::placeholder {
          color: #A0A0A0;
          opacity: 1;
        }
      }
    }
  }

}
</style>