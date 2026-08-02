const { createHttpClient } = require("../utils/httpClient");
const { classifyError } = require("../utils/formatter");
const {
  DEFAULT_TIMEOUT,
  COLD_START_THRESHOLD_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} = require("../config/constants");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ping = async (service) => {
  const timeoutMs = service.timeout || DEFAULT_TIMEOUT;
  const httpClient = createHttpClient(timeoutMs);
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  let attempt = 0;
  let lastError = null;

  while (attempt <= MAX_RETRIES) {
    attempt++;
    const requestStart = Date.now();

    try {
      const response = await httpClient.get(service.url);
      const latency = Date.now() - startTime;

      return {
        service: service.name,
        url: service.url,
        success: true,
        latency,
        status: response.status,
        errorCode: "NONE",
        errorType: null,
        errorMessage: null,
        timeout: timeoutMs,
        timestamp,
        isColdStart: latency > COLD_START_THRESHOLD_MS,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;
      const classified = classifyError(error, timeoutMs);

      // Check if error is retryable and retry budget remains
      if (classified.isRetryable && attempt <= MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      break;
    }
  }

  const latency = Date.now() - startTime;
  const classified = classifyError(lastError, timeoutMs);

  return {
    service: service.name,
    url: service.url,
    success: false,
    latency,
    status: lastError.response?.status ?? "N/A",
    errorCode: lastError.code || "ERR_UNKNOWN",
    errorType: classified.type,
    errorMessage: classified.message,
    timeout: timeoutMs,
    timestamp,
    isColdStart: latency > COLD_START_THRESHOLD_MS,
    attempts: attempt,
  };
};

module.exports = {
  ping,
};
