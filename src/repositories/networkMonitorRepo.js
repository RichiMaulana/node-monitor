const db = require('../models')
const { network_data } = db;
const { Op, QueryTypes, fn, where, col } = db.Sequelize;

exports.getAllData = async function () {
  return await network_data.findALl();
};

exports.getAllHostname = async function () {
  const data = await network_data.findAll({
    group: "hostname",
    attributes: ["hostname"],
  });

  return data.map((el) => el.hostname)
};

exports.insertOrUpsert = async function (data) {
  const date = new Date();
  const eod = new Date(date);
  const sod = new Date(date);
  eod.setHours(23);
  eod.setMinutes(59);
  eod.setSeconds(59);
  sod.setHours(0);
  sod.setMinutes(0);
  sod.setSeconds(0);
  const som = new Date(sod);
  som.setMonth(date.getMonth() - 1);
  const eom = new Date(eod);
  eom.setMonth(date.getMonth() + 1);
  // const month = date.getMonth() + 1

  let existedData;
  if (data.type === "monthly") {
    existedData = await network_data.findOne({
      where: {
        hostname: data.hostname,
        type: data.type,
        // [Op.and]: [
        //   where(fn('MONTH', col('timestamp')), month)
        // ]
        timestamp: {
          [Op.between]: [som, eom],
        },
      },
    });
  } else if (data.type === "daily") {
    existedData = await network_data.findOne({
      where: {
        hostname: data.hostname,
        type: data.type,
        // [Op.and]: [
        //   where(fn('MONTH', col('timestamp')), month)
        // ]
        timestamp: {
          [Op.between]: [sod, eod],
        },
      },
    });
  }

  if (!existedData) {
    const created = await network_data.create(data);
    return created;
  }

  if (data.type === "daily") {
    const update = await network_data.update(
      {
        tx: existedData.tx + data.tx,
        rx: existedData.rx + data.rx,
      },
      {
        where: {
          hostname: data.hostname,
          type: "daily",
          timestamp: {
            [Op.between]: [sod, eod],
          },
        },
      }
    );
    return update;
  } else if (data.type === "monthly") {
    delete data.timestamp;
    sod.setMonth(date.getMonth() - 1);
    eod.setMonth(date.getMonth() + 1);
    const update = await network_data.update(
      {
        tx: existedData.tx + data.tx,
        rx: existedData.rx + data.rx,
      },
      {
        where: {
          hostname: data.hostname,
          type: "monthly",
          timestamp: {
            [Op.between]: [sod, eod],
          },
        },
      }
    );
    return update;
  }
  return;
};

exports.getNetworkDataByHostname = async function (hostname, month, divider=1000000000) {
  let queryString = `
    select hostname, ((tx) / :divider) as total_upload, ((rx) / :divider) as total_download from network_data where hostname = :hostname and month(timestamp) = :month group by hostname;`;

  return await db.sequelize.query(queryString, {
    type: QueryTypes.SELECT,
    raw: true,
    replacements: {
      hostname,
      month,
      divider,
    },
  });
};

