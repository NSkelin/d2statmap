import {deleteCookie} from "cookies-next";

/**
 * Deletes all of the session cookies.
 */
function logOut(req, res) {
	deleteCookie("auth", {req, res});
	deleteCookie("membership", {req, res});
	res.status(200).send();
}

/**
 * Handles the incoming request.
 */
export default async function handler(req, res) {
	switch (req.method) {
		case "POST":
			logOut(req, res);
			break;
		default:
			res.setHeader("Allow", "POST");
			res.status(405).send();
	}
}
