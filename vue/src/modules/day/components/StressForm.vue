<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import Notification from './../../components/Notification.vue';

const notificationRef = ref(null);

const props = defineProps({
  selectedDay: {
    type: Number,
    required: true
  },
  recommendation: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save-data']);

const formData = ref({
  level: 5,
});

watch(() => props.selectedDay, (newDay) => {
  console.log('Day changed to:', newDay);
  loadStressData(newDay);
});

const loadStressData = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      formData.value = {
        level: 5,
      };
      return;
    }

    const response = await axios.get(`/stress/get-stress/${numericDayId}`);

    if (response.data.status === 'success' && response.data.data) {
      formData.value = response.data.data;
    } else {
      formData.value = {
        level: 5,
      };
    }
  } catch (error) {
    console.log('No existing stress data, using default');
    formData.value = {
      level: 5,
    };
  }
};

const handleSubmit = async (event) => {
  if (event) {
    event.preventDefault();
  }

  console.log('Submitting stress form:', formData.value);

  try {
    const response = await axios.post('/stress/save-stress', {
      day: props.selectedDay,
      data: formData.value
    });

    if (response.data.status === 'success') {
      console.log('Stress saved successfully:', response.data.message);
      notificationRef.value.showNotification(response.data.message, 'success');

      emit('save-data', {
        type: 'stress',
        day: props.selectedDay,
        data: formData.value
      });
    } else {
      console.error('Error:', response.data.message);
      notificationRef.value.showNotification(response.data.message, 'error');
    }
  } catch (error) {
    console.error('Error saving stress:', error);
  }
};

const getStressColor = (level) => {
  if (level <= 3) {
    return '#4caf50';
  } else if (level <= 5) {
    return '#8bc34a';
  } else if (level <= 7) {
    return '#ffc107';
  } else if (level <= 9) {
    return '#ff9800';
  } else {
    return '#f44336';
  }
};

const getStressLabel = (level) => {
  if (level <= 2) return 'Velmi nízký';
  if (level <= 4) return 'Nízký';
  if (level <= 6) return 'Střední';
  if (level <= 8) return 'Vysoký';
  return 'Velmi vysoký';
};

onMounted(() => {
  if (props.selectedDay) {
    loadStressData(props.selectedDay);
  }
});
</script>

<template>
  <div>
    <h2 class="with-image stress">Stres</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <label for="stress-level">Zadejte úroveň stresu</label>
        <div class="stress-scale">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
          <span>10</span>
        </div>
        <input
            type="range"
            id="stress-level"
            v-model.number="formData.level"
            min="1"
            max="10"
            step="1"
            class="stress-slider"
            :style="{
              background: `linear-gradient(to right,
                #00D011 0%,
                #8bc34a 30%,
                #FFB700 50%,
                #CF600C 70%,
                #FF0000 100%)`
            }"
        />
        <div class="text">
          <div class="green">Nízká</div>
          <div class="red">Vysoká</div>
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
  <Notification ref="notificationRef" />
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

h2 {
  &.with-image {
    padding-left: 20px;
    &.stress {
      &:before {
        content: url(/img/front/stress-icon.svg);
        position: absolute;
        top: 0px;
        left: 0px;
      }
    }
  }
}


.text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
  padding: 0 3px;
  width: 100%;

  .red {
    font-weight: 500;
    font-style: Medium;
    font-size: 11px;
    line-height: 18px;
    letter-spacing: 0px;
    text-align: center;
    color: #EB4335;
  }

  .green {
    font-weight: 500;
    font-style: Medium;
    font-size: 11px;
    line-height: 18px;
    letter-spacing: 0px;
    text-align: center;
    color: #00D011;
  }

}


.form-row {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.stress-display {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.stress-value {
  font-size: 48px;
  font-weight: bold;
  min-width: 60px;
}

.stress-label {
  font-size: 18px;
  color: #666;
  font-weight: 500;
}

.stress-slider {
  width: 100%;
  height: 12px;
  border-radius: 6px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  padding: 6px !important;
}

.stress-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  outline: none;
}

.stress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #D5560B;
  background-color: white !important;
  background: url("data:image/svg+xml;utf8, <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'> circle cx='10' cy='10' r='9' fill='white' stroke='white' stroke-width='2'/> <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='black'>&lt; &gt;</text> </svg>") no-repeat center;
  background-size: contain;
}


.stress-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  background: url("data:image/svg+xml;utf8, <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'> <circle cx='10' cy='10' r='9' fill='white' stroke='red' stroke-width='2'/> <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='red'>&lt; &gt;</text> </svg>") no-repeat center;
  background-size: contain;
}

/* Internet Explorer */
.stress-slider::-ms-thumb {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #333;
  cursor: pointer;
}

/* “Text” uvnitř kuličky – řešení: before */
.stress-slider::-webkit-slider-thumb::before {
  content: "< >";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #333;
}

.stress-scale {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #576583;
  width: 100%;
  padding: 0 14px;
}

.recomendation {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.recomendation .headline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  margin-bottom: 8px;
}

.recomendation .text {
  color: #666;
  line-height: 1.5;
}
</style>