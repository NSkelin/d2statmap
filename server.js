require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: __dirname});
})

app.get("/armor", (req, res) => {
    const data = require("./dummyData");
    res.send(data);
})

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})