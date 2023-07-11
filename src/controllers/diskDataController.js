const service = require('../services').diskMonitor

module.exports = async function (req, res, next) {
    try {
        const data = req.body
        service.eventHandler.saveToDb(data)
        res.send('ok')
    } catch (err) {
        console.log(err)
        res.send('error')
    }
}