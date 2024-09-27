
const axios = require('axios');
const unzipper = require("unzipper");
const simpleGit = require('simple-git');
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage'); // Import GCP storage
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const archiver = require('archiver');

simpleGit().clean(simpleGit.CleanOptions.FORCE);

const keyFilePath = '../upload-service/gcp_key.json';

if (!fs.existsSync(keyFilePath)) {
    console.error('Service account key file is missing!');
    process.exit(1);
}


const storage = new Storage({
    projectId: 'deploymentbot-082780',
    keyFilename: keyFilePath 
});

const bucketName = 'cloned_repo_bucket082780';
const bucket = storage.bucket(bucketName);

/*
Helper Functions
*/

const uploadFileToBucket = async (filePath, destination) => {
    try {
        await bucket.upload(filePath, {
            destination: 'ClonedRepositories/'+destination,
        });
        console.log(filePath + ' uploaded to ' + bucketName + '/' + destination);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

const uploadDirectoryToBucket = async (dirPath, destinationPrefix) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const destination = path.join(destinationPrefix, file);

        if (fs.lstatSync(filePath).isDirectory()) {
            console.log("Uploading directory");
            await uploadDirectoryToBucket(filePath, destination);
        } else {
            await uploadFileToBucket(filePath, destination);
            console.log("Uploading File");
        }
    }
};

const zipDirectory = (sourceDir, outPath) => {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`Zipped ${archive.pointer()} total bytes`);
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(sourceDir, false); // Add the directory to the archive
        archive.finalize();
    });
};


// Function to check if the docker image is valid
function check_invalid_docker_image(image){
    if (image === ""){
        return true;
    }
    for(var i=0;i<image.length;i++){
        if (image[i] === "/"){
            return false;
        }
    }
    return true;
}

// Function to check if the github url is valid
function is_valid_github_repo_url(url) {
    const pattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/;

    return pattern.test(url);
}



/*
Controller Functions
*/

// req body should contain dockerhub url with key docker_image
const docker_image_handler = async (req,res) => {
    console.log("Docker image post request received");
    try {
        console.log("Request body received: ",req.body);
        
        if (Object.keys(req.body).length === 0){
            return res.status(400).send({error:"No Docker image provided"});
        }
        
        if ( check_invalid_docker_image(req.body.docker_image) ){
            return res.status(404).send({error:"No Docker image provided"});
        }

        const url = "https://hub.docker.com/r/"+req.body.docker_image;
        const image_response = await axios.get(url);
        if (image_response.status === 200){
            console.log("Provided Docker image:",url);
            // TO DO : Push this in queue2 for hosting
            return res.status(200).send({message:"Success"});
        } else {
            return res.status(400).send({error:"Failed"});
        }
        
    } catch (error) {
        if (error.response && error.response.status === 404){
            return res.status(404).send({error:"Specified Docker image not found"});
        } else {
            return res.status(500).send({error:"Internal Server Error"});
        }
    }
};


// req body should contain github repo url key github_url
const github_url_handler = async (req, res) => {
    console.log("GitHub URL post request received");
    const url = req.body.github_url;
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: "No GitHub URL provided" });
        }

        if (!is_valid_github_repo_url(url)) {
            return res.status(400).send({ error: "Invalid GitHub Repository URL" });
        }

        const repo_response = await axios.get(url);
        if (repo_response.status === 200) {
            console.log("Provided GitHub URL:", url);
            try {
                const cloned_folder_name = crypto.createHash('sha256').update(url).digest('hex');
                const localPath = './cloned_repositories/' + cloned_folder_name;
                const zipPath = './cloned_repositories/' + cloned_folder_name + '.zip';

                console.log("LocalPath is : " ,localPath);

                await simpleGit().clone(url, localPath);
                console.log("Cloned the repository at", url);

                await zipDirectory(localPath, zipPath);
                console.log("Zipped the directory to", zipPath);

                const destination = cloned_folder_name + '.zip';

                console.log("Uploading zip");
                await uploadFileToBucket(zipPath, destination);
                
                fs.rmdir(localPath, {recursive:true} , (err) => err && console.error(err));
                fse.remove(zipPath, (err) => err && console.error(err));
                return res.status(200).send({ message: "Success, Repository Uploaded" });
            } catch (error) {
                return res.status(400).send({ error: "Failed " + error });
            }

        } else {
            return res.status(400).send({ error: "Failed" });
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).send({ error: "Specified GitHub URL not found" });
        } else {
            return res.status(500).send({ error: "Internal Server Error" });
        }
    }
};

// req should contain a zip file with key codebase
const zip_file_handler = async (req,res) => {
    console.log("Zip file post request received");
    try {
        if (req.files === null || Object.keys(req.files).length===0 || req.files.codebase === "") {
            return res.status(400).send({error:"No file uploaded"});
        }
        if (Object(req.files)["codebase"] === undefined) {
            console.log("Incorrect request format");
            return res.status(400).send({error:"Incorrect request format"});
        }
        const file = req.files.codebase;
        console.log("File name:",file.name);
        console.log("File size:",file.size);
        console.log("File mimetype:",file.mimetype);

        if (file.mimetype !== 'application/zip' && 
            file.mimetype != 'application/x-zip-compressed' && 
            file.mimetype != 'application/x-zip' && 
            file.mimetype != 'application/zip-compressed' && 
            file.mimetype != 'application/octet-stream'
        ){

            return res.status(400).send({error:"Uploaded file is not a zip file"});
        }
        
        // extract the file and check that it doesn't contain node_modules
        const zipBuffer = file.data;
        const directory = await unzipper.Open.buffer(zipBuffer);
        const containsNodeModules = directory.files.some(file => file.path.includes("node_modules"));
        if (containsNodeModules) {
            return res.status(400).send({error:"Zip file contains node_modules, please remove them"});
        }
        
        const destination = crypto.createHash('sha256').update(file.name).digest('hex') + '.zip';
        const zipPath = './cloned_repositories' + destination;
        
        fs.writeFile(zipPath, zipBuffer, (err) => err && console.error(err));

        console.log("Uploading zip");
        await uploadFileToBucket(zipPath, destination);

        fse.remove(zipPath, (err) => err && console.error(err));
        return res.status(200).send({ message: "Success, file saved" });
        // TO DO : Push this in cloud bucket

    } catch (error) {
        console.log(error);
        return res.status(500).send({error:"Internal Server Error"});
    }
};


module.exports = { docker_image_handler , github_url_handler , zip_file_handler };