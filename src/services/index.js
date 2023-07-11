const processMonitor = require('./processMonitors')
const networkMonitor = require('./networkMonitors')
const diskMonitor = require('./diskMonitors')

module.exports = {
    processMonitor,
    networkMonitor,
    diskMonitor
}