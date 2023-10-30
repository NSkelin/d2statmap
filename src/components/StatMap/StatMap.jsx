import PropTypes from "prop-types";
import React, {useContext, useState} from "react";
import BootsIcon from "../../assets/boots.svg";
import ChestIcon from "../../assets/chest.svg";
import GlovesIcon from "../../assets/gloves.svg";
import {default as ClassIcon, default as HelmetIcon} from "../../assets/helmet.svg";
import useArmor from "../../customHooks/useArmor";
import useCheckbox from "../../customHooks/useCheckbox";
import {DemoContext} from "../../demoContext";
import Button from "../Button";
import CheckBox from "../CheckBox";
import HeatMap from "../HeatMap";
import IconCount from "../IconCount";
import Menu from "../Menu";
import SelectOneButton from "../SelectOneButton";
import Title from "../Title";
import styles from "./StatMap.module.css";

// Enum definitions for values returned by API related to character classes.
const characterClasses = Object.freeze({
	0: "Titan",
	1: "Hunter",
	2: "Warlock",
	3: "unknown",
});

// Enum definitions for values returned by API related to armor types.
const armorTypes = Object.freeze({
	0: "helmet",
	1: "gloves",
	2: "chest",
	3: "boots",
	4: "classItem",
});

/**
 * Goes through all the armor and counts the total pieces for each class
 * and counts the total for each type of armor grouped by class.
 *
 * @param {array} armorData The armor to count.
 *
 * @returns {object} An object that contains the total armor count for each class as well as the type breakdown of those armors.
 */
function countArmor(armorData) {
	const armorCounts = {};

	for (const armor of armorData) {
		const armorClass = characterClasses[armor.class];

		// Count class total.
		if (armorCounts[armorClass] === undefined) {
			// Class total doesnt exist so create a new total.
			armorCounts[armorClass] = {total: 1};
		} else {
			// Add 1 to total.
			armorCounts[armorClass].total = armorCounts[armorClass].total + 1;
		}

		// Count armor type total grouped by class.
		const armorType = armorTypes[armor.armor_type];
		if (armorCounts[armorClass][armorType] === undefined) {
			// Armor type total doesnt exist so create a new total.
			armorCounts[armorClass][armorType] = 1;
		} else {
			// Add 1 to total.
			armorCounts[armorClass][armorType] = armorCounts[armorClass][armorType] + 1;
		}
	}

	return armorCounts;
}

/**
 * Selects the armor matching the filters and converts their stats into values for the heatmap.
 *
 * This function is a helper that runs the filterArmor() func, passes the result to getArmorStats(),
 * passes that result to normalizeArmorStats(), and then returns the result.
 *
 * @see {@link filterArmor}, {@link getArmorStats}, {@link normalizeArmorStats}
 * @param {array} armorData The armor to filter from.
 * @param {string} allowedClass The allowed armor class.
 * @param {object} allowedArmorTypes The allowed types of armor.
 * @param {boolean} assumeMasterwork Adds +2 to each armors stat if the armor is not already masterworked.
 * @param {number} minRange Start of the range.
 * @param {number} maxRange End of the range.
 * @param {number} normalizeCount The amount to divide each points stat count by to get the range point percentage.
 * @returns {number[]} The normalized stats.
 */
function parseArmor(armorData, allowedClass, allowedArmorTypes, assumeMasterwork, minRange, maxRange, normalizeCount) {
	const filteredArmor = filterArmor(armorData, allowedClass, allowedArmorTypes);
	const stats = getArmorStats(filteredArmor, assumeMasterwork);
	return normalizeArmorStats(stats, minRange, maxRange, normalizeCount);
}

/**
 * Searches through the armor and returns the pieces that match the allowed class and types.
 *
 * @param {array} armorData The armor to search through.
 * @param {string} allowedClass The allowed armor class.
 * @param {object} allowedArmorTypes The allowed types of armor.
 *
 * @returns The armor that matched the filters.
 */
function filterArmor(armorData, allowedClass, allowedArmorTypes) {
	const filteredArmor = [];

	// Get armor that matches the filters.
	for (const armor of armorData) {
		const armorClass = characterClasses[armor.class];
		const armorType = armorTypes[armor.armor_type];

		// Skip armor piece if its the wrong class or type.
		if (armorClass != allowedClass) continue;
		else if (allowedArmorTypes[armorType] === false) continue;

		filteredArmor.push(armor);
	}

	return filteredArmor;
}

