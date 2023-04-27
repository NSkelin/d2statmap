import {deleteCookie} from "cookies-next";

export default function authorized(req, res) {
	deleteCookie("auth", {req, res});
	res.status(200).send();
}
