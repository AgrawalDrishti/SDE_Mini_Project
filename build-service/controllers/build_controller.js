require('dotenv').config();
const axios = require("axios");

const get_zip_URL = async (req,res) => {
    axios.get(process.env.BUILD_QUEUE_SERVICE_URL+'/dequeue')
    .then((result) => {
        return res.send({message: result.data.message +" \nplease enqueue this again if you want to build this project, otherwise it'll be ignored"});
    }).catch((err) => {
        return res.send({Error:err});
    });
}

module.exports = { get_zip_URL }