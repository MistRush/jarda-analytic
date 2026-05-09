const { google } = require('googleapis');
const alpha = google.analyticsadmin({ version: 'v1alpha' });
console.log(typeof alpha.properties.accessBindings.create);
