import * as dotenv from "dotenv";
dotenv.config();
import {nanoid} from "nanoid";
import jwt from "jsonwebtoken";
import {setCookie} from "cookies-next";

export default function login(req, res) {
	const state = nanoid();
	const token = jwt.sign(state, process.env.SECRET);

	setCookie("state", token, {
		httpOnly: true,
		maxAge: 604800,
		sameSite: "lax",
		// secure: true -------------------------> enable when live
	});

	// redirect to oauth
	res.redirect(`https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.CLIENT_ID}&response_type=code&state=${state}`);
}
