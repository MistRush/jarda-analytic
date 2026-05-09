/**
 * setup_oauth.js
 * 
 * Tento skript tě jednou přihlásí přes Google (jako ty = vlastník GA4)
 * a pak automaticky přidá Service Account jako Prohlížeče do GA4 property.
 * 
 * Spuštění: node setup_oauth.js <PROPERTY_ID>
 * Příklad:  node setup_oauth.js 57151035
 * 
 * POTŘEBUJEŠ:
 * 1. V Google Cloud Console vytvořit OAuth 2.0 Client ID (typ: Desktop app)
 * 2. Stáhnout client_secret.json a dát ho sem do složky
 */

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PROPERTY_ID = process.argv[2];
if (!PROPERTY_ID) {
  console.error('Použití: node setup_oauth.js <PROPERTY_ID>');
  console.error('Příklad: node setup_oauth.js 57151035');
  process.exit(1);
}

const CLIENT_SECRET_PATH = path.join(__dirname, 'client_secret.json');
const TOKEN_PATH = path.join(__dirname, 'oauth_token.json');
const SERVICE_ACCOUNT_EMAIL = require('./credentials.json').client_email;

if (!fs.existsSync(CLIENT_SECRET_PATH)) {
  console.error('\n❌ Soubor client_secret.json nenalezen!');
  console.error('\nPostup jak ho získat:');
  console.error('1. Jdi na https://console.cloud.google.com/apis/credentials?project=jarda-analytic');
  console.error('2. Klikni "+ CREATE CREDENTIALS" → "OAuth client ID"');
  console.error('3. Application type: "Desktop app"');
  console.error('4. Název: "CMS Analytics Setup"');
  console.error('5. Klikni "Download JSON" a ulož jako client_secret.json do této složky');
  process.exit(1);
}

const clientSecretData = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH));
const { client_id, client_secret, redirect_uris } = clientSecretData.installed || clientSecretData.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  'http://localhost:4567/callback'
);

// Scopy potřebné pro přidání uživatele do GA4
const SCOPES = [
  'https://www.googleapis.com/auth/analytics.manage.users',
  'https://www.googleapis.com/auth/analytics.readonly',
];

async function addServiceAccountToProperty(auth) {
  const analyticsAdmin = google.analyticsadmin({ version: 'v1alpha', auth });
  
  console.log(`\nPřidávám ${SERVICE_ACCOUNT_EMAIL} do property ${PROPERTY_ID}...`);
  
  try {
    const result = await analyticsAdmin.properties.accessBindings.create({
      parent: `properties/${PROPERTY_ID}`,
      requestBody: {
        user: SERVICE_ACCOUNT_EMAIL,
        roles: ['predefinedRoles/viewer'],
      },
    });
    
    console.log('\n✅ Service Account úspěšně přidán do Google Analytics!');
    console.log('   Email:', SERVICE_ACCOUNT_EMAIL);
    console.log('   Property:', PROPERTY_ID);
    console.log('   Role: Prohlížeč (Viewer)');
    console.log('\n🚀 Teď můžeš spustit: node server.js');
  } catch (err) {
    if (err.code === 409) {
      console.log('\n✅ Service Account je už přidán do této property (conflict = již existuje).');
    } else {
      console.error('\n❌ Chyba:', err.message);
      if (err.code === 403) {
        console.error('   → Přihlášený účet nemá administrátorská práva k této GA4 property.');
      }
    }
  }
}

async function getTokenAndRun() {
  // Pokud máme uložený token, použijeme ho
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oauth2Client.setCredentials(token);
    console.log('✅ Používám uložený OAuth token.');
    return addServiceAccountToProperty(oauth2Client);
  }

  // Jinak spustíme OAuth flow
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\n📌 Otevři tento odkaz v prohlížeči a přihlaš se:');
  console.log('\n' + authUrl + '\n');
  
  // Otevři automaticky
  try {
    const open = (await import('open')).default;
    await open(authUrl);
  } catch(e) {}

  // Spusť lokální server pro callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const params = new url.URL(req.url, 'http://localhost:4567').searchParams;
      const code = params.get('code');
      
      if (!code) {
        res.end('Chyba: Chybí auth kód.');
        return;
      }

      res.end('<h2>✅ Přihlášení úspěšné! Zavři toto okno a sleduj terminál.</h2>');
      server.close();

      try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('✅ OAuth token uložen.');
        await addServiceAccountToProperty(oauth2Client);
        resolve();
      } catch (err) {
        reject(err);
      }
    });

    server.listen(4567, () => {
      console.log('⏳ Čekám na přihlášení... (lokální server na portu 4567)');
    });
  });
}

getTokenAndRun().catch(console.error);
