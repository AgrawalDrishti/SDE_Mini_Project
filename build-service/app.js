require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const axios = require("axios");
const { Mutex } = require('async-mutex');
const projectBuilder = require('./helpers/builder');

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log('Server is running', process.env.PORT);
    projectBuilder.startBuilding();
});

app.get('/', (req, res) => {    
    res.send({ message: "I'm running" });
});

app.use('/build', require('./routes/build_routes'));