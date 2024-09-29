const axios = require("axios");
const { Mutex } = require('async-mutex');

const mutex = new Mutex();

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function startBuilding(){
    while(true){
        const release = await mutex.acquire();
        try {
            const result = await axios.get(process.env.QUEUE_SERVICE_URL+'/dequeue');
            if (result.data.message == null){
                console.log("No project to build, sleeping for 5s");
                await sleep(5000);
            } else {
                console.log("Starting to build",result.data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            release();
        }
    }
}

module.exports = { startBuilding }