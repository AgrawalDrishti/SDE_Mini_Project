const axios = require("axios");
const { Mutex } = require('async-mutex');
const { Storage } = require("@google-cloud/storage");
const AdmZip = require("adm-zip");
const fs = require("fs");
const { exec } = require("child_process");

const mutex = new Mutex();
const storage = new Storage();

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function downloadAndUnzipFile(destinationFile){
    const zipPath = "./downloaded_projects/curr_project.zip";
    const extractPath = "./downloaded_projects";

    const options = {
        destination : zipPath
    }

    try {
        await storage.bucket(process.env.BUCKET_NAME).file(destinationFile).download(options);
        
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        console.log("Project Files Ready");
    } catch (err) {
        console.error(err);
    }
}

async function build(project_zip_url){
    await downloadAndUnzipFile(project_zip_url)
    .catch(err => console.error(err));

    // Deleting .git folder
    fs.rm("./downloaded_projects/.git", { recursive: true }, (err) => console.error(err));

    // getting the project name
    exec('powershell -Command "Get-ChildItem -Directory ./downloaded_projects/ | Select-Object -ExpandProperty Name"', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`exec error: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        const app_path = stdout.trim();

        const dockerFileContent = `FROM node:18\n\nWORKDIR /app\n\nCOPY package*.json ./\n\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3000\n\nCMD ["node", "app.js"]`;
        fs.writeFileSync("./downloaded_projects/"+app_path+"/Dockerfile", dockerFileContent.trim());
        console.log("Dockerfile created");
        
        // Logging into docker
        exec("docker login", (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            if (stderr) {
                console.error(`exec error: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            
            // Going inside project folder
            process.chdir("./downloaded_projects/"+app_path);
            
            // Building the docker image
            exec("docker build -t my-curr-project .", (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                }
                if (stderr) {
                    console.error(`exec error: ${stderr}`);
                }
                console.log(`stdout: ${stdout}`);

                // Tagging the docker image
                exec("docker tag my-curr-project ash538/deployment-bot:v1.0", (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                    }
                    if (stderr) {
                        console.error(`exec error: ${stderr}`);
                    }
                    console.log(`stdout: ${stdout}`);

                    // Pushing the docker image
                    exec("docker push ash538/deployment-bot:v1.0", (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        if (stderr) {
                            console.error(`exec error: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                });
            });
        });
    });
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
                await build(result.data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            release();
        }
    }
}

module.exports = { startBuilding }