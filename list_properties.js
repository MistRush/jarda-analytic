const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_SECRET_PATH = path.join(__dirname, 'client_secret.json');
const TOKEN_PATH = path.join(__dirname, 'oauth_token.json');

async function listProperties() {
  const clientSecretData = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH));
  const { client_id, client_secret } = clientSecretData.installed || clientSecretData.web;
  
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(token);

  const analyticsAdmin = google.analyticsadmin({ version: 'v1alpha', auth: oauth2Client });

  try {
    console.log('Načítám tvé účty a properties z Google Analytics...\n');
    const accountsRes = await analyticsAdmin.accounts.list();
    const accounts = accountsRes.data.accounts || [];

    for (const account of accounts) {
      console.log(`Účet: ${account.displayName} (${account.name})`);
      
      const propertiesRes = await analyticsAdmin.properties.list({ filter: `parent:${account.name}` });
      const properties = propertiesRes.data.properties || [];
      
      for (const prop of properties) {
        console.log(`  -> Property: ${prop.displayName} (ID: ${prop.name.replace('properties/', '')})`);
      }
      console.log('---');
    }
  } catch (err) {
    console.error('Chyba:', err.message);
  }
}

listProperties();
