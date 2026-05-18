<script setup>
import { ref, watch, computed, onMounted } from 'vue';
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
  from: '',
  to: '',
});

const sleepDuration = computed(() => {
  if (!formData.value.from || !formData.value.to) {
    return null;
  }

  const [fromHours, fromMinutes] = formData.value.from.split(':').map(Number);
  const [toHours, toMinutes] = formData.value.to.split(':').map(Number);

  let fromTime = fromHours * 60 + fromMinutes;
  let toTime = toHours * 60 + toMinutes;

  if (toTime < fromTime) {
    toTime += 24 * 60;
  }

  const durationMinutes = toTime - fromTime;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return { hours, minutes, total: durationMinutes / 60 };
});

watch(() => props.selectedDay, (newDay) => {
  console.log('Day changed to:', newDay);
  loadSleepData(newDay);
});

const loadSleepData = async (dayId) => {
  try {
    const numericDayId = typeof dayId === 'string' ? parseInt(dayId, 10) : dayId;

    if (!numericDayId) {
      formData.value = {
        from: '',
        to: '',
      };
      return;
    }

    const response = await axios.get(`/sleep/get-sleep/${numericDayId}`);

    if (response.data.status === 'success' && response.data.data) {
      formData.value = response.data.data;
    } else {
      formData.value = {
        from: '',
        to: '',
      };
    }
  } catch (error) {
    console.log('No existing sleep data, using default');
    formData.value = {
      from: '',
      to: '',
    };
  }
};

const handleSubmit = async (event) => {
  if (event) {
    event.preventDefault();
  }

  console.log('Submitting sleep form:', formData.value);

  if (!formData.value.from || !formData.value.to) {
    console.error('Vyplňte všechna povinná pole');
    notificationRef.value?.showNotification('Vyplňte všechna povinná pole', 'error');
    return;
  }

  try {
    const response = await axios.post('/sleep/save-sleep', {
      day: props.selectedDay,
      data: {
        from: formData.value.from,
        to: formData.value.to,
        duration: sleepDuration.value
      }
    });

    if (response.data.status === 'success') {
      console.log('Sleep saved successfully:', response.data.message);
      notificationRef.value?.showNotification(response.data.message, 'success');

      emit('save-data', {
        type: 'sleep',
        day: props.selectedDay,
        data: {
          ...formData.value,
          duration: sleepDuration.value
        }
      });
    } else {
      console.error('Error:', response.data.message);
      notificationRef.value?.showNotification(response.data.message, 'error');
    }
  } catch (error) {
    console.error('Error saving sleep:', error);
    notificationRef.value?.showNotification('Došlo k chybě při ukládání dat spánku', 'error');
  }
};

onMounted(() => {
  if (props.selectedDay) {
    loadSleepData(props.selectedDay);
  }
});
</script>

<template>
  <div>
    <h2 class="with-image sleep">Spánek</h2>
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-6">
          <div class="form-row">
            <label for="from">Od</label>
            <input
                type="time"
                id="from"
                v-model="formData.from"
                placeholder="22:00"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="form-row">
            <label for="to">Do</label>
            <input
                type="time"
                id="to"
                v-model="formData.to"
                placeholder="07:00"
            />
          </div>
        </div>
      </div>
      <div class="sleep-duration">
        <strong>Doba spánku: </strong>  <span v-if="sleepDuration"> {{ sleepDuration.hours }} hodin{{ sleepDuration.minutes > 0 ? ` ${sleepDuration.minutes} minut` : '' }}</span>
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
    &.sleep {
      &:before {
        content: url(/img/front/sleep-icon.svg);
        position: absolute;
        top: 0px;
        left: 0px;
      }
    }
  }
}

.form-row {
  margin-bottom: 15px;
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

.sleep-duration {
  margin: 0 0 15px 0;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 14px;
  line-height: 18px;
  color: #0E1B36;

  span {
    font-family: Urbanist;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 14px;
    leading-trim: NONE;
    line-height: 18px;
    letter-spacing: 0px;
    color: #00AEFF
  }

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