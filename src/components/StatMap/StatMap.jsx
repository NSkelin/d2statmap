import React, {useState} from "react";
import PropTypes from "prop-types";
import styles from "./StatMap.module.css";
import Menu from "../Menu";
import Title from "../Title";
import HeatMap from "../HeatMap";
import Button from "../Button";
import CheckBox from "../CheckBox";
import SelectOneButton from "../SelectOneButton";
import {ReactComponent as HelmetIcon} from "../../assets/helmet.svg";
import {ReactComponent as GlovesIcon} from "../../assets/gloves.svg";
import {ReactComponent as ChestIcon} from "../../assets/chest.svg";
import {ReactComponent as BootsIcon} from "../../assets/boots.svg";
import {ReactComponent as ClassIcon} from "../../assets/helmet.svg";

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

function StatMap({armorData}) {
	const [selectedClass, setSelectedClass] = useState(null);
	const [selectedArmorTypes, setSelectedArmorTypes] = useState({helmet: false, gloves: false, chest: false, boots: false, classItem: false});
	const [sliderValues, setSliderValues] = useState({min: 2, max: 40});
	const [options, setOptions] = useState({assumeMasterwork: false, simpleArmor: false, smoothing: false});

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

	function handleSliderChange(values) {
		setSliderValues({min: Number(values[0]), max: Number(values[1])});
	}

	function handleOptionChange(e) {
		let name = e.currentTarget.name;
		let value = options[name] ? false : true;
		setOptions({
			...options,
			[name]: value,
		});
	}

	const filteredArmor = filterArmor(armorData, selectedClass, selectedArmorTypes);

	return (
		<div className={styles.center}>
			<Menu title="Stat map" titleBG="#282828" bodyBG="#383838">
				<Title title="Class selection">
					<SelectOneButton
						onSelect={handleClassSelect}
						selectedButtonText={selectedClass}
						buttons={[
							{stretch: true, text: "Hunter", icon: HelmetIcon, count: 10},
							{stretch: true, text: "Warlock", icon: HelmetIcon, count: 147},
							{stretch: true, text: "Titan", icon: HelmetIcon, count: 26},
						]}
					></SelectOneButton>
				</Title>
				<Title title="Armor selection">
					<Button
						name={"helmet"}
						onClick={handleArmorTypesSelection}
						selected={selectedArmorTypes.helmet}
						text="Helmet"
						showText={false}
						Icon={HelmetIcon}
						count={10}
					></Button>
					<Button
						name={"gloves"}
						onClick={handleArmorTypesSelection}
						selected={selectedArmorTypes.gloves}
						text="Gloves"
						showText={false}
						Icon={GlovesIcon}
						count={47}
					></Button>
					<Button
						name={"chest"}
						onClick={handleArmorTypesSelection}
						selected={selectedArmorTypes.chest}
						text="Chest"
						showText={false}
						Icon={ChestIcon}
						count={26}
					></Button>
					<Button
						name={"boots"}
						onClick={handleArmorTypesSelection}
						selected={selectedArmorTypes.boots}
						text="Boots"
						showText={false}
						Icon={BootsIcon}
						count={14}
					></Button>
					<Button
						name={"classItem"}
						onClick={handleArmorTypesSelection}
						selected={selectedArmorTypes.classItem}
						text="ClassItem"
						showText={false}
						Icon={ClassIcon}
						count={36}
					></Button>
				</Title>
				<Title title="HeatMap">
					<HeatMap
						armor={filteredArmor}
						smoothing={options.smoothing}
						sliderValues={sliderValues}
						slider={{minRange: 0, maxRange: 40, minVal: sliderValues.min, maxVal: sliderValues.max, onChange: handleSliderChange}}
					></HeatMap>
				</Title>
			</Menu>
			<Menu title="Options" titleBG="#232323" bodyBG="#323232">
				<CheckBox onChange={handleOptionChange} name={"assumeMasterwork"} title={"Assume masterwork"}></CheckBox>
				<CheckBox onChange={handleOptionChange} name={"simpleArmor"} title={"Simple armor selection"}></CheckBox>
				<CheckBox onChange={handleOptionChange} name={"smoothing"} title={"Heatbar smoothing"}></CheckBox>
			</Menu>
		</div>
	);
}

StatMap.propTypes = {
	armorData: PropTypes.objectOf({
		class: PropTypes.number,
		masterwork: PropTypes.bool,
		stats: PropTypes.arrayOf(PropTypes.number),
		armor_type: PropTypes.number,
	}),
};

export default StatMap;
