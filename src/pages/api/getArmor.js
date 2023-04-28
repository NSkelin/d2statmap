import dummyArmorData from "../../../dummyData.json" assert {type: "json"};

export default function getArmor(req, res) {
	if (req.method != "GET") {
		res.setHeader("Allow", "GET");
		res.status(405).send();
		return;
	}

	res.status(200).send(dummyArmorData);
}