/**
 * Goes through each armor and adds their stats to separate arrays grouped by the stats type.
 *
 * The types are based on the position of the stat in the original array. The types are as follows:
 *
 * [
 * - [Mobility stats],
 * - [Resilience stats],
 * - [Recovery stats],
 * - [Discipline stats],
 * - [Intellect stats],
 * - [Strength stats]
 *
 * ]
 *
 * @param {array} armors The armors to get the stats of.
 * @param {boolean} assumeMasterwork Adds +2 to each armors stat if the armor is not already masterworked.
 *
 * @returns {number[][]} Each armors stats, grouped by type.
 */
function getArmorStats(armors, assumeMasterwork) {
	let stats = [[], [], [], [], [], []];

	for (const armor of armors) {
		// Add each stat to the corresponding array.
		for (let [i, stat] of armor.stats.entries()) {
			// Adds +2 to each armors stat if the armor is not already masterworked.
			if (assumeMasterwork && !armor.masterwork) stat += 2;
			stats[i].push(stat);
		}
	}

	return stats;
}

/**
 * For each point in the range, get the percentage of stats higher than the current point
 * for each array.
 *
 * Runs the normalizeStats() function for each array in the armorStats parameter.
 *
 * @see {@link normalizeStats} for more info.
 * @param {number[][]} armorStats The stats that corresponding to each type of stats. (Mobility, Strength, etc.)
 * @param {number} minRange Start of the range.
 * @param {number} maxRange End of the range.
 * @param {number} normalizeCount The amount to divide each points stat count by to get the range point percentage.
 * @returns {number[][]} The normalized stats.
 */
function normalizeArmorStats(armorStats, minRange, maxRange, normalizeCount) {
	let normalizedArmorStats = [];
	for (let stats of armorStats) {
		normalizedArmorStats.push(normalizeStats(stats, minRange, maxRange, normalizeCount));
	}
	return normalizedArmorStats;
}

/**
 * For each point in the range, get the percentage of stats higher than the current point.
 *
 * Each point in the range is given a value from 1 - 0.00, with 1 being 100% and 0 being 0%.
 * The percentage is calculated using the total stats above the current point in the range
 * divided by the normalizeCount.
 *
 * This value is then used to get the color / intensity of each point on the stats heat map.
 * So the first point on the heatmap having the most stats is the most intense part of the heat map.
 *
 * @param {number[]} stats The array of stats corresponding to one type of stats. (ex: Mobility)
 * @param {number} minRange Start of the range.
 * @param {number} maxRange End of the range.
 * @param {number} normalizeCount The amount to divide each points stat count by to get the range point percentage.
 *
 * @returns {number[]} The normalized stats.
 *
 * @example
 * const stats = [2,3,4,5,10,11,25,60];
 * const normalizedStats = normalizeStats(stats, 2, 10, 8);
 * console.log(normalizedStats); // [1, 0.88, 0.75, 0.63, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50]
 */
function normalizeStats(stats, minRange, maxRange, normalizeCount) {
	// Sort stats into ascending order.
	stats.sort((a, b) => a - b);

	const normalizedValues = [];
	let arrPosition = 0;

	//  Get the percentage for each point on the range.
	for (let i = minRange; i <= maxRange + 1; i++) {
		// Goes through the stat array until the stats are equal or greater than the current range value.
		//  v                 v               v
		// [2, 2, 2]  ->  [2, 2, 2] -> [2, 2, 2]
		while (stats[arrPosition] < i && arrPosition < stats.length) {
			arrPosition++;
		}

		//        v           (arr position)
		// [2, 2, 2, 2, 2]    (stats array)
		// Remaining length = 3 (5 - 2)
		const remainingArrLength = stats.length - arrPosition;
		// Normalize the stat to a value from 1 to 0.00.
		const normalizedValue = Math.round((remainingArrLength / normalizeCount) * 100) / 100; // Rounds to 2 decimal points.
		normalizedValues.push(normalizedValue);
	}

	return normalizedValues;
}

