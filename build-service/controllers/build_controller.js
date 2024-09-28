require('dotenv').config();
const axios = require("axios");

const get_zip_URL = async () => {
    axios.get(process.env.QUEUE_SERVICE_URL+'/dequeue')
    .then((result) => {
        // return {message:result.data};
        console.log({message:result.data});
    }).catch((err) => {
        // return {Error:err};
        console.log({Error:err});
    });
}

setInterval(() => {
    get_zip_URL();
}, 5000);

module.exports = { get_zip_URL }