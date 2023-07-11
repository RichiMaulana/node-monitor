const { disk_data } = require('../models')

exports.getAllData = async function () {
    return await disk_data.findAll()
}

exports.insertOrUpdate = async function (data) {
    const updated = await disk_data.update(data, {where: {
        hostname: data.hostname,
        name: data.name,
        mount: data.mount
    }})
    if (updated[0] === 0) {
        let created
        created = await disk_data.create(data)
        return created
    }
    return updated
}