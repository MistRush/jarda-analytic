<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  selectedDay: {
    type: Number,
    required: true
  }
});

const getStressColor = computed(() => {
  const level = dayData.value.stress.level;
  const ratio = level / 10;

  const hue = (1 - ratio) * 120;

  return {
    text: `hsl(${hue}, 70%, 45%)`,
    background: `hsla(${hue}, 70%, 45%, 0.15)`
  };
});

const foodItems = computed(() => {
  return dayData.value.items.filter(item => item.type !== 'drink');
});

const drinkItems = computed(() => {
  return dayData.value.items.filter(item => item.type === 'drink');
});

const dayData = ref({
  items: [],
  sleep: {
    hours: 0,
    quality: ''
  },
  stress: {
    level: 0,
    description: '',
    conditions: {
      positive: null,
      negative: null
    }
  },
  cosmetics: [],
  summary: ''
});

const loadFoodNames = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      dayData.value.items = [];
      return;
    }

    const response = await axios.get(`/meal/get-meals-for-result/${numericDayId}`);

    if (response.data.status === 'success' && response.data.data) {
      dayData.value.items = response.data.data;
    } else {
      dayData.value.items = [];
    }
  } catch (error) {
    console.error('Error loading food names:', error);
    dayData.value.items = [];
  }
};

const loadSleepData = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      dayData.value.sleep = { hours: 0, quality: '' };
      return;
    }

    const response = await axios.get(`/sleep/get-sleep-for-result/${numericDayId}`);

    if (response.data.status === 'success' && response.data.data) {
      dayData.value.sleep = {
        hours: response.data.data.hours || 0,
        quality: response.data.data.quality || 'Nezadáno'
      };
    } else {
      dayData.value.sleep = { hours: 0, quality: 'Nezadáno' };
    }
  } catch (error) {
    console.error('Error loading sleep data:', error);
    dayData.value.sleep = { hours: 0, quality: 'Nezadáno' };
  }
};

const loadStressData = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      dayData.value.stress = { level: 0, description: '', conditions: { positive: null, negative: null } };
      return;
    }

    const response = await axios.get(`/stress/get-stress-for-result/${numericDayId}`);

    console.log('Stress response:', response.data);

    if (response.data.status === 'success' && response.data.data) {
      dayData.value.stress = {
        level: response.data.data.level || 0,
        description: response.data.data.description || 'Nezadáno',
        conditions: response.data.data.conditions || { positive: null, negative: null }
      };
    } else {
      dayData.value.stress = { level: 0, description: 'Nezadáno', conditions: { positive: null, negative: null } };
    }
  } catch (error) {
    console.error('Error loading stress data:', error);
    dayData.value.stress = { level: 0, description: 'Nezadáno', conditions: { positive: null, negative: null } };
  }
};

const loadCosmeticsData = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      dayData.value.cosmetics = [];
      return;
    }

    const response = await axios.get(`/cosmetics/get-cosmetics-for-result/${numericDayId}`);

    if (response.data.status === 'success' && response.data.data) {
      dayData.value.cosmetics = response.data.data.map(item => item.name || item.product) || [];
    } else {
      dayData.value.cosmetics = [];
    }
  } catch (error) {
    console.error('Error loading cosmetics data:', error);
    dayData.value.cosmetics = [];
  }
};

const loadSummaryData = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      dayData.value.summary = '';
      return;
    }

    const response = await axios.get(`/summary/get-summary-for-result/${numericDayId}`);

    if (response.data.status === 'success' && response.data.data) {
      dayData.value.summary = response.data.data.summary || response.data.data.text || '';
    } else {
      dayData.value.summary = '';
    }
  } catch (error) {
    console.error('Error loading summary data:', error);
    dayData.value.summary = '';
  }
};

const loadAllData = async (dayId) => {
  if (!dayId) return;

  await Promise.all([
    loadFoodNames(dayId),
    // loadSleepData(dayId),
    loadStressData(dayId),
    loadCosmeticsData(dayId),
    // loadSummaryData(dayId)
  ]);
};

onMounted(() => {
  if (props.selectedDay) {
    loadAllData(props.selectedDay);
  }
});

// Sleduj změny selectedDay
watch(() => props.selectedDay, (newDay) => {
  if (newDay) {
    loadAllData(newDay);
  }
});
</script>

