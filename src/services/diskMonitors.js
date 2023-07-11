const si = require("systeminformation");
const { diskMonitorRepo } = require("../repositories");
const os = require("os");
const axios = require("axios").default;

const { SERVER_URL, MONITOR_DISK_INTERVAL } = process.env;

async function monitorDisks(MonitorEmitter) {
  si.fsSize().then((data) => {
    let returnData = [];
    data.forEach((row) => {
      returnData.push({
        hostname: os.hostname(),
        timestamp: new Date(),
        name: row.fs,
        mount: row.mount,
        size: row.size,
        used: row.used,
      });
    });
    MonitorEmitter.emit("disk", returnData);
  });
  setInterval(() => {
    si.fsSize().then((data) => {
      let returnData = [];
      data.forEach((row) => {
        returnData.push({
          hostname: os.hostname(),
          timestamp: new Date(),
          name: row.fs,
          mount: row.mount,
          size: row.size,
          used: row.used,
        });
      });
      MonitorEmitter.emit("disk", returnData);
    });
  }, MONITOR_DISK_INTERVAL ? MONITOR_DISK_INTERVAL * 10000 : 600000);
}

const eventHandler = {
  saveToDb: async (data) => {
    data.forEach((row) => {
      diskMonitorRepo.insertOrUpdate(row);
    });
  },
  postToServer: async (data) => {
    axios.post(SERVER_URL + "monitors/disk-data", data).catch((err) => {
      console.error('Disk Data Store Error:', err.message)
      return;
    });
  },
};

module.exports = { monitorDisks, eventHandler };
