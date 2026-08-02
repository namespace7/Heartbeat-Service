const LINE =
  "────────────────────────────────────────────────────────";

const printHeader = () => {
  console.log("\n Heartbeat Service Started\n");
  console.log(LINE);
};

const printFooter = () => {
  console.log(LINE);
};

const logResult = (result) => {
  if (result.success) {
    console.log(`🟢 ${result.name}`);
    console.log(`URL      : ${result.url}`);
    console.log(`Status   : ${result.status}`);
    console.log(`Latency  : ${result.latency} ms`);
  } else {
    console.log(`🔴 ${result.name}`);
    console.log(`URL      : ${result.url}`);
    console.log(`Message  : ${result.error.message}`);
    console.log(`Code     : ${result.error.code}`);
    console.log(`Status   : ${result.error.status}`);
    console.log(`Timeout  : ${result.error.timeout} ms`);
  }
  console.log("");
};

const logSummary = (total, healthy, failed, duration) => {
  console.log("\nSummary\n");
  console.log(`Total   : ${total}`);
  console.log(`Healthy : ${healthy}`);
  console.log(`Failed  : ${failed}`);
  console.log(`\nCompleted in ${duration} ms`);
};

module.exports = {
  printHeader,
  printFooter,
  logResult,
  logSummary,
};