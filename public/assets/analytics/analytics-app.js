/**
 * JARDA Analytics – Vue 3 Dashboard
 *
 * Varianta A: PHP injektuje data přes window.__DATA__ (json_encode v Latte).
 * Vue je přečte a vykreslí – žádný AJAX, žádný fetch, žádné CDN.
 *
 * Knihovny jsou lokální: vue.global.prod.js + chart.min.js (složka /vendor/)
 *
 * Komponenty:
 *  MetricCard    – metriková karta s % změnou
 *  RealtimeCard  – živý počet uživatelů + mini sparkline
 *  TrendChart    – čárový graf (aktuální vs předchozí období)
 *  DonutChart    – koláčový graf (zařízení)
 *  HBarChart     – horizontální bar (prohlížeče, rozlišení)
 *  DataTable     – obecná tabulka (stránky, geo, zdroje, GSC)
 */

const { createApp, ref, onMounted, nextTick } = Vue;

// Barvy pro grafy
const COLORS = ['#24c586', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6', '#1abc9c'];

// Formátování čísla (např. 1234567 → "1 234 567" v češtině)
function fmt(n) {
    if (n === undefined || n === null) return '0';
    return Number(n).toLocaleString('cs-CZ');
}

// ─── Komponenta: MetricCard ───────────────────────────────────────────────────
const MetricCard = {
    props: ['label', 'value', 'diff', 'prefix', 'suffix'],
    methods: { fmt },
    template: `
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body py-3">
                <h6 class="text-muted text-uppercase x-small mb-1 font-weight-bold">{{ label }}</h6>
                <div class="d-flex align-items-baseline">
                    <h3 class="mb-0 mr-2">
                        {{ prefix }}{{ fmt(value) }}{{ suffix }}
                    </h3>
                    <span v-if="diff !== null && diff !== undefined"
                          :class="['small font-weight-bold', diff > 0 ? 'text-success' : 'text-danger']">
                        <i :class="['fa', diff > 0 ? 'fa-caret-up' : 'fa-caret-down']"></i>
                        {{ Math.abs(diff) }}%
                    </span>
                </div>
            </div>
        </div>
    `
};

// ─── Komponenta: RealtimeCard ─────────────────────────────────────────────────
const RealtimeCard = {
    props: ['realtime'],
    mounted() { this.initChart(); },
    methods: {
        initChart() {
            const canvas = this.$refs.rtCanvas;
            if (!canvas || !this.realtime?.trend?.length) return;
            if (this._chart) this._chart.destroy();
            this._chart = new Chart(canvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: Array(30).fill(''),
                    datasets: [{
                        data: this.realtime.trend,
                        borderColor: '#24c586', borderWidth: 2,
                        pointRadius: 0, fill: true,
                        backgroundColor: 'rgba(36,197,134,0.2)', tension: 0.4
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { display: false } }
                }
            });
        }
    },
    template: `
        <div class="card border-0 shadow-sm h-100 overflow-hidden" style="background:#1a1a1a; color:#fff;">
            <div class="card-body position-relative" style="z-index:2;">
                <h6 class="text-uppercase x-small mb-2 font-weight-bold" style="opacity:.7;">Uživatelé právě teď</h6>
                <div class="d-flex align-items-baseline">
                    <h2 class="mb-0 mr-2" style="font-size:3rem;">{{ realtime?.activeUsers ?? 0 }}</h2>
                    <span class="small badge badge-success py-1 px-2">
                        <i class="fa fa-users mr-1"></i> ŽIVĚ
                    </span>
                </div>
                <p class="small mb-0 mt-2" style="color:#888;">
                    Aktivních za posledních 5 min: <strong>{{ realtime?.active5min ?? 0 }}</strong>
                </p>
            </div>
            <div class="position-absolute w-100" style="bottom:0;left:0;height:50%;opacity:0.3;z-index:1;">
                <canvas ref="rtCanvas"></canvas>
            </div>
        </div>
    `
};

