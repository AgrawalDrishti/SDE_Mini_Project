require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log('Server is running', process.env.PORT);
});

app.get('/', (req, res) => {    
    res.send({ message: "I'm running" });
});

