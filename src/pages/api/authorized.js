import {deleteCookie, getCookie, setCookie} from "cookies-next";
import jwt from "jsonwebtoken";

async function getAccessToken(code) {
	const formData = new URLSearchParams();
	formData.append("grant_type", "authorization_code");
	formData.append("code", code);
	formData.append("client_id", process.env.CLIENT_ID);
	formData.append("client_secret", process.env.CLIENT_SECRET);

	const response = await fetch("https://www.bungie.net/platform/app/oauth/token/", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: formData.toString(),
	});

	const data = await response.json();
	return data;
}

export default async function authorized(req, res) {
	// get state from the jwt inside the cookie
	const cookie = getCookie("state", {req, res});
	if (cookie === undefined) {
		res.status(307).redirect("/authenticate");
		return;
	}

	const state = jwt.verify(cookie, process.env.SIGN_SECRET);

	// confirm the state is the same to prevent csrf
	if (req.query.state === state) {
		deleteCookie("state", {req, res});
		const accessToken = await getAccessToken(req.query.code);

		const token = {
			accessToken: accessToken.access_token,
			accessTokenExpiresAt: Math.floor(Date.now() / 1000) + accessToken.expires_in,
			refreshToken: accessToken.refresh_token,
			refreshTokenExpiresAt: Math.floor(Date.now() / 1000) + accessToken.refresh_expires_in,
		};

		const signedToken = jwt.sign(token, process.env.SIGN_SECRET);
		setCookie("auth", signedToken, {
			req,
			res,
			httpOnly: true,
			maxAge: 7776000,
			sameSite: "strict",
			secure: true,
		});
		res.status(307).redirect("/");
	} else res.status(403).send("failed to authenticate.");
}
