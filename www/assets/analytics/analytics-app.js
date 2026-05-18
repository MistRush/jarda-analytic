/**
 * JARDA Analytics – Vue 3 Dashboard
 * Varianta A: PHP injektuje data přes window.__DATA__
 */

const { createApp, ref, computed } = Vue;
const COLORS = ['#24c586', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6', '#1abc9c', '#e67e22', '#16a085'];

function fmt(n) {
    if (n === undefined || n === null) return '0';
    return Number(n).toLocaleString('cs-CZ');
}
function dateStr(d) { return d.toISOString().slice(0, 10); }

function getPresets() {
    const now = new Date(), today = dateStr(now);
    const yd = new Date(now); yd.setDate(now.getDate() - 1);
    const w7 = new Date(now); w7.setDate(now.getDate() - 6);
    const fm = new Date(now.getFullYear(), now.getMonth(), 1);
    const lm = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const flm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const llm = new Date(now.getFullYear(), now.getMonth(), 0);
    return [
        { label: 'Dnes',             startDate: today,           endDate: today },
        { label: 'Včera',            startDate: dateStr(yd),     endDate: dateStr(yd) },
        { label: 'Posledních 7 dní', startDate: dateStr(w7),     endDate: today },
        { label: 'Tento měsíc',      startDate: dateStr(fm),     endDate: dateStr(lm) },
        { label: 'Minulý měsíc',     startDate: dateStr(flm),    endDate: dateStr(llm) },
    ];
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
const MetricCard = {
    props: ['label', 'value', 'diff', 'prefix', 'suffix', 'period'],
    methods: { fmt },
    template: `
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body py-3">
                <h6 class="text-muted text-uppercase x-small mb-1 font-weight-bold">{{ label }}</h6>
                <div class="d-flex align-items-baseline">
                    <h3 class="mb-0 mr-2">{{ prefix }}{{ fmt(value) }}{{ suffix }}</h3>
                    <span v-if="diff !== null && diff !== undefined"
                          :class="['small font-weight-bold', diff > 0 ? 'text-success' : 'text-danger']">
                        <i :class="['fa', diff > 0 ? 'fa-caret-up' : 'fa-caret-down']"></i>
                        {{ Math.abs(diff) }}%
                    </span>
                </div>
                <div v-if="period" class="mt-1" style="font-size:11px;color:#aaa;">{{ period }}</div>
            </div>
        </div>`
};

// ─── RealtimeCard ─────────────────────────────────────────────────────────────
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
                data: { labels: Array(30).fill(''), datasets: [{ data: this.realtime.trend,
                    borderColor: '#24c586', borderWidth: 2, pointRadius: 0, fill: true,
                    backgroundColor: 'rgba(36,197,134,0.2)', tension: 0.4 }] },
                options: { responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { display: false } } }
            });
        }
    },
    template: `
        <div class="card border-0 shadow-sm h-100 overflow-hidden" style="background:#1a1a1a;color:#fff;">
            <div class="card-body position-relative" style="z-index:2;">
                <h6 class="text-uppercase x-small mb-2 font-weight-bold" style="opacity:.7;">Uživatelé právě teď</h6>
                <div class="d-flex align-items-baseline">
                    <h2 class="mb-0 mr-2" style="font-size:3rem;">{{ realtime?.activeUsers ?? 0 }}</h2>
                    <span class="small badge badge-success py-1 px-2"><i class="fa fa-users mr-1"></i> ŽIVĚ</span>
                </div>
                <p class="small mb-0 mt-2" style="color:#888;">Aktivních za posledních 5 min: <strong>{{ realtime?.active5min ?? 0 }}</strong></p>
            </div>
            <div class="position-absolute w-100" style="bottom:0;left:0;height:50%;opacity:0.3;z-index:1;">
                <canvas ref="rtCanvas"></canvas>
            </div>
        </div>`
};

