import {deleteCookie} from "cookies-next";

export default function authorized(req, res) {
	if (req.method != "POST") {
		res.setHeader("Allow", "POST");
		res.status(405).send();
		return;
	}

	deleteCookie("auth", {req, res});
	res.status(200).send();
}
