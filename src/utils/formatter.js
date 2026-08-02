const classifyError = (error, timeoutMs) => {
  const code = error.code || "";
  const status = error.response?.status;
  const msg = error.message || "";

  if (code === "ECONNABORTED" || code === "ETIMEDOUT" || msg.includes("timeout")) {
    return {
      type: "Timeout",
      message: `Request timed out after ${timeoutMs} ms`,
      isRetryable: true,
    };
  }

  if (code === "ENOTFOUND") {
    return {
      type: "DNS",
      message: "DNS resolution failed (ENOTFOUND)",
      isRetryable: true,
    };
  }

  if (
    code === "ECONNRESET" ||
    code === "ECONNREFUSED" ||
    code === "EHOSTUNREACH" ||
    code === "ERR_NETWORK"
  ) {
    return {
      type: "Network",
      message: `Network connection failed (${code})`,
      isRetryable: true,
    };
  }

  if (status) {
    if (status >= 400 && status < 500) {
      return {
        type: `HTTP ${status}`,
        message: `Client Error (HTTP ${status})`,
        isRetryable: false,
      };
    }
    if (status >= 500) {
      return {
        type: `HTTP ${status}`,
        message: `Server Error (HTTP ${status})`,
        isRetryable: true,
      };
    }
  }

  return {
    type: "Unknown",
    message: msg || "Unknown error occurred",
    isRetryable: false,
  };
};

const formatLatency = (ms) => {
  if (typeof ms !== "number" || isNaN(ms)) return "N/A";
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)} sec`;
  }
  return `${ms} ms`;
};

const calculateSummaryStats = (results, totalRuntimeMs) => {
  const total = results.length;
  const healthy = results.filter((r) => r.success).length;
  const failed = total - healthy;
  const successRate = total > 0 ? `${((healthy / total) * 100).toFixed(1)}%` : "0%";

  let avgLatencyStr = "N/A";
  let fastest = "N/A";
  let slowest = "N/A";

  if (total > 0) {
    const sumLatency = results.reduce((acc, r) => acc + (r.latency || 0), 0);
    avgLatencyStr = formatLatency(sumLatency / total);

    const sortedByLatency = [...results].sort((a, b) => a.latency - b.latency);
    fastest = `${sortedByLatency[0].service} (${formatLatency(sortedByLatency[0].latency)})`;
    slowest = `${sortedByLatency[sortedByLatency.length - 1].service} (${formatLatency(sortedByLatency[sortedByLatency.length - 1].latency)})`;
  }

  return {
    total,
    healthy,
    failed,
    successRate,
    avgLatency: avgLatencyStr,
    fastest,
    slowest,
    totalRuntime: formatLatency(totalRuntimeMs),
  };
};

module.exports = {
  classifyError,
  formatLatency,
  calculateSummaryStats,
};
