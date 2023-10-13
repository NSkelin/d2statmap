var cron = require("node-cron");

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

async function getD2ArmorDefinitions() {
	const mapOfDestinyArmorItems = new Map();

	const items = await getInvItemDefinitions();
	for (const [key, value] of Object.entries(items)) {
		if (value.redacted === true) continue;
		else if (value.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Armor)) {
			mapOfDestinyArmorItems.set(key, value);
		}
	}

	return mapOfDestinyArmorItems;
}

function fetchDataOnSchedule() {
	getD2ArmorDefinitions();

	// fetch at 18:00 each tuesday
	cron.schedule("0 18 * * Tuesday", fetchDataOnSchedule, {
		scheduled: true,
		timezone: "America/Los_Angeles",
	});
}

/** Runs each runtime once at startup. */
export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		fetchDataOnSchedule();
	}

	if (process.env.NEXT_RUNTIME === "edge") {
		return;
	}
}
