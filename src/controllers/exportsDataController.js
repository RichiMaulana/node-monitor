const {processMonitorRepo, networkMonitorRepo, diskMonitorRepo } = require('../repositories')

module.exports = async function (req, res, next) {
    try {
        console.log(req.body)
        res.send('ok')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}