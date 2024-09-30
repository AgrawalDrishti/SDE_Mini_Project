require('dotenv').config();
const express = require('express');
const app = express();
const { startDeploying } = require('./helpers/deployer');

app.get('/', (req, res) => {
    res.send('Hi, host service is running host-service!');
});

app.listen(process.env.PORT, () => {
    console.log(`Host service listening at port ${process.env.PORT}`);
    startDeploying();
});