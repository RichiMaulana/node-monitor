const csvStringify = require("csv-stringify");
const { writeFile } = require('fs/promises')

const {
  processMonitorRepo,
  networkMonitorRepo,
  diskMonitorRepo,
} = require("../repositories");

const exportPath = __dirname + '/../../data/export.csv'

module.exports = async function (req, res, next) {
  try {
    const { month, type, download } = req.query;
    const allHostname = await networkMonitorRepo.getAllHostname();
    const data = await getAllData(allHostname, month);

    if (type !== "csv") return res.send(data);

    const csvData = await convertJsonToCsv(data);
    const options = {
      root: __dirname + "/../../data",
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };
    if (download !== "true") return res.type("text").send(csvData);

    await writeFile(exportPath, csvData)
    return res.sendFile("export.csv", options, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Sent");
      }
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

async function convertJsonToCsv(json) {
  return new Promise((resolve, reject) => {
    csvStringify.stringify(json, { header: true }, (err, csvData) => {
      if (err) return reject(err);
      resolve(csvData);
    });
  });
}

async function getAllData(hostnames, month) {
  let returnData = [];
  if (!month) month = new Date().getMonth() + 1;
  month = parseInt(month);
  for (let hostname of hostnames) {
    const cpuUsage = await processMonitorRepo.getCpuUsageAverageByHostname(
      hostname,
      month
    );
    const topServiceCpu = await processMonitorRepo.getTopServiceUsage(
      hostname,
      month,
      "cpu"
    );
    const topServiceMem = await processMonitorRepo.getTopServiceUsage(
      hostname,
      month,
      "mem"
    );
    const networkUsage = await networkMonitorRepo.getNetworkDataByHostname(
      hostname,
      month
    );
    const diskUsage = await diskMonitorRepo.getDiskDataByHostname(hostname);

    const top_usage_mem =
      topServiceMem[0]?.process_name.length < 100
        ? topServiceMem[0]?.process_name
        : topServiceMem[0]?.process_name?.split(" ")[0] +
          " " +
          topServiceMem[0]?.process_name?.split(" ")[
            topServiceMem[0]?.process_name?.split(" ").length - 1
          ];
    const top_usage_cpu =
      topServiceCpu[0]?.process_name.length < 100
        ? topServiceCpu[0]?.process_name
        : topServiceCpu[0]?.process_name?.split(" ")[0] +
          " " +
          topServiceCpu[0]?.process_name?.split(" ")[
            topServiceCpu[0]?.process_name?.split(" ").length - 1
          ];

    returnData.push({
      hostname,
      total_disk_size: diskUsage[0]?.total_size,
      total_disk_used: diskUsage[0]?.total_used,
      cpu_usage_average: cpuUsage[0]?.cpu_usage_average,
      bandwith_tx: networkUsage[0]?.total_upload,
      bandwith_rx: networkUsage[0]?.total_download,
      top_usage_cpu,
      top_usage_mem,
    });
  }
  return returnData;
}
