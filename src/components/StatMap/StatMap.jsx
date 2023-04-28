import React, {useState} from "react";
import PropTypes from "prop-types";
import styles from "./StatMap.module.css";
import Menu from "../Menu";
import Title from "../Title";
import HeatMap from "../HeatMap";
import Button from "../Button";
import CheckBox from "../CheckBox";
import SelectOneButton from "../SelectOneButton";
import HelmetIcon from "../../assets/helmet.svg";
import GlovesIcon from "../../assets/gloves.svg";
import ChestIcon from "../../assets/chest.svg";
import BootsIcon from "../../assets/boots.svg";
import ClassIcon from "../../assets/helmet.svg";
import IconCount from "../IconCount";
import useArmor from "../../customHooks/useArmor";

function StatMap({minRange, maxRange}) {
	const [selectedClass, setSelectedClass] = useState("Hunter");
	const [selectedArmorTypes, setSelectedArmorTypes] = useState({helmet: true, gloves: true, chest: true, boots: true, classItem: true});
	const [options, setOptions] = useState({assumeMasterwork: false, simpleArmor: false, smoothing: false});
	const {armorData, loading, error} = useArmor();

	function handleClassSelect(buttonText) {
		setSelectedClass(buttonText);
	}

	function handleArmorTypesSelection(e) {
		let name = e.currentTarget.name;
		let value = selectedArmorTypes[name] ? false : true;
		setSelectedArmorTypes({
			...selectedArmorTypes,
			[name]: value,
		});
	}

	function handleOptionChange(e) {
		let name = e.currentTarget.name;
		let value = options[name] ? false : true;
		setOptions({
			...options,
			[name]: value,
		});
	}

	const armorCount = countArmor(armorData);
	const normalizedStats = parseArmor(
		armorData,
		selectedClass,
		selectedArmorTypes,
		options.assumeMasterwork,
		minRange,
		maxRange,
		armorCount[selectedClass].total
	);

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
					<HeatMap
						assumeMasterwork={options.assumeMasterwork}
						armor={normalizedStats}
						smoothing={options.smoothing}
						slider={{minRange, maxRange}}
					></HeatMap>
				</Title>
			</Menu>
			<Menu title="Options" titleBG="#232323" bodyBG="#323232">
				<CheckBox onChange={handleOptionChange} name={"assumeMasterwork"} title={"Assume masterwork"}></CheckBox>
				<CheckBox onChange={handleOptionChange} name={"smoothing"} title={"Heatbar smoothing"}></CheckBox>
			</Menu>
		</main>
	);
}

function countArmor(armorData) {
	const characterClasses = Object.freeze({
		0: "Titan",
		1: "Hunter",
		2: "Warlock",
		3: "unknown",
	});
	const armorTypes = Object.freeze({
		0: "helmet",
		1: "gloves",
		2: "chest",
		3: "boots",
		4: "classItem",
	});

	const characterArmors = {};

	for (let armor of armorData) {
		const character = characterClasses[armor.class];
		if (characterArmors[character] === undefined) {
			characterArmors[character] = {total: 1};
		} else characterArmors[character].total = characterArmors[character].total + 1;

		const type = armorTypes[armor.armor_type];
		if (characterArmors[character][type] === undefined) {
			characterArmors[character][type] = 1;
		} else characterArmors[character][type] = characterArmors[character][type] + 1;
	}

	return characterArmors;
}

function parseArmor(armorData, selectedClass, selectedArmorTypes, assumeMasterwork, minRange, maxRange, normalizeCount) {
	const filteredArmor = filterArmor(armorData, selectedClass, selectedArmorTypes);
	const stats = getArmorStats(filteredArmor, assumeMasterwork);
	return normalizeArmorStats(stats, minRange, maxRange, normalizeCount);
}

function filterArmor(armorData, selectedClass, allowedArmorTypes) {
	const characterClasses = Object.freeze({
		0: "Titan",
		1: "Hunter",
		2: "Warlock",
		3: "unknown",
	});
	const armorTypes = Object.freeze({
		0: "helmet",
		1: "gloves",
		2: "chest",
		3: "boots",
		4: "classItem",
	});

	const filteredArmor = [];
	for (const armor of armorData) {
		const character = characterClasses[armor.class];
		const type = armorTypes[armor.armor_type];

		if (character != selectedClass) continue;
		else if (allowedArmorTypes[type] === false) continue;

		filteredArmor.push(armor);
	}
	return filteredArmor;
}

function getArmorStats(armors, assumeMasterwork) {
	let stats = [[], [], [], [], [], []];
	for (let armor of armors) {
		for (let [i, stat] of armor.stats.entries()) {
			if (assumeMasterwork && !armor.masterwork) {
				stat += 2;
			}
			stats[i].push(stat);
		}
	}
	return stats;
}

// for each array it will count how many numbers in the stats array are higher than each point in the range
// of values that the stat map will display and then normalizes that count to determine the color
// of each point on the stat map / heatmap
function normalizeArmorStats(armorStats, minRange, maxRange, normalizeCount) {
	let normalizedArmorStats = [];
	for (let stats of armorStats) {
		normalizedArmorStats.push(normalizeStats(stats, minRange, maxRange, normalizeCount));
	}
	return normalizedArmorStats;
}

// counts how many numbers in the stats array are higher than each point in the range the stat map will display
// and then normalizes that count to determine the color of each point on the stat map / heatmap
function normalizeStats(stats, minRange, maxRange, normalizeCount) {
	// sort stats into ascending order
	stats.sort((a, b) => a - b);

	let n = 0;
	let normalizedValues = [];
	for (let i = minRange; i <= maxRange + 1; i++) {
		while (stats[n] < i && n < stats.length) {
			n++;
		}

		let count = stats.length - n;
		let normalizedValue = Math.round((count / normalizeCount) * 100) / 100; //rounds to 2 decimal
		normalizedValues.push(normalizedValue);
	}

	return normalizedValues;
}

StatMap.propTypes = {
	minRange: PropTypes.number,
	maxRange: PropTypes.number,
};

export default StatMap;