<template>
  <div class="day-results">
    <h2 class="with-image results">Výsledky dne</h2>

    <div class="result-block">
      <h3 class="block-title">Jídlo</h3>
      <div class="summary-holder">
        <ul class="items-list">
          <li v-for="(item, index) in foodItems" :key="index">
            {{ item.name }} - {{ item.quantity }}g
          </li>
          <li v-if="foodItems.length === 0">Žádná data o jídle</li>
        </ul>
        <div class="result-holder">
          <div class="advice">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/advice-icon.svg">
              Doporučení
            </div>
            <div class="text">
              Používejte kosmetiku vhodnou pro váš typ pleti a pravidelně ji obměňujte.
            </div>
          </div>
          <div class="warning">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/warning-icon.svg">
              Doporučení
            </div>
            <div class="text">
              Používejte kosmetiku vhodnou pro váš typ pleti a pravidelně ji obměňujte.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-block">
      <h3 class="block-title">Pití</h3>
      <div class="summary-holder">
        <ul class="items-list">
          <li v-for="(item, index) in drinkItems" :key="index">
            {{ item.name }} - {{ item.quantity }}ml
          </li>
          <li v-if="drinkItems.length === 0">Žádná data o pití</li>
        </ul>
        <div class="result-holder">
          <div class="advice">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/advice-icon.svg">
              Doporučení
            </div>
            <div class="text">
              Používejte kosmetiku vhodnou pro váš typ pleti a pravidelně ji obměňujte.
            </div>
          </div>
          <div class="warning">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/warning-icon.svg">
              Doporučení
            </div>
            <div class="text">
              Používejte kosmetiku vhodnou pro váš typ pleti a pravidelně ji obměňujte.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-block">
      <h3 class="block-title">Spánek</h3>
      <div class="summary-holder">
        <div class="items-list">
          <div class="stress-info" :style="{ backgroundColor: getStressColor.background }">
            <!--            <strong>Úroveň:</strong>-->
            <p> <span class="stress-level" :style="{ color: getStressColor.text }">{{ dayData.stress.level }}/10</span></p>
          </div>
        </div>
        <div class="result-holder">
          <div class="advice">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/advice-icon.svg">
              Doporučení
            </div>
            <div class="text">
              Používejte kosmetiku vhodnou pro váš typ pleti a pravidelně ji obměňujte.
            </div>
          </div>
          <div class="warning">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/warning-icon.svg">
              Doporučení
            </div>
            <div class="text">
              Používejte kosmetiku vhodnou pro váš typ pleti a pravidelně ji obměňujte.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-block stress-block" >
      <h3 class="block-title">Stres</h3>
      <div class="summary-holder">
        <div class="items-list">
          <div class="stress-info" :style="{ backgroundColor: getStressColor.background }">
<!--            <strong>Úroveň:</strong>-->
            <p> <span class="stress-level" :style="{ color: getStressColor.text }">{{ dayData.stress.level }}/10</span></p>
          </div>
        </div>
        <div class="result-holder">
          <div class="advice" v-if="dayData.stress.conditions && dayData.stress.conditions.positive">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/advice-icon.svg">
              {{ dayData.stress.conditions.positive.name }}
            </div>
            <div class="text">
              {{ dayData.stress.conditions.positive.description }}
            </div>
          </div>

          <div class="warning" v-if="dayData.stress.conditions && dayData.stress.conditions.negative">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/warning-icon.svg">
              {{ dayData.stress.conditions.negative.name }}
            </div>
            <div class="text">
              {{ dayData.stress.conditions.negative.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-block">
      <h3 class="block-title">Kosmetika</h3>
      <div class="summary-holder">
        <ul class="items-list">
          <li v-for="(item, index) in dayData.cosmetics" :key="index">
            {{ item }}
          </li>
          <li v-if="dayData.cosmetics.length === 0">Žádná data o kosmetice</li>
        </ul>
        <div class="result-holder">
          <div class="advice">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/advice-icon.svg">
              Doporučení
            </div>
            <div class="text">
              Používejte kosmetiku vhodnou pro váš typ pleti a pravidelně ji obměňujte.
            </div>
          </div>
          <div class="warning">
            <div class="headline">
              <img src="http://denikpleti.localhost/img/front/warning-icon.svg">
              Doporučení
            </div>
            <div class="text">
              Používejte kosmetiku vhodnou pro váš typ pleti a pravidelně ji obměňujte.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-block summary-block" v-if="dayData.summary">
      <h3 class="block-title">Shrnutí</h3>
      <p>{{ dayData.summary }}</p>
    </div>

    <div class="result-block summary-block" v-else>
      <h3 class="block-title">Shrnutí</h3>
      <p>Tvé pleti by dnes nejvíc pomohlo:</p>
      <ul class="items-list-summary">
        <li>více vody</li>
        <li>klidnější spánek</li>
        <li>pauza s gelem xx</li>
        <li>lehčí strava s méně cukru a tuku</li>
      </ul>
      <p>Zítra je nový den. Každý zápis tě posouvá blíž k pleti, ve které se budeš cítit dobře.</p>
    </div>
  </div>
</template>

<style scoped>
.day-results {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  &.with-image {
    padding-left: 20px;
    &.results {
      &:before {
        content: url(/img/front/result-icon.svg);
        position: absolute;
        top: 0px;
        left: 0px;
      }
    }
  }
}

.result-block {
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.block-title {
  color: #0E1B36;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.items-list li {
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
}

.items-list li:last-child {
  border-bottom: none;
}

.sleep-info {
  color: #374151;
  font-size: 14px;
}

.sleep-info p {
  margin: 8px 0;
}

.summary-block {
  ul {
    list-style: disc;
    margin-left: 15px;

    li {
      font-weight: 600;
      font-size: 12px;
      line-height: 21px;
      color:#0E1B36;
    }
  }
}

.summary-content {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  font-style: italic;
}

.recommendation-block {
  background: #EFF6FF;
  border-left: 4px solid #3B82F6;
  border-radius: 4px;
  padding: 20px;
  margin-top: 30px;
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #0E1B36;
  margin-bottom: 10px;
  font-family: Urbanist, sans-serif;
}

.recommendation-header img {
  width: 20px;
  height: 20px;
}

.recommendation-content {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
}

.advice {
  background-image: url("/img/front/advice-bg.png");
  background-position: center;
  background-size: cover;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 10px;
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

.warning {
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

.summary-holder {
  display: flex;
  justify-content: space-between;

  .items-list {
    width: 49%;

    .stress-info {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      border-radius: 4px;
      height: 100%;
    }
  }

  .result-holder {
    width: 49%;
  }
}

.stress-level {
  font-weight: 700;
  font-size: 16px;
}

.stress-block {
  transition: background-color 0.3s ease;
}

@media (max-width: 768px) {
  .summary-holder {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .items-list {
      width: 100%;
    }

    .result-holder {
      width: 100%;
    }
  }
}
</style>