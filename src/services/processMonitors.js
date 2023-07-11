const ps = require("ps-node");
const pidusage = require("pidusage");
const { processMonitorRepo } = require("../repositories");
const os = require("os");
const axios = require("axios").default;

const { SERVER_URL, MONITOR_PROCESS_INTERVAL } = process.env;

async function getPids() {
  return new Promise((resolve, reject) => {
    ps.lookup({}, (err, data) => {
      if (err) return reject(err);
      return resolve(
        data.map((el) => {
          return { pid: el.pid, name: el.command, args: el.arguments };
        })
      );
    });
  });
}

async function getUsagePerPid(pids) {
  const result = [];
  for (let pid of pids)
    try {
      const data = await pidusage(pid.pid);
      //   console.log(data);
      data.name = pid.name + " " + pid.args;
      data.hostname = os.hostname();
      const returnData = {
        process_name: data.name,
        cpu_usage_percent: parseFloat(data.cpu.toFixed(2)),
        memory_usage: data.memory,
        timestamp: new Date(data.timestamp),
        hostname: data.hostname,
      };
      if (data.cpu > 0 && data.memory > 0) result.push(returnData);
    } catch (err) {
      continue;
    }
  return result;
}

async function monitorProcess(MonitorEmitter) {
  const pids = await getPids();
  const usageData = await getUsagePerPid(pids);
  if (usageData.length > 0) MonitorEmitter.emit("process", usageData);
  return setInterval(
    async () => {
      const pids = await getPids();
      const usageData = await getUsagePerPid(pids);
      if (usageData.length > 0)
        return MonitorEmitter.emit("process", usageData);
    },
    MONITOR_PROCESS_INTERVAL ? MONITOR_PROCESS_INTERVAL * 1000 : 30000
  );
}

const eventHandler = {
  saveToDb: async (data) => {
    data.forEach((row) => {
      processMonitorRepo.insertData(row);
    });
  },
  postToServer: async (data) => {
    // data.forEach(async (row) => {
    //   console.log(row);
    // const requestData = {
    //   hostname: row.hostname,
    //   process_name: row.name,
    //   cpu_usage_percent: row.cpu,
    //   timestamp: row.timestamp,
    //   memory_usage: row.mem,
    // };
    // });
    axios.post(SERVER_URL + "monitors/process-data", data).catch((err) => {
      console.log(err.message)
      return;
    });
  },
};

module.exports = { getPids, getUsagePerPid, monitorProcess, eventHandler };
