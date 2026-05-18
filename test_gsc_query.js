const { google } = require('googleapis');
const path = require('path');

async function testGSCQuery() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const siteUrl = 'https://www.escapegame.cz/'; // Zkusíme tuto variantu

  try {
    console.log(`Querying GSC for ${siteUrl}...`);
    const res = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: '2024-04-01',
        endDate: '2024-04-30',
        dimensions: ['query'],
        rowLimit: 5
      }
    });
    console.log('Data found:', res.data.rows);
  } catch (err) {
    console.error('Error with https://www.escapegame.cz/:', err.message);
    
    // Zkusíme sc-domain: variantu
    const domainUrl = 'sc-domain:escapegame.cz';
    try {
      console.log(`Querying GSC for ${domainUrl}...`);
      const res = await searchconsole.searchanalytics.query({
        siteUrl: domainUrl,
        requestBody: {
          startDate: '2024-04-01',
          endDate: '2024-04-30',
          dimensions: ['query'],
          rowLimit: 5
        }
      });
      console.log('Data found (domain):', res.data.rows);
    } catch (err2) {
      console.error('Error with sc-domain:escapegame.cz:', err2.message);
    }
  }
}

testGSCQuery();
