const { formatLatency } = require("./formatter");

const LINE = "────────────────────────────────────────────────────────";

const printHeader = () => {
  console.log("\n🚀 Heartbeat Service Started\n");
  console.log(LINE);
};

const printFooter = () => {
  console.log(LINE);
};

const logResult = (result) => {
  const coldStartStr = result.isColdStart ? "Yes" : "No";

  if (result.success) {
    console.log(`🟢 ${result.service}`);
    console.log(`URL          : ${result.url}`);
    console.log(`Status       : ${result.status}`);
    console.log(`Latency      : ${formatLatency(result.latency)}`);
    console.log(`Cold Start   : ${coldStartStr}`);
  } else {
    console.log(`🔴 ${result.service}`);
    console.log(`URL          : ${result.url}`);
    console.log(`Message      : ${result.errorMessage}`);
    console.log(`Code         : ${result.errorCode}`);
    console.log(`Status       : ${result.status}`);
    console.log(`Timeout      : ${result.timeout} ms`);
    console.log(`Cold Start   : ${coldStartStr}`);
  }
  console.log("");
};

const logSummary = (stats) => {
  console.log("\nSummary\n");
  console.log(`Total            : ${stats.total}`);
  console.log(`Healthy          : ${stats.healthy}`);
  console.log(`Failed           : ${stats.failed}`);
  console.log(`Success Rate     : ${stats.successRate}`);
  console.log(`Average Latency  : ${stats.avgLatency}`);
  console.log(`Fastest          : ${stats.fastest}`);
  console.log(`Slowest          : ${stats.slowest}`);
  console.log(`Total Runtime    : ${stats.totalRuntime}`);
};

module.exports = {
  printHeader,
  printFooter,
  logResult,
  logSummary,
};