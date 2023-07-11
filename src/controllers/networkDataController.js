const service = require('../services').networkMonitor

module.exports = async function (req, res, next) {
  try {
    const data = req.body;
    data.type = "monthly";
    service.eventHandler.saveToDb(data)
    res.send("ok");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};
