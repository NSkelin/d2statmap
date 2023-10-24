import {setCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import {nanoid} from "nanoid";

/**
 * Handles secure redirects to the Bungie authentication server.
 */
function getAuthURL(req, res) {
	// Create a state key to prevent csrf attacks.
	const state = nanoid();
	const token = jwt.sign(state, process.env.SIGN_SECRET);
	setCookie("state", token, {
		req,
		res,
		httpOnly: true,
		maxAge: 604800,
		sameSite: "lax",
		secure: true,
	});

	// return auth url so the user can navigate there.
	res.redirect(`https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.CLIENT_ID}&response_type=code&state=${state}`);
}

/**
 * Handles the incoming request.
 */
export default async function handler(req, res) {
	switch (req.method) {
		case "POST":
			getAuthURL(req, res);
			break;
		default:
			res.setHeader("Allow", "POST");
			res.status(405).send();
	}
}