// ─── TrendChart ───────────────────────────────────────────────────────────────
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
                data: { labels: t.labels || [], datasets: [
                    { label: 'Aktuální období', data: t.current || [],
                      borderColor: '#24c586', backgroundColor: 'rgba(36,197,134,0.1)',
                      borderWidth: 3, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#24c586' },
                    { label: 'Předchozí období', data: t.previous || [],
                      borderColor: '#dee2e6', borderDash: [5,5], borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0 }
                ]},
                options: { responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', align: 'end' } },
                    scales: { y: { beginAtZero: true, grid: { borderDash: [5,5], color: '#f0f0f0' } },
                              x: { grid: { display: false } } } }
            });
        }
    },
    template: `<div style="height:350px;"><canvas ref="canvas"></canvas></div>`
};

// ─── DonutChart ───────────────────────────────────────────────────────────────
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
                data: { labels: this.items.map(d => d[this.labelKey]),
                    datasets: [{ data: this.items.map(d => d[this.valueKey]),
                        backgroundColor: COLORS, borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' },
                        tooltip: { callbacks: { label: ctx => {
                            const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
                            const pct = total ? Math.round(ctx.raw / total * 100) : 0;
                            return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
                        }}}},
                    cutout: '70%' }
            });
        }
    },
    template: `<div style="height:250px;"><canvas ref="canvas"></canvas></div>`
};

// ─── HBarChart ────────────────────────────────────────────────────────────────
const HBarChart = {
    props: ['items', 'labelKey', 'valueKey', 'color'],
    mounted() { this.initChart(); },
    methods: {
        initChart() {
            const canvas = this.$refs.canvas;
            if (!canvas || !this.items?.length) return;
            if (this._chart) this._chart.destroy();
            const total = this.items.reduce((s, d) => s + d[this.valueKey], 0);
            this._chart = new Chart(canvas.getContext('2d'), {
                type: 'bar',
                data: { labels: this.items.map(d => d[this.labelKey]),
                    datasets: [{ label: 'Návštěvy', data: this.items.map(d => d[this.valueKey]),
                        backgroundColor: this.color || '#3498db', borderRadius: 5 }] },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false },
                        tooltip: { callbacks: { label: ctx => {
                            const pct = total ? Math.round(ctx.raw / total * 100) : 0;
                            return ` ${ctx.raw} (${pct}%)`;
                        }}}},
                    scales: { x: { display: false }, y: { grid: { display: false } } } }
            });
        }
    },
    template: `<div style="height:250px;"><canvas ref="canvas"></canvas></div>`
};

// ─── PercentBar – řádek s progress barem pro tabulky ─────────────────────────
const PercentBar = {
    props: ['value', 'max', 'color'],
    computed: {
        pct() { return this.max > 0 ? Math.round(this.value / this.max * 100) : 0; }
    },
    template: `
        <div style="display:flex;align-items:center;gap:6px;">
            <div style="flex:1;background:#f0f0f0;border-radius:3px;height:6px;min-width:40px;">
                <div :style="'width:' + pct + '%;background:' + (color||'#24c586') + ';height:100%;border-radius:3px;'"></div>
            </div>
            <span style="font-size:11px;color:#888;min-width:32px;">{{ pct }}%</span>
        </div>`
};

// ─── DataTable ────────────────────────────────────────────────────────────────
const DataTable = {
    components: { PercentBar },
    props: ['rows', 'columns', 'emptyText'],
    methods: { fmt },
    template: `
        <div class="table-responsive">
            <table class="table table-sm table-hover mb-0">
                <thead v-if="columns.some(c => c.label)" class="bg-light">
                    <tr>
                        <th v-for="col in columns" :key="col.key"
                            class="border-0 small text-uppercase"
                            :class="col.align === 'right' ? 'text-right pr-3' : 'pl-3'">{{ col.label }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!rows || !rows.length">
                        <td :colspan="columns.length" class="text-center py-4 text-muted small">{{ emptyText || 'Žádná data' }}</td>
                    </tr>
                    <tr v-for="(row, i) in rows" :key="i">
                        <td v-for="col in columns" :key="col.key" class="py-2"
                            :class="col.align === 'right' ? 'text-right pr-3 font-weight-bold' : 'pl-3 small'">
                            <template v-if="col.pctBar">
                                <percent-bar :value="row[col.key]" :max="col.pctMax(rows)" :color="col.color" />
                            </template>
                            <template v-else-if="col.code">
                                <code class="text-primary" :title="row[col.key]"
                                      style="white-space:nowrap;overflow:hidden;display:block;max-width:180px;">{{ row[col.key] }}</code>
                            </template>
                            <template v-else-if="col.format === 'number'">{{ fmt(row[col.key]) }}</template>
                            <template v-else-if="col.format === 'pct'">{{ row[col.key] }}%</template>
                            <template v-else-if="col.render"><span v-html="col.render(row)"></span></template>
                            <template v-else>{{ row[col.key] }}</template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`
};

