const si = require("systeminformation");
const { diskMonitorRepo } = require("../repositories");
const os = require("os");
const axios = require("axios").default;

const { SERVER_URL } = process.env;

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
  }, 60000 * 10);
}

const eventHandler = {
  saveToDb: async (data) => {
    console.log(data);
    data.forEach((row) => {
      diskMonitorRepo.insertOrUpdate(row);
    });
  },
  postToServer: async (data) => {
    console.log(data);
    axios.post(SERVER_URL + "monitors/disk-data", data).catch((err) => {
      return;
    });
  },
};

module.exports = { monitorDisks, eventHandler };
