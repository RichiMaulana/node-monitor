const { process_data } = require('../models')

exports.getAllData = async function (start, end) {
    return await process_data.findAll()
}

exports.insertData = async function (data) {
    return await process_data.create({
        hostname: data.hostname,
        timestamp: new Date(),
        process_name: data.name,
        cpu_usage_percent: data.cpu,
        ...data
    })
}