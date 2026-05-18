const { google } = require('googleapis');
const path = require('path');

async function testGSC() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  try {
    const res = await searchconsole.sites.list();
    console.log('Sites the service account can see:');
    if (res.data.siteEntry) {
      res.data.siteEntry.forEach(site => {
        console.log(`- ${site.siteUrl} (Permission: ${site.permissionLevel})`);
      });
    } else {
      console.log('No sites found. Make sure you added the service account email as a user in GSC.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testGSC();