// ─── ROOT aplikace ────────────────────────────────────────────────────────────
const AnalyticsApp = {
    components: { MetricCard, RealtimeCard, TrendChart, DonutChart, HBarChart, DataTable },

    setup() {
        const d = window.__DATA__ || {};

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
        const newReturning  = ref(d.newReturning || []);
        const landingPages  = ref(d.landingPages || []);

        const periodLabel = computed(() => {
            if (!startDate.value || !endDate.value) return '';
            const f = s => s.split('-').reverse().join('.');
            return f(startDate.value) + ' – ' + f(endDate.value);
        });

        const presets = getPresets();
        function activePreset(p) {
            return p.startDate === startDate.value && p.endDate === endDate.value;
        }

        const metricDefs = [
            { key: 'users',       label: 'Uživatelé',         suffix: '' },
            { key: 'sessions',    label: 'Návštěvy',          suffix: '' },
            { key: 'pageViews',   label: 'Zobrazení stránek', suffix: '' },
            { key: 'newUsers',    label: 'Noví uživatelé',    suffix: '' },
            { key: 'bounceRate',  label: 'Míra opuštění',     suffix: '%' },
            { key: 'avgDuration', label: 'Prům. doba na webu',suffix: '' },
        ];

        // Sloupce: Top stránky + % progress bar
        const pageColumns = [
            { key: 'path',  label: 'Stránka',    code: true },
            { key: 'views', label: 'Zobrazení',  align: 'right', format: 'number' },
            { key: 'views', label: '%',           pctBar: true, color: '#24c586',
              pctMax: rows => Math.max(...rows.map(r => r.views)) },
        ];

        // Sloupce: Zdroje + % bar
        const sourceColumns = [
            { key: 'channel',  label: 'Kanál' },
            { key: 'sessions', label: 'Návštěvy', align: 'right', format: 'number' },
            { key: 'sessions', label: '%',         pctBar: true, color: '#3498db',
              pctMax: rows => rows.reduce((s, r) => s + r.sessions, 0) },
        ];

        // Geografie
        const geoColumns = [
            { key: 'city',     label: 'Město',    render: r => `<span class="text-muted mr-1">${r.country}</span>${r.city}` },
            { key: 'sessions', label: 'Návštěvy', align: 'right', format: 'number' },
            { key: 'sessions', label: '%',         pctBar: true, color: '#9b59b6',
              pctMax: rows => rows.reduce((s, r) => s + r.sessions, 0) },
        ];

        // Landing pages
        const landingColumns = [
            { key: 'path',       label: 'Vstupní stránka', code: true },
            { key: 'sessions',   label: 'Relací',          align: 'right', format: 'number' },
            { key: 'bounceRate', label: 'Bounce',          align: 'right', format: 'pct' },
            { key: 'sessions',   label: '%',               pctBar: true, color: '#f1c40f',
              pctMax: rows => rows.reduce((s, r) => s + r.sessions, 0) },
        ];

        // GSC – rozšířené sloupce
        const gscColumns = [
            { key: 'query',       label: 'Dotaz',      render: r => r.keys?.[0] || '' },
            { key: 'clicks',      label: 'Kliky',      align: 'right', format: 'number' },
            { key: 'impressions', label: 'Imprese',    align: 'right', format: 'number' },
            { key: 'ctr',         label: 'CTR',        align: 'right', format: 'pct' },
            { key: 'position',    label: 'Pozice',     align: 'right' },
            { key: 'clicks',      label: '%',           pctBar: true, color: '#e74c3c',
              pctMax: rows => rows.reduce((s, r) => s + r.clicks, 0) },
        ];

        // Nový vs Vracející – donut label
        const nvrLabelKey = 'type';
        const nvrValueKey = 'value';

        return {
            error, overview, trend, devices, sources, topPages, geo,
            browsers, screens, realtime, searchConsole, diffs,
            startDate, endDate, periodLabel, presets, activePreset,
            newReturning, landingPages,
            metricDefs, pageColumns, sourceColumns, geoColumns,
            landingColumns, gscColumns, nvrLabelKey, nvrValueKey, fmt
        };
    },

    template: `
    <div class="analytics-dashboard p-4">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap" style="gap:8px;">
            <h1 class="h3 mb-0"><i class="fa fa-chart-line mr-2"></i> JARDA Analytics</h1>
            <div class="d-flex align-items-center flex-wrap" style="gap:6px;">
                <a v-for="p in presets" :key="p.label"
                   :href="'?startDate=' + p.startDate + '&endDate=' + p.endDate"
                   :class="['btn btn-sm', activePreset(p) ? 'btn-primary' : 'btn-outline-secondary']"
                   style="font-size:12px;">{{ p.label }}</a>
            </div>
            <form method="get" class="bg-white p-2 rounded shadow-sm border d-flex align-items-center" style="gap:8px;">
                <input type="date" name="startDate" v-model="startDate" class="form-control form-control-sm">
                <input type="date" name="endDate"   v-model="endDate"   class="form-control form-control-sm">
                <button type="submit" class="btn btn-primary btn-sm"><i class="fa fa-sync-alt mr-1"></i> Použít</button>
            </form>
        </div>

        <!-- Chyba -->
        <div v-if="error" class="alert alert-warning mb-4" style="border-left:4px solid #ffc107;">
            <i class="fa fa-exclamation-triangle mr-2"></i><strong>Informace:</strong> {{ error }}
        </div>

        <!-- Řada 1: Realtime + karty -->
        <div class="row mb-4">
            <div class="col-md-3 mb-3"><realtime-card :realtime="realtime" /></div>
            <div class="col-md-9">
                <div class="row">
                    <div class="col-md-4 mb-3" v-for="m in metricDefs" :key="m.key">
                        <metric-card :label="m.label" :value="overview.current?.[m.key]"
                                     :diff="diffs[m.key]" :suffix="m.suffix" :period="periodLabel" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Řada 2: Trend + Zdroje -->
        <div class="row">
            <div class="col-md-8 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Trend návštěvnosti</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body"><trend-chart :trend="trend" /></div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Akvizice (Zdroje)</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="sources" :columns="sourceColumns" empty-text="Žádná data" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Řada 3: Zařízení + Nový vs Vracející + Landing pages -->
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Zařízení</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body">
                        <donut-chart :items="devices" label-key="device" value-key="value" />
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Nový vs Vracející</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body">
                        <donut-chart :items="newReturning" :label-key="nvrLabelKey" :value-key="nvrValueKey" />
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Vstupní stránky</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="landingPages" :columns="landingColumns" empty-text="Žádná data" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Řada 4: Top stránky + GSC dotazy -->
        <div class="row">
            <div class="col-md-5 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Top stránky</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="topPages" :columns="pageColumns" />
                    </div>
                </div>
            </div>
            <div class="col-md-7 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Hledané dotazy (GSC)</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="searchConsole" :columns="gscColumns" empty-text="Přidejte analytic.evidsoft@gmail.com do Search Console" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Řada 5: Geografie + Prohlížeče + Rozlišení -->
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Lokalita (Města)</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body p-0">
                        <data-table :rows="geo" :columns="geoColumns" />
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Prohlížeče</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body">
                        <h-bar-chart :items="browsers" label-key="browser" value-key="value" color="#3498db" />
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-weight-bold">Rozlišení obrazovky</h5>
                        <small class="text-muted">{{ periodLabel }}</small>
                    </div>
                    <div class="card-body">
                        <h-bar-chart :items="screens" label-key="resolution" value-key="value" color="#9b59b6" />
                    </div>
                </div>
            </div>
        </div>

    </div>`
};

createApp(AnalyticsApp).mount('#analytics-app');
