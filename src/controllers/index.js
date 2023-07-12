const processData = require('./processDataController')
const networkData = require('./networkDataController')
const diskData = require('./diskDataController')
const exportDataAll = require('./exportsDataController')

module.exports = {
    processData,
    networkData,
    diskData,
    exportDataAll
}