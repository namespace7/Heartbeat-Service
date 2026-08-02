const services = require("./config/services.json");
const { ping } = require("./services/heartbeat");
const logger = require("./utils/logger");
const { calculateSummaryStats } = require("./utils/formatter");
const { SUCCESS_EXIT_CODE, FAILURE_EXIT_CODE } = require("./config/constants");

const run = async () => {
  logger.printHeader();
  const startTime = Date.now();

  // Execute pings concurrently for high throughput
  const results = await Promise.all(services.map((service) => ping(service)));

  // Output individual service health cards
  results.forEach(logger.logResult);

  // Compute summary metrics & render output
  const totalRuntimeMs = Date.now() - startTime;
  const stats = calculateSummaryStats(results, totalRuntimeMs);

  logger.printFooter();
  logger.logSummary(stats);

  // Signal status code for CI/CD environments
  if (stats.failed > 0) {
    process.exitCode = FAILURE_EXIT_CODE;
  } else {
    process.exitCode = SUCCESS_EXIT_CODE;
  }
};

run();
