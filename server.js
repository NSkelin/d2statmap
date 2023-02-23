require("dotenv").config();
const {nanoid} = require("nanoid");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(cookieParser());

function getArmor() {
	return require("./dummyData");
}

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: __dirname});
});

app.get("/armor", (req, res) => {
	res.send(getArmor());
});

app.get("/login", (req, res) => {
	const state = nanoid();
	const token = jwt.sign(state, process.env.SECRET);
	res.cookie("state", token, {
		httpOnly: true,
		maxAge: 604800,
		sameSite: "lax",
		// secure: true -------------------------> enable when live
	});

	// redirect to oauth
	res.redirect(`https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.CLIENT_ID}&response_type=code&state=${state}`);
});

app.get("/authorized", (req, res) => {
	// get state from the jwt inside the cookie
	const state = jwt.verify(req.cookies["state"], process.env.SECRET);

	if (req.query.state === state) {
		// send code to api // req.query.code
		res.redirect("/");
	} else res.status(403).send("failed, possible Cross Site Request Forgery");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
