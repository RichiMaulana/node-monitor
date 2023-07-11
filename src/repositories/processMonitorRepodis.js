const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const token = process.env.INFLUXDB_TOKEN;
const url = process.env.INFLUXDB_URL;
const org = process.env.INFLUXDB_ORG;

const client = new InfluxDB({ url, token });

exports.storeData = async function (data) {
  let org = `aktiva`;
  let bucket = `servers`;

  let writeClient = client.getWriteApi(org, bucket, "ns");
  let prepData = new Point("service_usage")
    .tag("service_name", data.name)
    .floatField("cpu", data.cpu)
    .intField("mem", data.memory)
    .stringField("name", data.name);
  console.log(prepData);

  await writeClient.writePoint(prepData);
  await writeClient.flush();
};

exports.queryCpuUsage = async function () {
  let queryClient = client.getQueryApi(org);
  let fluxQuery = `from(bucket: "servers")
    |> range(start: -30d)
    |> filter(fn: (r) => r["_measurement"] == "service_usage")
    |> filter(fn: (r) => r["_field"] == "cpu")
    |> aggregateWindow(every: 30d, fn: mean, createEmpty: false)
    |> sort(columns: ["_value"])
    |> yield(name: "mean")`;

  let resultData = [];

  for await (const { values, tableMeta } of queryClient.iterateRows(
    fluxQuery
  )) {
    resultData.push(tableMeta.toObject(values))
  }

  resultData = resultData.map((row) => {
    row._value = row._value * 100
    return {
        _value: row._value * 100,
        service_name: row.service_name
    }
  })
  //   await queryClient.queryRows(query, {
  //     next: (row, tableMeta) => {
  //       const tableObject = tableMeta.toObject(row);
  //       resultData = tableObject
  //     },
  //     error: (error) => {
  //       console.error("\nError", error);
  //     },
  //     complete: () => {
  //       console.log("\nSuccess");
  //     },
  //   });

    const csvWriter = createCsvWriter({
      path: './output.csv',
      header: [
        { id: 'service_name', title: 'Name' },
        { id: '_value', title: 'Cpu Usage' }
      ]
    });
    await csvWriter.writeRecords(resultData)
    console.log(resultData.sort((a, b) => a._value - b._value))
  return resultData;
};

async function queryData() {
  let queryClient = client.getQueryApi(org);
  let fluxQuery = `from(bucket: "servers")
   |> range(start: -10m)
   |> filter(fn: (r) => r._measurement == "measurement1")`;
  let resultData;

  queryClient.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
      const tableObject = tableMeta.toObject(row);
      console.log(tableObject);
    },
    error: (error) => {
      console.error("\nError", error);
    },
    complete: () => {
      console.log("\nSuccess");
    },
  });
}
