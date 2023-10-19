import {getCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import validateAndRefreshAccessToken from "../../validateAndRefreshAccessToken";

/** Fetches and returns the result of calling https://www.bungie.net/Platform//User/GetMembershipsForCurrentUser/
 *
 * @param {string} accessToken A unique authorization token supplied by bungie for a user.
 */
async function fetchUserMemberships(accessToken) {
	const response = await fetch("https://www.bungie.net/Platform//User/GetMembershipsForCurrentUser/", {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
			"authorization": `bearer ${accessToken}`,
		},
	});

	const data = await response.json();
	return data.Response;
}

/** Gets the enums that represent the platforms a user has accounts for (Steam, Xbox, etc.) and their unique bungie name
 * for the user associated with the accessToken.
 *
 * @param {string} accessToken A unique authorization token supplied by bungie for a user.
 * @returns An object with the users unique bungie.net name and an array of their destiny membership types.
 */
async function getMemberships(accessToken) {
	const response = await fetchUserMemberships(accessToken);

	// Get the enums that represents the platforms a user has accounts for (Steam, Xbox, etc.).
	const d2Memberships = response.destinyMemberships.reduce((accumulator, membership) => {
		accumulator.push({
			membershipType: membership.membershipType,
		});
		return accumulator;
	}, []);

	// Get the users unique bungie.net name and package it in an object with their destiny memberships.
	const memberships = {
		uniqueName: response.bungieNetUser.uniqueName,
		destinyMemberships: d2Memberships,
	};

	return memberships;
}

/** Fetchs all the platforms (Steam, Xbox, etc.) the user has a destiny account on. */
async function getDestinyMemberships(req, res) {
	const cookie = getCookie("auth", {req, res});
	const auth = jwt.verify(cookie, process.env.SIGN_SECRET);

	const memberShips = await getMemberships(auth.accessToken);

	res.status(200).json(memberShips);
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
