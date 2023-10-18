import dummyArmorData from "../../../dummyData.json" assert {type: "json"};
import validateAndRefreshAccessToken from "../../validateAndRefreshAccessToken";

const statHashs = Object.freeze({
	Accuracy: 1591432999,
	AimAssist: 1345609583,
	Airborne: 2714457168,
	AmmoCapacity: 925767036,
	Attack: 1480404414,
	BlastRadius: 3614673599,
	ChargeRate: 3022301683,
	ChargeTime: 2961396640,
	Discipline: 1735777505,
	DrawTime: 447667954,
	GuardEfficiency: 2762071195,
	GuardEndurance: 3736848092,
	GuardResistance: 209426660,
	Handling: 943549884,
	Impact: 4043523819,
	Intellect: 144602215,
	InventorySize: 1931675084,
	Magazine: 3871231066,
	Mobility: 2996146975,
	Power: 1935470627,
	Range: 1240592695,
	RecoilDir: 2715839340,
	Recovery: 1943323491,
	Reload: 4188031367,
	Resilience: 392767087,
	RPM: 4284893193,
	ShieldDuration: 1842278586,
	Stability: 155624089,
	Strength: 4244567218,
	SwingSpeed: 2837207746,
	Velocity: 2523465841,
	Zoom: 3555269338,
});

async function getPlayerInventoryItems(membershipType, destinyMembershipId, accessToken) {
	const components = "102,201,205,304";
	const url = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=${components}`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
			"authorization": `bearer ${accessToken}`,
		},
	});

	const data = await response.json();
	return data;
}

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