// ─── Komponenta: TrendChart ───────────────────────────────────────────────────
const TrendChart = {
    props: ['trend'],
    mounted() { this.initChart(); },
    methods: {
        initChart() {
            const canvas = this.$refs.canvas;
            if (!canvas) return;
            if (this._chart) this._chart.destroy();
            const t = this.trend || {};
            this._chart = new Chart(canvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: t.labels || [],
                    datasets: [
                        {
                            label: 'Aktuální období',
                            data: t.current || [],
                            borderColor: '#24c586', backgroundColor: 'rgba(36,197,134,0.1)',
                            borderWidth: 3, fill: true, tension: 0.4,
                            pointRadius: 4, pointBackgroundColor: '#24c586'
                        },
                        {
                            label: 'Předchozí období',
                            data: t.previous || [],
                            borderColor: '#dee2e6', borderDash: [5, 5],
                            borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', align: 'end' } },
                    scales: {
                        y: { beginAtZero: true, grid: { borderDash: [5, 5], color: '#f0f0f0' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    },
    template: `<div style="height:350px;"><canvas ref="canvas"></canvas></div>`
};

// ─── Komponenta: DonutChart ───────────────────────────────────────────────────
const DonutChart = {
    props: ['items', 'labelKey', 'valueKey'],
    mounted() { this.initChart(); },
    methods: {
        initChart() {
            const canvas = this.$refs.canvas;
            if (!canvas || !this.items?.length) return;
            if (this._chart) this._chart.destroy();
            this._chart = new Chart(canvas.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: this.items.map(d => d[this.labelKey]),
                    datasets: [{
                        data: this.items.map(d => d[this.valueKey]),
                        backgroundColor: COLORS, borderWidth: 0
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } },
                    cutout: '70%'
                }
            });
        }
    },
    template: `<div style="height:250px;"><canvas ref="canvas"></canvas></div>`
};

// ─── Komponenta: HBarChart (horizontální pruhový graf) ────────────────────────
const HBarChart = {
    props: ['items', 'labelKey', 'valueKey', 'color'],
    mounted() { this.initChart(); },
    methods: {
        initChart() {
            const canvas = this.$refs.canvas;
            if (!canvas || !this.items?.length) return;
            if (this._chart) this._chart.destroy();
            this._chart = new Chart(canvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: this.items.map(d => d[this.labelKey]),
                    datasets: [{
                        label: 'Návštěvy',
                        data: this.items.map(d => d[this.valueKey]),
                        backgroundColor: this.color || '#3498db',
                        borderRadius: 5
                    }]
                },
                options: {
                    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { grid: { display: false } } }
                }
            });
        }
    },
    template: `<div style="height:250px;"><canvas ref="canvas"></canvas></div>`
};

// ─── Komponenta: DataTable ────────────────────────────────────────────────────
const DataTable = {
    props: ['rows', 'columns', 'emptyText'],
    methods: { fmt },
    template: `
        <div class="table-responsive">
            <table class="table table-sm table-hover mb-0">
                <thead v-if="columns.some(c => c.label)" class="bg-light">
                    <tr>
                        <th v-for="col in columns" :key="col.key"
                            class="border-0 small text-uppercase"
                            :class="col.align === 'right' ? 'text-right pr-3' : 'pl-3'">
                            {{ col.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!rows || !rows.length">
                        <td :colspan="columns.length" class="text-center py-4 text-muted small">
                            {{ emptyText || 'Žádná data' }}
                        </td>
                    </tr>
                    <tr v-for="(row, i) in rows" :key="i">
                        <td v-for="col in columns" :key="col.key"
                            class="py-2"
                            :class="col.align === 'right' ? 'text-right pr-3 font-weight-bold' : 'pl-3 small'">
                            <template v-if="col.code">
                                <code class="text-primary" :title="row[col.key]"
                                      style="white-space:nowrap;overflow:hidden;display:block;max-width:200px;">
                                    {{ row[col.key] }}
                                </code>
                            </template>
                            <template v-else-if="col.format === 'number'">
                                {{ fmt(row[col.key]) }}
                            </template>
                            <template v-else-if="col.render">
                                <span v-html="col.render(row)"></span>
                            </template>
                            <template v-else>{{ row[col.key] }}</template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};

// ─── ROOT aplikace ────────────────────────────────────────────────────────────
const AnalyticsApp = {
    components: { MetricCard, RealtimeCard, TrendChart, DonutChart, HBarChart, DataTable },

    setup() {
        // PHP injektovalo window.__DATA__ = json_encode($data) v Latte šabloně
        const d = window.__DATA__ || {};

        // Nastavíme reaktivní stav přímo z PHP dat (žádný fetch, žádné čekání)
        const error         = ref(d.error || null);
        const overview      = ref(d.overview || {});
        const trend         = ref(d.trend || {});
        const devices       = ref(d.devices || []);
        const sources       = ref(d.sources || []);
        const topPages      = ref(d.topPages || []);
        const geo           = ref(d.geo || []);
        const browsers      = ref(d.browsers || []);
        const screens       = ref(d.screenResolutions || []);
        const realtime      = ref(d.realtime || {});
        const searchConsole = ref(d.searchConsole || []);
        const diffs         = ref(d.diffs || {});
        const startDate     = ref(d.startDate || '');
        const endDate       = ref(d.endDate || '');

        // Karty s metrikami
        const metricDefs = [
            { key: 'users',      label: 'Uživatelé',         suffix: '' },
            { key: 'sessions',   label: 'Návštěvy',          suffix: '' },
            { key: 'pageViews',  label: 'Zobrazení stránek', suffix: '' },
            { key: 'newUsers',   label: 'Noví uživatelé',    suffix: '' },
            { key: 'bounceRate', label: 'Míra opuštění',     suffix: '%' },
            { key: 'purchases',  label: 'Nákupy',            suffix: '' },
        ];

        // Definice sloupců pro jednotlivé tabulky
        const pageColumns = [
            { key: 'path',  label: 'Stránka',   code: true },
            { key: 'views', label: 'Zobrazení', align: 'right', format: 'number' },
        ];
        const sourceColumns = [
            { key: 'channel',  label: 'Kanál' },
            { key: 'sessions', label: 'Návštěvy', align: 'right', format: 'number' },
        ];
        const geoColumns = [
            { key: 'city',     label: 'Město',    render: r => `<span class="text-muted mr-1">${r.country}</span>${r.city}` },
            { key: 'sessions', label: 'Návštěvy', align: 'right', format: 'number' },
        ];
        const gscColumns = [
            { key: 'query',  label: 'Dotaz',    render: r => r.keys?.[0] || '' },
            { key: 'clicks', label: 'Kliknutí', align: 'right', format: 'number' },
        ];

        return {
            error, overview, trend, devices, sources, topPages, geo,
            browsers, screens, realtime, searchConsole, diffs,
            startDate, endDate,
            metricDefs, pageColumns, sourceColumns, geoColumns, gscColumns, fmt
        };
    },

    template: `
    <div class="analytics-dashboard p-4">

        <!-- Header: datepicker = klasický GET formulář → reload stránky s novými daty -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3"><i class="fa fa-chart-line mr-2"></i> JARDA Analytics</h1>
            <form method="get" class="bg-white p-2 rounded shadow-sm border d-flex align-items-center" style="gap:8px;">
                <input type="date" name="startDate" v-model="startDate" class="form-control form-control-sm">
                <input type="date" name="endDate"   v-model="endDate"   class="form-control form-control-sm">
                <button type="submit" class="btn btn-primary btn-sm">
                    <i class="fa fa-sync-alt mr-1"></i> Aktualizovat
                </button>
            </form>
        </div>

        <!-- Chybová hláška (nezastaví vykreslení ostatních dat) -->
        <div v-if="error" class="alert alert-warning mb-4" style="border-left:4px solid #ffc107;">
            <i class="fa fa-exclamation-triangle mr-2"></i>
            <strong>Informace:</strong> {{ error }}
        </div>

        <!-- Řada 1: Realtime karta + metrické karty -->
        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <realtime-card :realtime="realtime" />
            </div>
            <div class="col-md-9">
                <div class="row">
                    <div class="col-md-4 mb-3" v-for="m in metricDefs" :key="m.key">
                        <metric-card
                            :label="m.label"
                            :value="overview.current?.[m.key]"
                            :diff="diffs[m.key]"
                            :suffix="m.suffix"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Řada 2: Trend návštěvnosti + Akvizice -->
        <div class="row">
            <div class="col-md-8 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 font-weight-bold">Trend návštěvnosti (Sessions)</h5>
                    </div>
                    <div class="card-body">
                        <trend-chart :trend="trend" />
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 font-weight-bold">Akvizice (Zdroje)</h5>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="sources" :columns="sourceColumns" empty-text="Žádná data o zdrojích" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Řada 3: Zařízení + Top stránky + GSC dotazy -->
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 font-weight-bold">Zařízení</h5>
                    </div>
                    <div class="card-body">
                        <donut-chart :items="devices" label-key="device" value-key="value" />
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Top stránky</h5>
                        <span class="badge badge-light">TOP 15</span>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="topPages" :columns="pageColumns" />
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Hledané dotazy (GSC)</h5>
                        <span class="badge badge-info">Google</span>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="searchConsole" :columns="gscColumns" empty-text="Žádná data z vyhledávání" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Řada 4: Geografie + Prohlížeče + Rozlišení -->
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 font-weight-bold">Lokalita (Města)</h5>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="geo" :columns="geoColumns" />
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 font-weight-bold">Prohlížeče</h5>
                    </div>
                    <div class="card-body">
                        <h-bar-chart :items="browsers" label-key="browser" value-key="value" color="#3498db" />
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 font-weight-bold">Rozlišení obrazovky</h5>
                    </div>
                    <div class="card-body">
                        <h-bar-chart :items="screens" label-key="resolution" value-key="value" color="#9b59b6" />
                    </div>
                </div>
            </div>
        </div>

    </div>
    `
};

// Spuštění Vue aplikace na mount bod #analytics-app
createApp(AnalyticsApp).mount('#analytics-app');
