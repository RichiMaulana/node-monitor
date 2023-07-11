require("dotenv").config();
const EventEmitter = require("events");

const {
  processMonitor,
  networkMonitor,
  diskMonitor,
} = require("./src/services");
class MyEmitter extends EventEmitter {}

main();

async function main() {
  try {
    const MonitorEmitter = new MyEmitter();
    MonitorEmitter.on("process", (data) =>
      processMonitor.eventHandler.postToServer(data)
    );
    MonitorEmitter.on("network", (data) =>
      networkMonitor.eventHandler.postToServer(data)
    );
    MonitorEmitter.on("disk", (data) =>
      diskMonitor.eventHandler.postToServer(data)
    );

    // processMonitor.monitorProcess(MonitorEmitter);
    // networkMonitor.monitorNetwork(MonitorEmitter);
    diskMonitor.monitorDisks(MonitorEmitter);
  } catch (err) {
    console.log(err);
  }
}
