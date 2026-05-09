const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

async function test() {
  const analyticsClient = new BetaAnalyticsDataClient({ keyFilename: path.join(__dirname, 'credentials.json') });
  const propertyId = '285638052';
  const dateRange = { startDate: '30daysAgo', endDate: 'today' };

  try {
    // 1. Realtime
    const [realtimeRes] = await analyticsClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: 'activeUsers' }],
    });
    console.log('Realtime:', realtimeRes.rows ? realtimeRes.rows[0].metricValues[0].value : 0);

    // 2. Ecommerce & Overview additions
    const [ecommerceRes] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      metrics: [
        { name: 'ecommercePurchases' },
        { name: 'purchaseRevenue' }
      ],
    });
    console.log('Ecommerce:', ecommerceRes.rows ? ecommerceRes.rows[0].metricValues.map(m => m.value) : '0');

    // 3. Geo
    const [geoRes] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      dimensions: [{ name: 'country' }, { name: 'city' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 5,
    });
    console.log('Geo:', geoRes.rows ? geoRes.rows.map(r => r.dimensionValues.map(d=>d.value).join(', ') + ': ' + r.metricValues[0].value) : []);

  } catch (err) {
    console.error('Chyba:', err.message);
  }
}
test();
