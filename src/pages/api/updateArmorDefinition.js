// definitions from manifest - common/destiny2_content/json/en/DestinyItemCategoryDefinition
const DestinyItemCategoryDefinitionsEnum = Object.freeze({
	Armor: 20,
	Warlock: 21,
	Titan: 22,
	Hunter: 23,
	Helmet: 45,
	Arms: 46,
	Chest: 47,
	Legs: 48,
	Class: 49,
});

async function fetchManifest() {
	const response = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", {
		method: "GET",
	});
	const data = await response.json();
	return data;
}

async function fetchInvItemDefinitions() {
	const manifest = await fetchManifest();
	const invURL = "https://www.bungie.net" + manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition;
	const response = await fetch(invURL, {
		method: "GET",
	});
	const data = await response.json();
	return data;
}

async function getD2ArmorDefinitions() {
	const mapOfDestinyArmorItems = new Map();

	const items = await fetchInvItemDefinitions();
	for (const [key, value] of Object.entries(items)) {
		if (value.redacted === true) continue;
		else if (value.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Armor)) {
			mapOfDestinyArmorItems.set(key, value);
		}
	}

	return mapOfDestinyArmorItems;
}

export default async function handler(req, res) {
	switch (req.method) {
		case "GET":
			await getD2ArmorDefinitions();
			res.status(200).send("ok");
			break;
		default:
			res.setHeader("Allow", "GET");
			res.status(405).send();
	}
}
