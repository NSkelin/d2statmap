import dummyArmorData from "../../../dummyData.json" assert {type: "json"};
import validateAndRefreshAccessToken from "../../validateAndRefreshAccessToken";

const stats = {
	1591432999: "Accuracy",
	1345609583: "AimAssist",
	2714457168: "Airborne",
	925767036: "AmmoCapacity",
	1480404414: "Attack",
	3614673599: "BlastRadius",
	3022301683: "ChargeRate",
	2961396640: "ChargeTime",
	1735777505: "Discipline",
	447667954: "DrawTime",
	2762071195: "GuardEfficiency",
	3736848092: "GuardEndurance",
	209426660: "GuardResistance",
	943549884: "Handling",
	4043523819: "Impact",
	144602215: "Intellect",
	1931675084: "InventorySize",
	3871231066: "Magazine",
	2996146975: "Mobility",
	1935470627: "Power",
	1240592695: "Range",
	2715839340: "RecoilDir",
	1943323491: "Recovery",
	4188031367: "Reload",
	392767087: "Resilience",
	4284893193: "RPM",
	1842278586: "ShieldDuration",
	155624089: "Stability",
	4244567218: "Strength",
	2837207746: "SwingSpeed",
	2523465841: "Velocity",
	3555269338: "Zoom",
};

async function getManifest() {
	const response = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", {
		method: "GET",
	});
	const data = await response.json();
	return data;
}

async function getInvItemDefinitions() {
	const manifest = await getManifest();
	const invURL = "https://www.bungie.net" + manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition;
	const response = await fetch(invURL, {
		method: "GET",
	});
	const data = await response.json();
	return data;
}

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
