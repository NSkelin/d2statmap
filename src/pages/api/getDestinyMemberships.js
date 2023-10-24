import {getCookie, setCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import validateAndRefreshAccessToken from "../../validateAndRefreshAccessToken";

/**
 * Fetches the users Bungie memberships, including Destiny2 memberships and the Bungie account membership.
 *
 * @param {string} accessToken A unique authorization token supplied by Bungie for a user.
 *
 * @returns Returns the result of calling {@link https://www.bungie.net/Platform//User/GetMembershipsForCurrentUser/}
 */
async function fetchUserMemberships(accessToken) {
	const response = await fetch("https://www.bungie.net/Platform//User/GetMembershipsForCurrentUser/", {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
			"authorization": `bearer ${accessToken}`,
		},
	});

	if (response.ok) {
		const data = await response.json();
		return data.Response;
	} else {
		// Log errors.
		console.log(response.status);
		console.log(response);
	}
}

/**
 * Gets the enums that represent the platforms a user has accounts for (Steam, Xbox, etc.), the users associated ID for that platform,
 * and their unique bungie name, for the user associated with the accessToken.
 *
 * @param {string} accessToken A unique authorization token supplied by bungie for a user.
 *
 * @returns {{memberships: object, cookie: object}} Two objects, one with the users unique bungie.net name and an array of their destiny membership types.
 * The other with the previous data but including the users unique ID for each platform.
 */
async function getMemberships(accessToken) {
	const response = await fetchUserMemberships(accessToken);

	// Only pass the enums that represent the platforms a user has account for (steam, xbox, etc.) to the client for security.
	const client = [];
	// Save the membershipType with its attached membershipId to an encrypted cookie, to pass the eventually selected ID to the saveSelectedProfile API call.
	const cookie = {};

	// Get the data for the client array and cookie object.
	for (const {membershipType, membershipId} of response.destinyMemberships) {
		client.push({membershipType});
		cookie[membershipType] = membershipId;
	}

	// Get the users unique bungie.net name and package it in an object with their destiny memberships.
	const memberships = {
		uniqueName: response.bungieNetUser.uniqueName,
		destinyMemberships: client,
	};

	return {memberships, cookie};
}

/**
 * Fetchs all the platforms (Steam, Xbox, etc.) the user has a Destiny2 account on so they can choose their account.
 *
 * Also saves the unique ids for each account to a secure cookie so after the user chooses the account it can be saved without an additional Bungie API call.
 */
async function getDestinyMemberships(req, res) {
	const authCookie = getCookie("auth", {req, res});
	const auth = jwt.verify(authCookie, process.env.SIGN_SECRET);

	const {memberships, cookie: idsCookie} = await getMemberships(auth.accessToken);

	// Save users platform ids for use in saveSelectedProfile API.
	const signedToken = jwt.sign(idsCookie, process.env.SIGN_SECRET);
	setCookie("membershipIds", signedToken, {
		req,
		res,
		httpOnly: true,
		maxAge: 3600, // 1 hour
		sameSite: "strict",
		secure: true,
	});

	res.status(200).json(memberships);
}

/** Handles the incoming request. */
export default async function handler(req, res) {
	switch (req.method) {
		case "GET":
			await validateAndRefreshAccessToken(req, res, getDestinyMemberships);
			break;
		default:
			res.setHeader("Allow", "GET");
			res.status(405).send();
	}
}
