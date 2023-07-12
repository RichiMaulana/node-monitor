const db = require('../models')
const { disk_data } = db;
const { QueryTypes } = db.Sequelize

exports.getAllData = async function () {
  return await disk_data.findAll();
};

exports.insertOrUpdate = async function (data) {
  const updated = await disk_data.update(data, {
    where: {
      hostname: data.hostname,
      name: data.name,
      mount: data.mount,
    },
  });
  if (updated[0] === 0) {
    let created;
    created = await disk_data.create(data);
    return created;
  }
  return updated;
};

exports.getDiskDataByHostname = async function (hostname, divider=1000000000) {
  let queryString = `
        select (sum(size) / :divider) as total_size, (sum(used) / :divider) as total_used from disk_data where hostname = :hostname and name != 'overlay' group by hostname;`;

  return await db.sequelize.query(queryString, {
    type: QueryTypes.SELECT,
    raw: true,
    replacements: {
      hostname,
      divider,
    },
  });
};
