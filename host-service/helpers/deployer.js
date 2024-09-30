const { exec } = require("child_process");
const axios = require("axios");
const { Mutex } = require('async-mutex');


const mutex = new Mutex();

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function deploy(){
    exec('gcloud run deploy frontend-test --image ash538/deployment-bot:v1.0 --platform managed --region asia-south2 --allow-unauthenticated --port 3000', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
        }
        if (stderr) {
            console.error(`exec error: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });
}

async function startDeploying(){
    while(true){
        const release = await mutex.acquire();
        try {
            const result = await axios.get(process.env.HOST_QUEUE_SERVICE_URL+'/dequeue');
            if (result.data.message == null){
                console.log("No project to deploy, sleeping for 5s");
                await sleep(5000);
            } else {
                console.log("Starting to deploy",result.data.message);
                await deploy(result.data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            release();
        }
    }
}

module.exports = { startDeploying }