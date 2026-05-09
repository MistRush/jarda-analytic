require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Google Analytics Data API client
// Autentifikace přes credentials.json (Service Account)
// ============================================================
function getAnalyticsClient() {
  if (process.env.GOOGLE_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    return new BetaAnalyticsDataClient({ credentials });
  }

  const keyPath = path.join(__dirname, 'credentials.json');
  const fs = require('fs');
  if (!fs.existsSync(keyPath)) {
    throw new Error('credentials.json nenalezen. Přidej soubor s klíčem Service Accountu nebo ENV proměnnou GOOGLE_CREDENTIALS.');
  }
  return new BetaAnalyticsDataClient({ keyFilename: keyPath });
}

// ============================================================
const apiRouter = express.Router();

apiRouter.get('/analytics', async (req, res) => {
  const { propertyId, startDate, endDate } = req.query;

  if (!propertyId) {
    return res.status(400).json({ error: 'Chybí propertyId parametr' });
  }

  try {
    const analyticsClient = getAnalyticsClient();
    
    const currentStart = new Date(startDate || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]);
    const currentEnd = new Date(endDate || new Date().toISOString().split('T')[0]);
    const diffTime = Math.abs(currentEnd - currentStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const prevEnd = new Date(currentStart.getTime() - 86400000);
    const prevStart = new Date(prevEnd.getTime() - (diffDays * 86400000));

    const fmtDate = d => d.toISOString().split('T')[0];
    const dateRanges = [
      { startDate: fmtDate(currentStart), endDate: fmtDate(currentEnd) },
      { startDate: fmtDate(prevStart), endDate: fmtDate(prevEnd) }
    ];

    // 1. ZÁKLADNÍ METRIKY (OVERVIEW)
    const [overviewResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges,
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'screenPageViews' },
        { name: 'newUsers' },
        { name: 'ecommercePurchases' },
        { name: 'purchaseRevenue' }
      ],
    });

    // 2. DENNÍ TRENDY (GRAF s porovnáním)
    const [trendResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges,
      dimensions: [{ name: 'nthDay' }, { name: 'date' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ dimension: { dimensionName: 'nthDay' }, desc: false }]
    });

    // 3. ZAŘÍZENÍ (Donut graf)
    const [deviceResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRanges[0]],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }]
    });

    // 4. ZDROJE NÁVŠTĚVNOSTI (Akvizice)
    const [sourcesResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRanges[0]],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [
        { name: 'sessions' },
        { name: 'engagedSessions' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
        { name: 'eventsPerSession' },
        { name: 'eventCount' },
        { name: 'conversions' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10
    });

    // 5. TOP STRÁNKY
    const [pagesResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRanges[0]],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });

    // 6. GEOGRAFIE
    const [geoResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRanges[0]],
      dimensions: [{ name: 'country' }, { name: 'city' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 8,
    });

    // 7. REALTIME
    const [rtResponse] = await analyticsClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: 'activeUsers' }],
    });

    // Zpracování dat
    const getMetrics = (idx) => overviewResponse.rows[idx]?.metricValues.map(m => m.value) || [];
    const currentOverview = getMetrics(0);
    const prevOverview = getMetrics(1);

    const trendDataCurrent = [];
    const trendDataPrevious = [];
    const trendLabels = [];

    const trendRows = trendResponse.rows || [];
    trendRows.forEach(row => {
      const nthDay = parseInt(row.dimensionValues[0].value);
      const dateStr = row.dimensionValues[1].value;
      const dateRangeId = row.dimensionValues[2].value;
      const val = parseInt(row.metricValues[0].value);

      if (!trendLabels[nthDay]) {
        trendLabels[nthDay] = `${dateStr.substring(6,8)}. ${dateStr.substring(4,6)}.`;
      }

      if (dateRangeId === 'date_range_0') {
        trendDataCurrent[nthDay] = val;
      } else if (dateRangeId === 'date_range_1') {
        trendDataPrevious[nthDay] = val;
      }
    });

    // Zajištění, že pole nemají díry
    for(let i = 0; i <= diffDays; i++) {
      if(trendDataCurrent[i] === undefined) trendDataCurrent[i] = 0;
      if(trendDataPrevious[i] === undefined) trendDataPrevious[i] = 0;
      if(!trendLabels[i]) trendLabels[i] = `Den ${i+1}`;
    }

    const response = {
      propertyId,
      startDate: dateRanges[0].startDate,
      endDate: dateRanges[0].endDate,
      prevStartDate: dateRanges[1].startDate,
      prevEndDate: dateRanges[1].endDate,
      overview: {
        totalUsers: parseInt(currentOverview[0] || 0),
        sessions: parseInt(currentOverview[1] || 0),
        bounceRate: (parseFloat(currentOverview[2] || 0) * 100).toFixed(1),
        avgSessionDuration: currentOverview[3],
        pageViews: parseInt(currentOverview[4] || 0),
        newUsers: parseInt(currentOverview[5] || 0),
        purchases: parseInt(currentOverview[6] || 0),
        revenue: parseFloat(currentOverview[7] || 0).toFixed(2),
      },
      prevOverview: {
        totalUsers: parseInt(prevOverview[0] || 0),
        sessions: parseInt(prevOverview[1] || 0),
        bounceRate: (parseFloat(prevOverview[2] || 0) * 100).toFixed(1),
        avgSessionDuration: prevOverview[3],
        pageViews: parseInt(prevOverview[4] || 0),
        newUsers: parseInt(prevOverview[5] || 0),
        purchases: parseInt(prevOverview[6] || 0),
        revenue: parseFloat(prevOverview[7] || 0).toFixed(2),
      },
      trend: {
        labels: trendLabels,
        current: trendDataCurrent,
        previous: trendDataPrevious
      },
      devices: deviceResponse.rows.map(r => ({
        device: r.dimensionValues[0].value,
        sessions: parseInt(r.metricValues[0].value)
      })),
      sources: sourcesResponse.rows.map(r => ({
        channel: r.dimensionValues[0].value,
        sessions: parseInt(r.metricValues[0].value),
        engagedSessions: parseInt(r.metricValues[1].value),
        engagementRate: parseFloat(r.metricValues[2].value * 100).toFixed(2),
        avgDuration: parseInt(r.metricValues[3].value),
        eventsPerSession: parseFloat(r.metricValues[4].value).toFixed(2),
        eventCount: parseInt(r.metricValues[5].value),
        conversions: parseInt(r.metricValues[6].value)
      })),
      topPages: pagesResponse.rows.map(r => ({
        path: r.dimensionValues[0].value,
        views: parseInt(r.metricValues[0].value)
      })),
      geo: geoResponse.rows.map(r => ({
        country: r.dimensionValues[0].value,
        city: r.dimensionValues[1].value,
        sessions: parseInt(r.metricValues[0].value)
      })),
      realtime: {
        activeUsers: parseInt(rtResponse.rows[0]?.metricValues[0]?.value || 0)
      }
    };

    res.json(response);
  } catch (err) {
    console.error('GA API chyba:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);

// Fallback – vrátí index.html pro SPA
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`✅ JARDA Analytic běží na http://localhost:${PORT}`);
  });
}

module.exports = app;
