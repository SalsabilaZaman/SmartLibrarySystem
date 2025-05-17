const opossum = require('opossum');

const circuitBreakerOptions = {
  timeout: 5000, // 5 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 10000, // 10 seconds
};

const createCircuitBreaker = (requestFn) => {
  return new opossum(requestFn, circuitBreakerOptions);
};

module.exports = { createCircuitBreaker };
