import {getCookie, setCookie} from "cookies-next";
import jwt from "jsonwebtoken";

async function saveSelectedProfile(req, res) {
	const membership = req.body;
	const authCookie = getCookie("auth", {req, res});

	const authData = jwt.verify(authCookie, process.env.SIGN_SECRET);

	const maxAge = authData.refreshTokenExpiresAt - Math.floor(Date.now() / 1000);

	setCookie("membership", membership, {
		req,
		res,
		httpOnly: true,
		maxAge: maxAge,
		sameSite: "strict",
		secure: true,
	});
	res.status(200).send("ok");
}

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
