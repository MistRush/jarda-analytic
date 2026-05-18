<template>
  <div class="analytics-dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="fa fa-chart-line mr-2"></i> JARDA Analytics</h2>
      <div class="date-picker">
        <input type="date" v-model="startDate" @change="fetchData" class="form-control d-inline-block w-auto mr-2">
        <input type="date" v-model="endDate" @change="fetchData" class="form-control d-inline-block w-auto">
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Načítám data z Google Analytics...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else>
      <!-- Základní metriky -->
      <div class="row mb-4">
        <div class="col-md-3" v-for="(val, label) in overview" :key="label">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <h6 class="text-muted text-uppercase small">{{ labels[label] }}</h6>
              <h3 class="mb-0">{{ val }}</h3>
              <small :class="getDiffClass(label)" v-if="diffs[label]">
                {{ diffs[label] }}% oproti minule
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Grafy a Tabulky -->
      <div class="row">
        <div class="col-md-8">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white"><strong>Trend návštěvnosti</strong></div>
            <div class="card-body">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white"><strong>Top dotazy (Search Console)</strong></div>
            <div class="card-body p-0">
              <table class="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Dotaz</th>
                    <th class="text-right">Kliknutí</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in searchConsole" :key="row.keys[0]">
                    <td>{{ row.keys[0] }}</td>
                    <td class="text-right">{{ row.clicks }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps(['propertyId', 'siteUrl']);

const loading = ref(true);
const error = ref(null);
const startDate = ref(new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

const overview = ref({});
const diffs = ref({});
const searchConsole = ref([]);
const chartCanvas = ref(null);
let chartInstance = null;

const labels = {
  users: 'Uživatelé',
  sessions: 'Návštěvy',
  bounceRate: 'Míra opuštění',
  pageViews: 'Zobrazení stránek'
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await fetch(`/admin/analytics/get-data?propertyId=${props.propertyId}&siteUrl=${props.siteUrl}&startDate=${startDate.value}&endDate=${endDate.value}`);
    const data = await res.json();
    
    if (!data.success) throw new Error(data.error);

    overview.value = data.analytics.current;
    searchConsole.value = data.searchConsole || [];
    
    // Výpočet rozdílů
    if (data.analytics.previous) {
      for (const k in overview.value) {
        if (typeof overview.value[k] === 'number' && data.analytics.previous[k] > 0) {
          diffs.value[k] = Math.round(((overview.value[k] - data.analytics.previous[k]) / data.analytics.previous[k]) * 100);
        }
      }
    }

    loading.value = false;
    setTimeout(initChart, 0);
  } catch (e) {
    error.value = e.message;
    loading.value = false;
  }
};

const initChart = () => {
  if (chartInstance) chartInstance.destroy();
  if (!chartCanvas.value) return;

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: ['Před 30 dny', 'Před 15 dny', 'Dnes'], // Zjednodušeno pro ukázku
      datasets: [{
        label: 'Uživatelé',
        data: [120, 150, 180], // V reálném PHP byste poslali pole trendu
        borderColor: '#007bff',
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(0, 123, 255, 0.1)'
      }]
    }
  });
};

const getDiffClass = (k) => {
  const val = diffs.value[k];
  if (k === 'bounceRate') return val > 0 ? 'text-danger' : 'text-success';
  return val > 0 ? 'text-success' : 'text-danger';
};

onMounted(fetchData);
</script>

<style scoped>
.analytics-dashboard { padding: 20px; }
.card { border-radius: 10px; border: none; }
.card-header { border-bottom: 1px solid #eee; }
</style>
