const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');
const fs = require('fs');

async function testMultipleDates() {
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
  const analyticsClient = new BetaAnalyticsDataClient({ credentials });
  const propertyId = '285638052';
  
  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: '14daysAgo', endDate: '7daysAgo' },
        { startDate: '7daysAgo', endDate: 'today' }
      ],
      dimensions: [{ name: 'nthDay' }, { name: 'date' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
      orderBys: [{ dimension: { dimensionName: 'nthDay' }, desc: false }]
    });

    console.log(JSON.stringify(response.rows, null, 2));
    
  } catch(e) {
    console.error(e);
  }
}
testMultipleDates();
