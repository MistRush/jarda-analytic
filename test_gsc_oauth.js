const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testGSCOAuth() {
  const TOKEN_PATH = path.join(__dirname, 'oauth_token.json');
  const CLIENT_SECRET_PATH = path.join(__dirname, 'client_secret.json');

  const credentials = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:4567/callback');
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(token);

  const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

  const siteUrl = 'https://www.escapegame.cz/'; 

  try {
    console.log(`Querying GSC for ${siteUrl} using OAuth2...`);
    const res = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: '2026-04-01',
        endDate: '2026-05-01',
        dimensions: ['query'],
        rowLimit: 5
      }
    });
    console.log('✅ Success! Data found:', res.data.rows);
  } catch (err) {
    console.error('❌ Error:', err.message);
    
    // Try domain variant
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
      console.log('✅ Success (domain)! Data found:', res.data.rows);
    } catch (err2) {
      console.error('❌ Error (domain):', err2.message);
    }
  }
}

testGSCOAuth();
