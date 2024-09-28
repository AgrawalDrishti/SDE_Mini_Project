require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { Mutex } = require('async-mutex');
const Queue = require("./queue.js");

app.use(cors());
app.use(express.json());

const mutex = new Mutex();
var queue = new Queue();

app.listen(process.env.PORT, () => {
  console.log('Queue service listening on port', process.env.PORT);
});

app.post('/enqueue', async (req, res) => {
    const release = await mutex.acquire();
    try {
        const message = req.body.zip_to_build;
        queue.enqueue(message);
        return res.status(200).send({message:'Success,zip added to queue'});
    } catch (err) {
        return res.status(500).send({'Error':'zip not added to queue '+err});
    } finally {
        release();
    }
});

app.get('/dequeue', async (req, res) => {
    const release = await mutex.acquire();
    try {
        const message = queue.dequeue();
        return res.status(200).send({message:message});
    } catch (err) {
        return res.status(500).send({'Error':'zip not received from queue '+err});
    } finally {
        release();
    }
});