/**
 * Renders a users Destiny2 armor data with a heatmap for each individual stat type. Includes multiple options for
 * filtering and controlling how the data is presented.
 *
 * @param {number} minRange Sets the minimum range the heatmap will show for each stat type.
 * @param {number} maxRange Sets the maximum range the heatmap will show for each stat type.
 */
function StatMap({minRange, maxRange}) {
	const demo = useContext(DemoContext);
	const [selectedClass, setSelectedClass] = useState("Hunter");
	const [selectedArmorTypes, setSelectedArmorTypes] = useState({helmet: true, gloves: true, chest: true, boots: true, classItem: true});
	const {armorData, loading, error} = useArmor(demo);
	const {checked: assumeMasterwork} = useCheckbox("assumeMasterwork");

	/**
	 * Updates the selected button for the class selection buttons.
	 */
	function handleClassSelect(buttonText) {
		setSelectedClass(buttonText);
	}

	/**
	 * Toggles the clicked armor type buttons selected state.
	 */
	function handleArmorTypesSelection(e) {
		let name = e.currentTarget.name;
		let value = selectedArmorTypes[name] ? false : true;
		setSelectedArmorTypes({
			...selectedArmorTypes,
			[name]: value,
		});
	}

	// Get the armor data needed for rendering the components.
	const armorCount = countArmor(armorData);
	const normalizedStats = parseArmor(
		armorData,
		selectedClass,
		selectedArmorTypes,
		assumeMasterwork,
		minRange,
		maxRange,
		armorCount[selectedClass].total
	);

	// Loading spinner handled outside component so just return blank.
	if (loading) return <></>;
	else if (error) return <p>Error occurred.</p>;

	return (
		<main className={styles.center}>
			<Menu title="Stat map" titleBG="#282828" bodyBG="#383838">
				<Title title="Class selection">
					<SelectOneButton
						onSelect={handleClassSelect}
						selectedButtonText={selectedClass}
						buttons={[
							{stretch: true, text: "Hunter", icon: HelmetIcon, count: armorCount.Hunter.total},
							{stretch: true, text: "Warlock", icon: HelmetIcon, count: armorCount.Warlock.total},
							{stretch: true, text: "Titan", icon: HelmetIcon, count: armorCount.Titan.total},
						]}
					></SelectOneButton>
				</Title>
				<Title title="Armor selection">
					<Button name={"helmet"} onClick={handleArmorTypesSelection} selected={selectedArmorTypes.helmet}>
						<IconCount Icon={HelmetIcon} count={armorCount[selectedClass].helmet}></IconCount>
					</Button>
					<Button name={"gloves"} onClick={handleArmorTypesSelection} selected={selectedArmorTypes.gloves}>
						<IconCount Icon={GlovesIcon} count={armorCount[selectedClass].gloves}></IconCount>
					</Button>
					<Button name={"chest"} onClick={handleArmorTypesSelection} selected={selectedArmorTypes.chest}>
						<IconCount Icon={ChestIcon} count={armorCount[selectedClass].chest}></IconCount>
					</Button>
					<Button name={"boots"} onClick={handleArmorTypesSelection} selected={selectedArmorTypes.boots}>
						<IconCount Icon={BootsIcon} count={armorCount[selectedClass].boots}></IconCount>
					</Button>
					<Button name={"classItem"} onClick={handleArmorTypesSelection} selected={selectedArmorTypes.classItem}>
						<IconCount Icon={ClassIcon} count={armorCount[selectedClass].classItem}></IconCount>
					</Button>
				</Title>
				<Title title="HeatMap">
					<HeatMap armor={normalizedStats} slider={{minRange, maxRange}}></HeatMap>
				</Title>
			</Menu>
			<Menu title="Options" titleBG="#232323" bodyBG="#323232">
				<CheckBox uniqueID={"assumeMasterwork"} name={"assumeMasterwork"} title={"Assume masterwork"}></CheckBox>
				<CheckBox uniqueID={"smoothing"} name={"smoothing"} title={"Heatbar smoothing"}></CheckBox>
			</Menu>
		</main>
	);
}

StatMap.defaultProps = {
	demo: false,
};

StatMap.propTypes = {
	minRange: PropTypes.number,
	maxRange: PropTypes.number,
	demo: PropTypes.bool,
};

export default StatMap;
