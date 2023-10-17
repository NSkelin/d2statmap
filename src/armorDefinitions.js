import cron from "node-cron";

let armorDefinitions = new Map();
// the node-cron task that updates the data each week.
let fetchTask;

/** Bungie uses Destiny.Definitions.DestinyItemCategoryDefinition to categorize items.
 * This enum / object contains the definitions used for armor with each value being the unique hash used by bungie.
 *
 * The definitions can be found by following the link inside the manifest at Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemCategoryDefinition
 */
export const DestinyItemCategoryDefinitionsEnum = Object.freeze({
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
async function fetchDataOnSchedule() {
	const armorDefinitions = await getD2ArmorDefinitions();
	setArmorDefinitions(armorDefinitions);

	// fetch at 18:00 each tuesday
	fetchTask = cron.schedule("0 18 * * Tuesday", fetchDataOnSchedule, {
		scheduled: true,
		timezone: "America/Los_Angeles",
	});
}

/** Replaces the armorDefinitions Map with the given Map.
 * @param {Map} newMap The Map to replace the current one with.
 */
function setArmorDefinitions(newMap) {
	armorDefinitions = newMap;
}

/** Returns the Map of armor definitions. */
export function getArmorDefinitions() {
	return armorDefinitions;
}

/** Starts the initial call to fetch the armor definitions and start the cron job to update them weekly.
 *
 * Should only be called once.*/
export async function initializeData() {
	if (fetchTask) {
		console.warn("WARN: InitializeData() is being called twice!");
		fetchTask.stop();
	}
	await fetchDataOnSchedule();
	return getArmorDefinitions();
}
