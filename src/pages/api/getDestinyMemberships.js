import {getCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import validateAndRefreshAccessToken from "../../validateAndRefreshAccessToken";

async function getMemberships(accessToken) {
	const response = await fetch("https://www.bungie.net/Platform//User/GetMembershipsForCurrentUser/", {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
			"authorization": `bearer ${accessToken}`,
		},
	});

	const data = await response.json();

	const d2Memberships = data.Response.destinyMemberships.reduce((accumulator, membership) => {
		accumulator.push({
			membershipType: membership.membershipType,
		});
		return accumulator;
	}, []);

	const memberships = {
		uniqueName: data.Response.bungieNetUser.uniqueName,
		destinyMemberships: d2Memberships,
	};

	return memberships;
}

async function getDestinyMemberships(req, res) {
	const cookie = getCookie("auth", {req, res});
	const auth = jwt.verify(cookie, process.env.SIGN_SECRET);

	const memberShips = await getMemberships(auth.accessToken);

	res.status(200).json(memberShips);
}

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
