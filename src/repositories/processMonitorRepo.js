const db = require("../models");
const { process_data } = db;
const { QueryTypes } = require("sequelize");

exports.getAllData = async function (start, end) {
  return await process_data.findAll();
};

exports.insertData = async function (data) {
  return await process_data.create({
    hostname: data.hostname,
    timestamp: new Date(),
    process_name: data.name,
    cpu_usage_percent: data.cpu,
    ...data,
  });
};

exports.getCpuUsageAverageByHostname = async function (hostname, month = 0) {
  let queryString = `
    select month(timestamp) as month, hostname, avg(cpu_usage_percent) cpu_usage_average from process_data where hostname = :hostname and cpu_usage_percent > 0 group by month(timestamp), hostname;`;

  if (month !== 0)
    queryString = `
        select month(timestamp) as month, hostname, avg(cpu_usage_percent) cpu_usage_average from process_data where hostname = :hostname and MONTH(timestamp) = :month and cpu_usage_percent > 0 group by month(timestamp), hostname;`;

  return await db.sequelize.query(queryString, {
    type: QueryTypes.SELECT,
    raw: true,
    replacements: {
      hostname,
      month,
    },
  });
};

exports.getTopServiceUsage = async function (hostname, month, type = "cpu") {
  let queryString;
  if (type === "cpu") {
    queryString = `
        SELECT process_name, AVG(cpu_usage_percent) AS cpu_usage
        FROM process_data
        WHERE hostname = :hostname
          AND MONTH(timestamp) = :month
          AND cpu_usage_percent > 0
        GROUP BY hostname, process_name
        HAVING COUNT(process_name) > 30
        ORDER BY cpu_usage DESC
        LIMIT 1;`;
  } else if (type === "mem") {
    queryString = `
        SELECT process_name, AVG(memory_usage) AS mem_usage
        FROM process_data
        WHERE hostname = :hostname
            AND MONTH(timestamp) = :month
            AND process_data.memory_usage > 0
        GROUP BY hostname, process_name
        HAVING COUNT(process_name) > 30
        ORDER BY mem_usage DESC
        LIMIT 1;`;
  }

  return await db.sequelize.query(queryString, {
    type: QueryTypes.SELECT,
    raw: true,
    replacements: {
      hostname,
      month,
    },
  });
};
