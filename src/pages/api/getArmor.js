import {getCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import {DestinyItemCategoryDefinitionsEnum, getArmorDefinitions, initializeData} from "../../armorDefinitions";
import {attemptFetch} from "../../attemptFetch";
import validateAndRefreshAccessToken from "../../validateAndRefreshAccessToken";

// Prepare the Destiny2 armor definitions on startup for later use.
await initializeData();

// The unique hash codes for most attributes in Destiny2.
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

/**
 * Fetchs all of the players Destiny2 inventories (vault, characters) and each inventory items stats.
 *
 * @param {number} membershipType The enum that represents the players membership type such as xbox, playstation, steam, etc.
 * @param {string} destinyMembershipId The players unique destiny membership ID.
 * @param {string} accessToken The auth0 token given by bungie.
 *
 * @returns {object} The players Destiny2 inventory items.
 */
async function fetchPlayerProfile(membershipType, destinyMembershipId, accessToken) {
	const components = [
		"102", // ProfileInventories	- Vault armor
		"201", // CharacterInventories	- Character armor p1
		"205", // CharacterEquipment	- Character armor p2
		"300", // ItemInstances			- Info to help filter armor from all items
		"304", // ItemStats				- Armor stats
	];

	// Fetch inventories and item stats.
	const url = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=${components.join(",")}`;
	const data = await attemptFetch(3, url, {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
			"authorization": `bearer ${accessToken}`,
		},
	});

	return data;
}

/**
 * Returns if the armor piece is masterworked or not.
 *
 * @param {string} armorInstanceId The armors unique ID that represents the specific instance of armor to check.
 * @param {object} playerProfile The profile that contains all the players inventories, their items, and the items stats.
 *
 * @returns {boolean} True / false.
 */
function getArmorPieceMasterwork(armorInstanceId, playerProfile) {
	// The energy / level of the armor. 10 energy means it has been masterworked.
	const energy = playerProfile.Response.itemComponents.instances.data[armorInstanceId].energy;
	const masterwork = energy == null ? false : energy.energyCapacity === 10;
	return masterwork;
}

/**
 * Gets the values for an armor piece's 6 stats: Mobility, Resilience, Recovery, Discipline, Intellect, and Strength.
 *
 * @param {string} armorInstanceId The armors unique ID that represents the specific instance of armor to check.
 * @param {object} playerProfile The profile that contains all the players inventories, their items, and the items stats.
 *
 * @returns {number[]} The armors 6 stats in this order: [Mobility, Resilience, Recovery, Discipline, Intellect, Strength]
 */
function getArmorPieceStats(armorInstanceId, playerProfile) {
	const itemStats = playerProfile.Response.itemComponents.stats.data[armorInstanceId].stats;
	const stats = [
		itemStats[statHashs.Mobility].value, // Mobility
		itemStats[statHashs.Resilience].value, // Resilience
		itemStats[statHashs.Recovery].value, // Recovery
		itemStats[statHashs.Discipline].value, // Discipline
		itemStats[statHashs.Intellect].value, // Intellect
		itemStats[statHashs.Strength].value, // Strength
	];

	return stats;
}

/**
 * Returns an armors class (Titan, Hunter, Warlock) and type (Helmet, Arms, Chest. Legs, Class item).
 *
 * @param {Map<string, object>} armorDefinition A stripped down version of Bungies item manfiest only containing armor. See {@link getArmorDefinitions}
 *
 * @returns {{class: number, armor_type: number}} The armors class and type.
 */
function defineArmor(armorDefinition) {
	let charClass;
	let armorType;

	// Figure out the armors class (Titan, Hunter, Warlock).
	if (armorDefinition.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Titan)) charClass = 0;
	else if (armorDefinition.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Hunter)) charClass = 1;
	else if (armorDefinition.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Warlock)) charClass = 2;

	// Figure out the armors type (Helmet, Arms, Chest. Legs, Class item).
	if (armorDefinition.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Helmet)) armorType = 0;
	else if (armorDefinition.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Arms)) armorType = 1;
	else if (armorDefinition.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Chest)) armorType = 2;
	else if (armorDefinition.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Legs)) armorType = 3;
	else if (armorDefinition.itemCategoryHashes.includes(DestinyItemCategoryDefinitionsEnum.Class)) armorType = 4;

	// eslint-disable-next-line camelcase
	return {class: charClass, armor_type: armorType}; // match object names for client side
}

/**
 * Finds all the armor from a inventory, gets its stats, and returns it.
 *
 * @param {object[]} inventory The players inventory to search such as The Vault, Character inv, or Character equipped.
 * @param {Map<string, object>} armorDefinitions A stripped down version of Bungies item manfiest only containing armor. See {@link getArmorDefinitions}
 * @param {object} playerProfile The profile that contains all the players inventories, their items, and the items stats.
 *
 * @returns {object[]} All the armor found in the inventory with their stats.
 */
function getArmorFromInventory(inventory, armorDefinitions, playerProfile) {
	const invArmor = inventory.reduce((armor, {itemHash, itemInstanceId}) => {
		// Item is armor.
		if (armorDefinitions.has(itemHash.toString())) {
			armor.push({
				...defineArmor(armorDefinitions.get(itemHash.toString())),
				stats: getArmorPieceStats(itemInstanceId, playerProfile),
				masterwork: getArmorPieceMasterwork(itemInstanceId, playerProfile),
			});
		}
		return armor;
	}, []);

	return invArmor;
}

/**
 * Finds all the armor from each character inventory, gets its stats, and returns it.
 *
 * @param {object[][]} characterInventories The character inventories to search.
 * @param {Map<string, object>} armorDefinitions A stripped down version of Bungies item manfiest only containing armor. See {@link getArmorDefinitions}
 * @param {object} playerProfile The profile that contains all the players inventories, their items, and the items stats.
 *
 * @returns {object[]} All the armor found in the inventory with their stats.
 */
function getArmorFromCharactersInventory(characterInventories, armorDefinitions, playerProfile) {
	const armor = [];
	for (const [, character] of Object.entries(characterInventories)) {
		armor.push(...getArmorFromInventory(character.items, armorDefinitions, playerProfile));
	}
	return armor;
}

/**
 * Gets all the armor owned by a player and each armors stats.
 *
 * Goes through a players entire inventory (The Vault and Character equipment & inventory).
 *
 * @param {Map<string, object>} armorDefinitions A stripped down version of Bungies item manfiest only containing armor. See {@link getArmorDefinitions}
 * @param {object} playerProfile The profile that contains all the players inventories, their items, and the items stats.
 *
 * @returns {object[]} All the armor owned by the player.
 */
function GetPlayerArmor(armorDefinitions, playerProfile) {
	const profileInventory = playerProfile.Response.profileInventory.data.items; // The Vault.
	const characterInventories = playerProfile.Response.characterInventories.data; // Items in character inventories.
	const characterEquipment = playerProfile.Response.characterEquipment.data; // Items equipped by characters.

	const playerArmor = [
		...getArmorFromInventory(profileInventory, armorDefinitions, playerProfile),
		...getArmorFromCharactersInventory(characterInventories, armorDefinitions, playerProfile),
		...getArmorFromCharactersInventory(characterEquipment, armorDefinitions, playerProfile),
	];

	return playerArmor;
}

/**
 * Handles requests to get a players armor.
 */
async function getArmor(req, res) {
	const authCookie = getCookie("auth", {req, res});
	const membershipCookie = getCookie("membership", {req, res});
	const auth = jwt.verify(authCookie, process.env.SIGN_SECRET);
	const membership = jwt.verify(membershipCookie, process.env.SIGN_SECRET);

	const armorDefinitions = getArmorDefinitions();
	// Armor definitions are empty
	if (armorDefinitions.size === 0) return res.status(502).json({error: "API_UNAVAILABLE", message: "Failed to fetch manifest."});

	try {
		const playerProfile = await fetchPlayerProfile(membership.type, membership.id, auth.accessToken);
		const playerArmor = GetPlayerArmor(armorDefinitions, playerProfile);

		return res.status(200).json(playerArmor);
	} catch {
		// Failed to fetch player profile
		return res.status(502).json({error: "API_UNAVAILABLE", message: "Failed to fetch player profile."});
	}
}

/**
 * Handles the incoming request.
 */
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
