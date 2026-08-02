const axios = require("axios");

const REQUEST_TIMEOUT = 60000;

const ping = async (service) => {
  const start = Date.now();
  const timeout = service.timeout || REQUEST_TIMEOUT;

  try {
    const response = await axios.get(service.url, {
      timeout,
      headers: { "User-Agent": "Heartbeat-Service/1.0" },
    });

    return {
      name: service.name,
      url: service.url,
      status: response.status,
      latency: Date.now() - start,
      success: true,
    };
  } catch (error) {
    return {
      name: service.name,
      url: service.url,
      success: false,
      latency: Date.now() - start,
      error: {
        message: error.message,
        code: error.code || "ERR_UNKNOWN",
        status: error.response?.status ?? "N/A",
        timeout,
      },
    };
  }
};

module.exports = {
  ping,
};
