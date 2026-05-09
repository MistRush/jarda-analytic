const serverless = require('serverless-http');
const app = require('../../server');

// Zabalí naši existující Express aplikaci do serverless funkce
module.exports.handler = serverless(app);
