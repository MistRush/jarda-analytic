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
  const keyPath = path.join(__dirname, 'credentials.json');
  const fs = require('fs');
  if (!fs.existsSync(keyPath)) {
    throw new Error('credentials.json nenalezen. Přidej soubor s klíčem Service Accountu.');
  }
  return new BetaAnalyticsDataClient({ keyFilename: keyPath });
}

// ============================================================
// GET /api/analytics?propertyId=XXXXXX&days=30
// Vrací základní metriky pro daný property ID
// Každý web vidí JEN svá data – propertyId se předává explicitně
// ============================================================
app.get('/api/analytics', async (req, res) => {
  const { propertyId, startDate, endDate } = req.query;

  if (!propertyId) {
    return res.status(400).json({ error: 'Chybí propertyId parametr' });
  }

  try {
    const analyticsClient = getAnalyticsClient();
    const dateRange = { 
      startDate: startDate || '30daysAgo', 
      endDate: endDate || 'today' 
    };

    // Paralelní dotazy pro rychlost
    const [overviewRes, pagesRes, sourcesRes, devicesRes, trendRes, geoRes, realtimeRes] = await Promise.all([
      // 1. Přehled (Users, Sessions, Bounce Rate, Avg Session Duration) + Ecommerce
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
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
      }),

      // 2. TOP stránky
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),

      // 3. Zdroje návštěvnosti (Specifičtější: sourceMedium místo channelGroup)
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),

      // 4. Zařízení
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }],
      }),

      // 5. Denní trend
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
      }),
      
      // 6. Geografie (Města a Státy)
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'country' }, { name: 'city' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8,
      }),

      // 7. Realtime uživatelé (Posledních 30 minut)
      analyticsClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      })
    ]);

    // Zpracování odpovědí
    const overview = overviewRes[0]?.rows?.[0]?.metricValues || [];
    const formatSeconds = (s) => {
      const sec = Math.round(parseFloat(s));
      const m = Math.floor(sec / 60);
      const r = sec % 60;
      return `${m}m ${r}s`;
    };

    const response = {
      propertyId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      overview: {
        totalUsers: parseInt(overview[0]?.value || 0),
        sessions: parseInt(overview[1]?.value || 0),
        bounceRate: (parseFloat(overview[2]?.value || 0) * 100).toFixed(1),
        avgSessionDuration: formatSeconds(overview[3]?.value || 0),
        pageViews: parseInt(overview[4]?.value || 0),
        newUsers: parseInt(overview[5]?.value || 0),
        purchases: parseInt(overview[6]?.value || 0),
        revenue: parseFloat(overview[7]?.value || 0).toFixed(2),
      },
      realtime: {
        activeUsers: parseInt(realtimeRes[0]?.rows?.[0]?.metricValues?.[0]?.value || 0),
      },
      topPages: (pagesRes[0]?.rows || []).map(row => ({
        path: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value),
        users: parseInt(row.metricValues[1].value),
      })),
      sources: (sourcesRes[0]?.rows || []).map(row => ({
        channel: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value),
        users: parseInt(row.metricValues[1].value),
      })),
      devices: (devicesRes[0]?.rows || []).map(row => ({
        device: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value),
      })),
      trend: (trendRes[0]?.rows || []).map(row => ({
        date: row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
      })),
      geo: (geoRes[0]?.rows || []).map(row => ({
        country: row.dimensionValues[0].value,
        city: row.dimensionValues[1].value,
        sessions: parseInt(row.metricValues[0].value),
      }))
    };

    res.json(response);
  } catch (err) {
    console.error('GA API chyba:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Fallback – vrátí index.html pro SPA
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ JARDA Analytic běží na http://localhost:${PORT}`);
});
