const services = require("./config/services.json");
const { ping } = require("./services/heartbeat");
const logger = require("./utils/logger");

const run = async () => {
  logger.printHeader();
  const startedAt = Date.now();

  // Execute pings concurrently for optimal speed
  const results = await Promise.all(services.map((service) => ping(service)));

  results.forEach(logger.logResult);

  const healthy = results.filter((r) => r.success).length;
  const failed = results.length - healthy;

  logger.printFooter();
  logger.logSummary(results.length, healthy, failed, Date.now() - startedAt);

  // Set non-zero exit code if any service fails (Critical for Phase 2 GitHub Actions)
  if (failed > 0) {
    process.exitCode = 1;
  }
};

run();

