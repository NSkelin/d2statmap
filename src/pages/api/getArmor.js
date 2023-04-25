import dummyArmorData from "./dummyData.json" assert {type: "json"};

export default function getArmor(req, res) {
	res.send(dummyArmorData);
}
