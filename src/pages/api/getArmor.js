import {getCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import {DestinyItemCategoryDefinitionsEnum, getArmorDefinitions, initializeData} from "../../armorDefinitions";
import validateAndRefreshAccessToken from "../../validateAndRefreshAccessToken";

await initializeData();

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

/** Gets a players entire inventory with each items stats, across all their characters and their vault.
 *
 * @param {number} membershipType The enum that represents the players membership type such as xbox, playstation, steam, etc.
 * @param {string} destinyMembershipId The players unique destiny membership ID.
 * @param {string} accessToken The auth0 token given by bungie.
 */
async function fetchPlayerInventoryItems(membershipType, destinyMembershipId, accessToken) {
	const components = [
		"102", // ProfileInventories	- Vault armor
		"201", // CharacterInventories	- Character armor p1
		"205", // CharacterEquipment	- Character armor p2
		"300", // ItemInstances			- Info to help filter armor from all items
		"304", // ItemStats				- Armor stats
	];

	const url = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=${components.join(",")}`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.CLIENT_API_KEY,
			"authorization": `bearer ${accessToken}`,
		},
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		console.log(response.status);
		console.log(response);
	}
}

/** Returns if the armor piece is masterworked or not. */
function getArmorPieceMasterwork(armorInstanceId, playerInventory) {
	// The energy / level of the armor. 10 energy means it has been masterworked.
	const energy = playerInventory.Response.itemComponents.instances.data[armorInstanceId].energy;
	const masterwork = energy == null ? false : energy.energyCapacity === 10;
	return masterwork;
}

/** Gets the armor piece's stats. */
function getArmorPieceStats(armorInstanceId, playerInventory) {
	const itemStats = playerInventory.Response.itemComponents.stats.data[armorInstanceId].stats;
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

/** Returns an armors class (Titan, Hunter, Warlock) and type (Helmet, Arms, Chest. Legs, Class item). */
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

/** Finds all the armor from an inventory and returns a new version of it. */
function getArmorFromInventory(inventory, armorDefinitions, playerInventory) {
	const invArmor = inventory.reduce((armor, {itemHash, itemInstanceId}) => {
		// item is armor
		if (armorDefinitions.has(itemHash.toString())) {
			armor.push({
				...defineArmor(armorDefinitions.get(itemHash.toString())),
				stats: getArmorPieceStats(itemInstanceId, playerInventory),
				masterwork: getArmorPieceMasterwork(itemInstanceId, playerInventory),
			});
		}
		return armor;
	}, []);

	return invArmor;
}

/** Iterates over each character to get the armor from their inventory. */
function getArmorFromCharactersInventory(characters, armorDefinitions, playerInventory) {
	const armor = [];
	for (const [, character] of Object.entries(characters)) {
		armor.push(...getArmorFromInventory(character.items, armorDefinitions, playerInventory));
	}
	return armor;
}

/** Goes through a players entire inventorys (characters, vault) and gets only the armor. */
function GetPlayerArmor(armorDefinitions, playerInventory) {
	const profileInventory = playerInventory.Response.profileInventory.data.items;
	const characterInventories = playerInventory.Response.characterInventories.data;
	const characterEquipment = playerInventory.Response.characterEquipment.data;

	const playerArmor = [
		...getArmorFromInventory(profileInventory, armorDefinitions, playerInventory),
		...getArmorFromCharactersInventory(characterInventories, armorDefinitions, playerInventory),
		...getArmorFromCharactersInventory(characterEquipment, armorDefinitions, playerInventory),
	];

	return playerArmor;
}

async function getArmor(req, res) {
	const authCookie = getCookie("auth", {req, res});
	const membershipCookie = getCookie("membership", {req, res});
	const auth = jwt.verify(authCookie, process.env.SIGN_SECRET);
	const membership = jwt.verify(membershipCookie, process.env.SIGN_SECRET);

	const armorDefinitions = getArmorDefinitions();
	// getPlayerInventoryItems(auth.destinyMemberships[0].membershipType, auth.destinyMemberships[0].membershipId, auth.accessToken);
	const playerInventory = await fetchPlayerInventoryItems(membership.type, membership.id, auth.accessToken);
	const playerArmor = GetPlayerArmor(armorDefinitions, playerInventory);

	return res.status(200).json(playerArmor);
}

/** Handles the incoming request. */
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
