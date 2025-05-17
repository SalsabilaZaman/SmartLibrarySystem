const axios = require('axios');

const httpClient = axios.create({
  timeout: 5000, // 5 seconds timeout
});

module.exports = httpClient;

