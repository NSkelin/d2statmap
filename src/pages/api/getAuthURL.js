import * as dotenv from "dotenv";
dotenv.config();
import {nanoid} from "nanoid";
import jwt from "jsonwebtoken";
import {setCookie} from "cookies-next";

export default async function getAuthURL(req, res) {
	if (req.method != "POST") {
		res.setHeader("Allow", "POST");
		res.status(405).send();
		return;
	}

	const state = nanoid();
	const token = jwt.sign(state, process.env.SECRET);

	setCookie("state", token, {
		req,
		res,
		httpOnly: true,
		maxAge: 604800,
		sameSite: "lax",
		// secure: true -------------------------> enable when live
	});

	// return auth url so the user can navigate there.
	res.json({url: `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.CLIENT_ID}&response_type=code&state=${state}`});
}
