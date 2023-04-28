import dummyArmorData from "../../../dummyData.json" assert {type: "json"};

export default function getArmor(req, res) {
	if (req.method != "GET") {
		res.setHeader("Allow", "GET");
		res.status(405).send();
		return;
	}
	return new Promise((resolve) => {
		setTimeout(() => {
			res.status(200).json(dummyArmorData);
			resolve();
		}, 3000);
	});
}
