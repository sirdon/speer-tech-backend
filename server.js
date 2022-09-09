const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const Router = require('./routes/route')
// read env
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

// middleware

app.get('/', (req, res) => {
    res.send(200).json({ message: "health check successful" })
})

app.use("/api/v1", Router)

app.listen(PORT, (err) => {
    if (err) console.log("server fail", err);
    else console.log("listening on port " + PORT)
});