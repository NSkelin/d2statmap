import cron from "node-cron";
import {attemptFetch} from "./attemptFetch";

let armorDefinitions = new Map();
// the node-cron task that updates the data each week.
let fetchTask;

/**
 * Bungie uses Destiny.Definitions.DestinyItemCategoryDefinition to categorize items.
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

/**
 * Fetchs the Destiny2 manifest from bungies API.
 *
 * The manifest is necessary to filter out a players armor.
 *
 * @returns The Destiny2 manifest response.
 */
async function fetchManifest() {
	const data = await attemptFetch(3, "https://www.bungie.net/Platform/Destiny2/Manifest/", {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
		},
	});
	return data;
}

/**
 * Fetchs the english list of Destiny2 inventory item definitions from the Bungie API.
 *
 * @returns The inventory item definition response.
 */
async function getInvItemDefinitions() {
	const manifest = await fetchManifest();
	const invURL = "https://www.bungie.net" + manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition;

	const data = await attemptFetch(3, invURL, {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
		},
	});
	return data;
}

/**
 * Searches through the Destiny2 inventory item definitions for armor and returns that armor in a new Map.
 *
 * @returns {Promise<Map<string, object>>} The armor definitions.
 */
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

/**
 * Updates the Destiny 2 armor definitions Map with the latest from Bungie,
 * and creates a schedule to automatically update every tuesday at 6pm PST.
 *
 * Subsequent calls to this function will stop the old schedule and create a new one for the same time, effectively doing nothing.
 * As such it is a wasted call and a console warning will be sent.
 */
async function UpdateArmorDefinitionsEachTuesday() {
	try {
		const armorDefinitions = await getD2ArmorDefinitions();
		setArmorDefinitions(armorDefinitions);

		// Clear the old task and warn about calling the same schedule twice.
		if (fetchTask) {
			console.warn("WARN: fetchDataOnSchedule() is being called twice!");
			fetchTask.stop();
		}

		// Fetch at 18:00 each tuesday, because Bungies weekly Destiny2 update is every tuesday.
		fetchTask = cron.schedule("0 18 * * Tuesday", UpdateArmorDefinitionsEachTuesday, {
			scheduled: true,
			timezone: "America/Los_Angeles",
		});
	} catch {
		// Failed to get new armor definitions.
		if (armorDefinitions.size() === 0) {
			// There are no armor definitions at all (really bad!) so retry every 5 minutes until there are.
			setTimeout(() => {
				UpdateArmorDefinitionsEachTuesday();
			}, 5 * 60 * 1000); // 5 minutes in milliseconds
		} else {
			// Failed to do the weekly update so the armor definitions exist but are stale. Retry every so often until it succeeds.
			setTimeout(() => {
				UpdateArmorDefinitionsEachTuesday();
			}, 30 * 60 * 1000); // 30 minutes in milliseconds
		}
	}
}

/**
 * Replaces the armorDefinitions Map with the given Map.
 *
 * @param {Map} newMap The Map to replace the current one with.
 */
function setArmorDefinitions(newMap) {
	armorDefinitions = newMap;
}

/**
 * @returns {Map<string, object>} The armor definitions.
 */
export function getArmorDefinitions() {
	return armorDefinitions;
}

/**
 * Creates the initial armor definitions and starts a weekly schedule to keep the definitions upto date.
 *
 * This function only needs to be called once, so a console warning is displayed if called more than once.
 *
 * @returns The newly created armor definitions.
 */
export async function initializeData() {
	if (fetchTask) {
		console.warn("WARN: InitializeData() is being called twice!");
		fetchTask.stop();
	}
	await UpdateArmorDefinitionsEachTuesday();
	return getArmorDefinitions();
}
