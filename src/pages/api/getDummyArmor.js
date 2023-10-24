import dummyArmorData from "../../../dummyData.json" assert {type: "json"};

/**
 * Returns dummy armor data after a short delay.
 */
function getDummyArmor(req, res) {
	return new Promise((resolve) => {
		setTimeout(() => {
			res.status(200).json(dummyArmorData);
			resolve();
		}, 3000);
	});
}

/**
 * Handles the incoming request.
 */
export default async function handler(req, res) {
	switch (req.method) {
		case "GET":
			getDummyArmor(req, res);
			break;
		default:
			res.setHeader("Allow", "GET");
			res.status(405).send();
	}
}
