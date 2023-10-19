import {getCookie, setCookie} from "cookies-next";
import jwt from "jsonwebtoken";

async function saveSelectedProfile(req, res) {
	const membershipType = req.body;

	const authCookie = getCookie("auth", {req, res});
	const authData = jwt.verify(authCookie, process.env.SIGN_SECRET);

	const idsCookie = getCookie("membershipIds", {req, res});
	const memberships = jwt.verify(idsCookie, process.env.SIGN_SECRET);

	const maxAge = authData.refreshTokenExpiresAt - Math.floor(Date.now() / 1000);

	const token = {
		id: memberships[membershipType],
		type: membershipType,
	};

	const signedToken = jwt.sign(token, process.env.SIGN_SECRET);
	setCookie("membership", signedToken, {
		req,
		res,
		httpOnly: true,
		maxAge: maxAge,
		sameSite: "strict",
		secure: true,
	});
	res.status(200).send("ok");
}

/** Handles the incoming request. */
export default async function handler(req, res) {
	switch (req.method) {
		case "POST":
			await saveSelectedProfile(req, res);
			break;
		default:
			res.setHeader("Allow", "POST");
			res.status(405).send();
	}
}
