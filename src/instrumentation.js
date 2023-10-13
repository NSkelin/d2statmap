var cron = require("node-cron");

/** Bungie uses Destiny.Definitions.DestinyItemCategoryDefinition to categorize items.
 * This enum / object contains the definitions used for armor with each value being the unique hash used by bungie.
 *
 * The definitions can be found by following the link inside the manifest at Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemCategoryDefinition
 */
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

/** Gets the Destiny 2 manifest from bungies API. */
async function getManifest() {
	const response = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", {
		method: "GET",
	});
	const data = await response.json();
	return data;
}

/** Gets the list of Destiny 2 inventory item definitions from the Bungie manifest. */
async function getInvItemDefinitions() {
	const manifest = await getManifest();
	const invURL = "https://www.bungie.net" + manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition;
	const response = await fetch(invURL, {
		method: "GET",
	});
	const data = await response.json();
	return data;
}

/** Searches through the Destiny 2 inventory item definitions for armor and returns that armor in a Map. */
async function getD2ArmorDefinitions() {
	const mapOfDestinyArmorItems = new Map();

	const items = await getInvItemDefinitions();
	for (const [key, value] of Object.entries(items)) {
		// Skip armor marked as redacted by bungie because they cannot be viewed.
		if (value.redacted === true) continue;
		else if (value.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Armor)) {
			mapOfDestinyArmorItems.set(key, value);
		}
	}

	return mapOfDestinyArmorItems;
}

/** Once called, this function will repeatedly fetch the Destiny 2 armor definitions from bungie every tuesday at 6pm PST. */
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
