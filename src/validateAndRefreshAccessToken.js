import {deleteCookie, getCookie, setCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import {attemptFetch} from "./attemptFetch";

/**
 * Requests a new access token from Bungie.
 *
 * When the users access token expires, we can no longer view their profile data needed for the app to keep running.
 * If they still have a refresh token though, we can re-authenticate them automatically without needing to pester them each hour.
 *
 * @param {string} refreshToken The users refresh token that came with the initial auth request.
 *
 * @returns The response from Bungie.
 */
async function requestNewAccessToken(refreshToken) {
	// Create form for request.
	const formData = new URLSearchParams();
	formData.append("grant_type", "refresh_token");
	formData.append("refresh_token", refreshToken);
	formData.append("client_id", process.env.CLIENT_ID);
	formData.append("client_secret", process.env.CLIENT_SECRET);

	// Request new access token.
	const data = await attemptFetch(3, "https://www.bungie.net/platform/app/oauth/token/", {
		method: "POST",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: formData.toString(),
	});

	// Return response.
	return data;
}

/**
 * Requests a new access token and updates the auth cookie with the new access & refresh token & their expiration times
 *
 * @param {string} refreshToken The users refresh token that came with the initial auth request.
 */
async function refreshAccessToken(req, res, refreshToken) {
	// Get new access token.
	const newAccessToken = await requestNewAccessToken(refreshToken);
	const token = {
		accessToken: newAccessToken.access_token,
		accessTokenExpiresAt: Math.floor(Date.now() / 1000) + newAccessToken.expires_in,
		refreshToken: newAccessToken.refresh_token,
		refreshTokenExpiresAt: Math.floor(Date.now() / 1000) + newAccessToken.refresh_expires_in,
	};

	// Update auth cookie with new token.
	const signedToken = jwt.sign(token, process.env.SIGN_SECRET);
	setCookie("auth", signedToken, {
		req,
		res,
		httpOnly: true,
		maxAge: 7776000,
		sameSite: "strict",
		secure: true,
	});
}

/**
 * Updates the cookie holding the users selected membership to keep its maxAge in sync with the authorization token.
 *
 * If the users auth expires, then the selected membership for that auth should also expire.
 */
async function updateMembershipMaxAge(req, res) {
	// Get auth cookie maxAge.
	const authCookie = getCookie("auth", {req, res});
	const authData = jwt.verify(authCookie, process.env.SIGN_SECRET);
	const maxAge = authData.refreshTokenExpiresAt - Math.floor(Date.now() / 1000);

	// Update cookie maxAge.
	const membership = getCookie("membership", {req, res});
	setCookie("membership", membership, {
		req,
		res,
		httpOnly: true,
		maxAge: maxAge,
		sameSite: "strict",
		secure: true,
	});
}

/**
 * A middleware to ensure a users authorization is still valid before continuing.
 *
 * This will check if the users access token is expired. If it is, then the refresh token will be used to refresh the access token if possible.
 * Finally, the handler will be called with the updated auth cookie.
 *
 * If the access token is expired and cant be refreshed then the cookies will be deleted, a 401 will be returned, and the handler will not be called.
 *
 * @param {async (req, res) => void} handler The function to callback if the token is valid / refreshed.
 */
export default async function validateAndRefreshAccessToken(req, res, handler) {
	const cookie = getCookie("auth", {req, res});

	// Check if auth cookie doesnt exist.
	if (cookie === undefined) {
		res.status(401).json("unauthorized");
		return;
	}

	// Date in milliseconds converted to seconds (x / 1000).
	// Add 60 seconds as a buffer so tokens dont expire immediately after in the handler.
	const now = Date.now() / 1000 + 60;

	const auth = jwt.verify(cookie, process.env.SIGN_SECRET);
	const accessTokenExpired = auth.accessTokenExpiresAt < now;
	const refreshTokenExpired = auth.refreshTokenExpiresAt < now;

	if (accessTokenExpired && refreshTokenExpired) {
		// Both tokens expired, requires re-authentication.
		deleteCookie("auth", {req, res});
		deleteCookie("membership", {req, res});
		res.status(401).json("unauthorized");
	} else if (accessTokenExpired) {
		// Refresh access token and update cookies.
		try {
			await refreshAccessToken(req, res, auth.refreshToken);
			await updateMembershipMaxAge(req, res);
			await handler(req, res);
		} catch {
			// Failed to fetch a new access token.
			return res.status(502).json({error: "API_UNAVAILABLE", message: "Failed to refresh access token."});
		}
	} else {
		// Access token is valid.
		await handler(req, res);
	}
}
