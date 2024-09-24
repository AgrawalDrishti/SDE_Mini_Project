require("dotenv").config();

const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();

app.use(express.json());
app.use(fileUpload());


app.listen(process.env.PORT,()=>{
    console.log("Server is running",process.env.PORT);
})

app.get("/",(req,res) => {
    res.send({message:"I'm running"});
});

app.use("/upload",require("./routes/upload_routes.js"));
