const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const { createCircuitBreaker } = require('./CircuitBreakerService');

// Axios retry configuration
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000, 
  retryCondition: (error) => error.response?.status >= 500,
});

class HttpClient {
  constructor(serviceUrl) {
    this.serviceUrl = serviceUrl;
    this.circuitBreaker = createCircuitBreaker(this.makeRequest.bind(this));
  }

  async makeRequest(config) {
    try {
      return await axios(config);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async get(endpoint) {
    try {
      return await this.circuitBreaker.fire({
        method: 'GET',
        url: `${this.serviceUrl}${endpoint}`,
      });
    } catch (error) {
      throw new Error(`Service request failed: ${error.message}`);
    }
  }

  async post(endpoint, data) {
    try {
      return await this.circuitBreaker.fire({
        method: 'POST',
        url: `${this.serviceUrl}${endpoint}`,
        data,
      });
    } catch (error) {
      throw new Error(`Service request failed: ${error.message}`);
    }
  }

  async patch(endpoint, data) {
    try {
      return await this.circuitBreaker.fire({
        method: 'PATCH',
        url: `${this.serviceUrl}${endpoint}`,
        data,
      });
    } catch (error) {
      throw new Error(`Service request failed: ${error.message}`);
    }
  }
}

module.exports = HttpClient;
