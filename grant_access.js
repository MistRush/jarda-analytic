/**
 * grant_access.js – přidá Service Account jako Prohlížeče do GA4 Property
 * Spusť: node grant_access.js <PROPERTY_ID>
 */

const { AnalyticsAdminServiceClient } = require('@google-analytics/admin');
const path = require('path');

const propertyId = process.argv[2];
if (!propertyId) {
  console.error('Použití: node grant_access.js <PROPERTY_ID>');
  process.exit(1);
}

async function main() {
  const client = new AnalyticsAdminServiceClient({
    keyFilename: path.join(__dirname, 'credentials.json'),
  });

  const email = require('./credentials.json').client_email;
  console.log('Email:', email);
  console.log('Property ID:', propertyId);

  // Vypíšeme dostupné metody pro diagnostiku
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(client))
    .filter(m => m.toLowerCase().includes('access') || m.toLowerCase().includes('user'))
    .slice(0, 10);
  console.log('\nDostupné metody (access/user):', methods);

  try {
    // GA4 Admin API v1beta - createAccessBinding
    const [result] = await client.createAccessBinding({
      parent: `accounts/~all`,
      accessBinding: {
        user: email,
        roles: ['predefinedRoles/viewer'],
      },
    });
    console.log('\n✅ Hotovo!', result);
  } catch (e1) {
    console.log('\n❌ createAccessBinding chyba:', e1.message);
    try {
      // Zkus na property level
      const [result] = await client.createAccessBinding({
        parent: `properties/${propertyId}`,
        accessBinding: {
          user: email,
          roles: ['predefinedRoles/viewer'],
        },
      });
      console.log('\n✅ Hotovo (property level)!', result);
    } catch (e2) {
      console.log('❌ Property level chyba:', e2.message);
      console.log('\n📌 Kód chyby:', e2.code);
      if (e2.code === 7) {
        console.log('\n👉 Řešení: Povol "Google Analytics Admin API" na:');
        console.log('   https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=jarda-analytic');
      }
    }
  }
}

main();
