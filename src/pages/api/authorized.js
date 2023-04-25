import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import {getCookie} from "cookies-next";

export default function authorized(req, res) {
	// get state from the jwt inside the cookie
	const cookie = getCookie("state", {req, res});
	if (cookie === undefined) {
		res.redirect("/");
		return;
	}

	const state = jwt.verify(cookie, process.env.SECRET);

	if (req.query.state === state) {
		// send code to api // req.query.code
		res.redirect("/");
	} else res.status(403).send("failed to authenticate.");
}
