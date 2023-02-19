const express = require("express");
const app = express();
const port = 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: __dirname});
})

app.get("/armor", (req, res) => {
    const data = require("./dummyData");
    res.send(data);
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})