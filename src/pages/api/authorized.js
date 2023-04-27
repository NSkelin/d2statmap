import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import {getCookie, setCookie, deleteCookie} from "cookies-next";

export default function authorized(req, res) {
	// get state from the jwt inside the cookie
	const cookie = getCookie("state", {req, res});
	if (cookie === undefined) {
		res.redirect("/authenticate");
		return;
	}

	const state = jwt.verify(cookie, process.env.SECRET);

	if (req.query.state === state) {
		deleteCookie("state", {req, res});
		// send code to api // req.query.code
		setCookie("auth", true, {
			req,
			res,
			httpOnly: true,
			maxAge: 604800,
			sameSite: "strict",
			// secure: true -------------------------> enable when live
		});
		res.redirect("/");
	} else res.status(403).send("failed to authenticate.");
}
