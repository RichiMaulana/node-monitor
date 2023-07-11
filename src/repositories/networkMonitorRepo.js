const { network_data } = require("../models");
const { Op } = require("sequelize");

exports.getAllData = async function () {
  return await network_data.findALl();
};

exports.getAllHostname = async function () {
  return await network_data.findAll({
    group: "hostname",
    attributes: ["hostname"],
  });
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

  let existedData;
  if (data.type === "monthly") {
    existedData = await network_data.findOne({
      where: {
        hostname: data.hostname,
        type: data.type,
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
