require('dotenv').config()
const express = require('express')

const controllers = require('./src/controllers')

const PORT = process.env.SERVER_PORT || 7012

const app = express();
app.use(express.json());

app.post('/monitors/process-data', controllers.processData)
app.post('/monitors/network-data', controllers.networkData)
app.post('/monitors/disk-data', controllers.diskData)
app.get('/monitors/exports', controllers.exportDataAll)

app.listen(PORT, () => {
    console.log('API server started, listen on port:', PORT)
})