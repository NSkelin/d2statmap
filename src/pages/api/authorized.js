import {deleteCookie, getCookie, setCookie} from "cookies-next";
import jwt from "jsonwebtoken";

/** Requests an access token from bungie for the current user. */
async function fetchAccessToken(code) {
	// Construct the form to send to bungie.
	const formData = new URLSearchParams();
	formData.append("grant_type", "authorization_code");
	formData.append("code", code);
	formData.append("client_id", process.env.CLIENT_ID);
	formData.append("client_secret", process.env.CLIENT_SECRET);

	// Fetch access token.
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

/** Handles the redirect from bungie after a user authorizes this app. Ensure a csrf didnt happen, then creates a session / auth cookie
 * for the user to use the app and redirects them inside. */
async function authorized(req, res) {
	// Get the state sent with the original auth request.
	const stateCookie = getCookie("state", {req, res});
	if (stateCookie === undefined) {
		res.status(307).redirect("/authenticate");
		return;
	}
	const state = jwt.verify(stateCookie, process.env.SIGN_SECRET);

	// Confirm the state is the same to prevent ensure a cross-site request forgery (csrf) did not happen.
	if (req.query.state !== state) res.status(403).send("Failed to authenticate.");

	deleteCookie("state", {req, res}); // Cleanup, no longer necessary.

	// Create a session / auth cookie with the retrieved tokens.
	const accessToken = await fetchAccessToken(req.query.code);
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
		sameSite: "lax", // Must be lax to send cookie when navigating to to the origin site from an external site (bungie auth, etc).
		secure: true,
	});

	res.status(307).redirect("/accountSelection");
}

/** Handles the incoming request. */
export default async function handler(req, res) {
	switch (req.method) {
		case "GET":
			await authorized(req, res);
			break;
		default:
			res.setHeader("Allow", "GET");
			res.status(405).send();
	}
}
