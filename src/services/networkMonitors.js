const si = require("systeminformation");
const os = require("os");
const fs = require("fs/promises");
const axios = require("axios").default;

const { SERVER_URL, MONITOR_NETWORK_INTERVAL } = process.env;

const { networkMonitorRepo } = require("../repositories");
const interfaces = os.networkInterfaces();
const defaultInterface = Object.keys(interfaces)[1];

const networkDataPath = "/proc/net/dev";

// let tTotal = 0;
// let rTotal = 0;

async function monitorNetwork(MonitorEmitter) {
  if (os.type() !== "Linux") {
    return setInterval(() => {
      si.networkStats().then((data) => {
        // tTotal = tTotal + data[0].tx_sec;
        // rTotal = rTotal + data[0].rx_sec;
        // console.log(tTotal, rTotal);
        MonitorEmitter.emit("network", data[0].tx_sec, data[0].rx_sec);
      });
    }, 1000);
  }

  let data = await fs.readFile(networkDataPath, { encoding: "utf-8" });
  let dataNow;
  data = await parseNetworkData(data, defaultInterface);
  let rx = data[1];
  let tx = data[9];

  setInterval(
    async () => {
      dataNow = await fs.readFile(networkDataPath, { encoding: "utf-8" });
      dataNow = await parseNetworkData(dataNow, defaultInterface);
      let txNow = dataNow[9];
      let rxNow = dataNow[1];
      const bw = {
        tx: txNow - tx,
        rx: rxNow - rx,
        hostname: os.hostname(),
        timestamp: new Date(),
      };
      MonitorEmitter.emit("network", bw);
      data = dataNow;
      tx = txNow;
      rx = rxNow;
    },
    MONITOR_NETWORK_INTERVAL ? MONITOR_NETWORK_INTERVAL * 1000 : 10000
  );
}

const eventHandler = {
  saveToDb: async (data) => {
    await networkMonitorRepo.insertOrUpsert(data);
  },
  postToServer: async (data) => {
    // const data = {
    //     hostname: os.hostname(),
    //     tx,
    //     rx,
    //     type: 'monthly',
    //     timestamp: new Date()
    // };
    axios.post(SERVER_URL + "monitors/network-data", data).catch((err) => {
      return; //ignore error
    });
  },
};

async function parseNetworkData(data, defaultInterface) {
  data = data.split("\n").filter((el) => {
    if (el.includes(defaultInterface)) return el;
  });

  data = data[0].split(" ").filter((el) => {
    if (el.match(/[\w0-9]/)) return el;
  });
  return data;
}

module.exports = { monitorNetwork, eventHandler };
