import {deleteCookie, getCookie, setCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import {attemptFetch} from "../../attemptFetch";

/**
 * Requests an access token from bungie for the current user.
 *
 * @param {string} code Authorization code received from the authorization endpoint
 *
 * @returns The authorization object returned by Bungie.
 */
async function fetchAccessToken(code) {
	// Construct the form to send to bungie.
	const formData = new URLSearchParams();
	formData.append("grant_type", "authorization_code");
	formData.append("code", code);
	formData.append("client_id", process.env.CLIENT_ID);
	formData.append("client_secret", process.env.CLIENT_SECRET);

	// Fetch access token.
	const data = await attemptFetch(3, "https://www.bungie.net/platform/app/oauth/token/", {
		method: "POST",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: formData.toString(),
	});

	return data;
}

/**
 * Confirms a users authorization with Bungie.
 *
 * When a user authorizes this app, Bungie will redirect them to this endpoint.
 * The endpoint ensures a csrf didnt happen and then creates a session for the user
 * before redirecting them to the account selection page.
 *
 * See {@link https://github.com/Bungie-net/api/wiki/OAuth-Documentation} for more info.
 */
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

	// Cleanup state as its no longer necessary.
	deleteCookie("state", {req, res});

	// Create a session / auth cookie with the given auth tokens.
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
		sameSite: "lax", // Must be lax so we can send the auth cookie when redirecting to account selection. (Origin is Bungie).
		secure: true,
	});

	res.status(307).redirect("/accountSelection");
}

/**
 * Handles the incoming request.
 */
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
