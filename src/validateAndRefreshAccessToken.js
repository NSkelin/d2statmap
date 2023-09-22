import {deleteCookie, getCookie, setCookie} from "cookies-next";
import jwt from "jsonwebtoken";

/** Requests a new access token from Bungie */
async function requestNewAccessToken(refreshToken) {
	const formData = new URLSearchParams();
	formData.append("grant_type", "refresh_token");
	formData.append("refresh_token", refreshToken);
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

/** Requests a new access token and updates the auth cookie with the new access & refresh token & their expiration times */
async function refreshAccessToken(req, res, refreshToken) {
	const newAccessToken = requestNewAccessToken(refreshToken);
	const token = {
		accessToken: newAccessToken.access_token,
		accessTokenExpiresAt: Math.floor(Date.now() / 1000) + newAccessToken.expires_in,
		refreshToken: newAccessToken.refresh_token,
		refreshTokenExpiresAt: Math.floor(Date.now() / 1000) + newAccessToken.refresh_expires_in,
	};

	const signedToken = jwt.sign(token, process.env.SIGN_SECRET);
	deleteCookie("auth", {req, res});
	setCookie("auth", signedToken, {
		req,
		res,
		httpOnly: true,
		maxAge: 7776000,
		sameSite: "strict",
		secure: true,
	});
}

/** Updates the cookie holding the users selected membership to keep its expirey in sync with the authorization token.
 *
 * If the users auth expires, then the selected membership for that auth should also expire.
 */
async function updateMembershipMaxAge(req, res) {
	const membership = getCookie("membership", req, res);
	const authCookie = getCookie("auth", {req, res});

	const authData = jwt.verify(authCookie, process.env.SIGN_SECRET);

	const maxAge = authData.refreshTokenExpiresAt - Math.floor(Date.now() / 1000);

	deleteCookie("membership", {req, res});
	setCookie("membership", membership, {
		req,
		res,
		httpOnly: true,
		maxAge: maxAge,
		sameSite: "strict",
		secure: true,
	});
}

/** Validates that the access token is still valid. If not it will attempt to refresh it with the refresh token. */
export default async function validateAndRefreshAccessToken(req, res, handler) {
	const cookie = getCookie("auth", {req, res});
	// check if auth cookie doesnt exist
	if (cookie === undefined) {
		res.status(401).json("unauthorized");
		return;
	}

	const auth = jwt.verify(cookie, process.env.SIGN_SECRET);
	// date in milliseconds converted to seconds (x / 1000).
	// + 60 seconds so i dont need to worry about tokens expiring as my code is running
	const now = Date.now() / 1000 + 60;

	// validate token or refresh if possible or redirect to authenticate
	if (auth.accessTokenExpiresAt < now) {
		// access token is expired
		if (auth.refreshTokenExpiresAt < now) {
			deleteCookie("auth", {req, res});
			// refresh token is expired, reauthenticate
			res.status(401).json("unauthorized");
			return;
		} else {
			// refresh access token and update cookie
			await refreshAccessToken(req, res, auth.refreshToken);
			await updateMembershipMaxAge(req, res);
			await handler(req, res);
			return;
		}
	} else {
		// access token is valid
		await handler(req, res);
		return;
	}
}
