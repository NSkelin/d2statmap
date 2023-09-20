import dummyArmorData from "../../../dummyData.json" assert {type: "json"};
async function getArmor(req, res) {
	return new Promise((resolve) => {
		setTimeout(() => {
			res.status(200).json(dummyArmorData);
			resolve();
		}, 3000);
	});
}

export default async function handler(req, res) {
	switch (req.method) {
		case "GET":
			await validateAndRefreshAccessToken(req, res, getArmor);
			break;
		default:
			res.setHeader("Allow", "GET");
			res.status(405).send();
	}
}
