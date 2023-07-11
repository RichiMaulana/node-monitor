require("dotenv").config();
const EventEmitter = require("events");

const { processMonitor } = require("./src/services");
const { processMonitorRepo } = require('./src/repositories')

// const { } = require('./src/repositories')
class MyEmitter extends EventEmitter {}


main();

async function main() {
  try {
    const MonitorEmitter = new MyEmitter();
    MonitorEmitter.on("process", (data) => processMonitor.eventHandler.postToServer(data));
    processMonitor.monitorProcess(MonitorEmitter);
  } catch (err) {
    console.log(err);
  }
}

// test()
// async function test() {
//   console.log(await processMonitor.getPids())
// }
