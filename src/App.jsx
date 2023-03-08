import React, {useState} from "react";
import {NavBar, Menu, Title, HeatMap, Button, CheckBox, SelectOneButton} from "./components";
import "./style.css";
import styles from "./app.module.css";
import {ReactComponent as HelmetIcon} from "./assets/helmet.svg";
import {ReactComponent as GlovesIcon} from "./assets/gloves.svg";
import {ReactComponent as ChestIcon} from "./assets/chest.svg";
import {ReactComponent as BootsIcon} from "./assets/boots.svg";
import {ReactComponent as ClassIcon} from "./assets/helmet.svg";

function App() {
	const [selectedClass, setSelectedClass] = useState(null);
	const [helmetSelected, setHelmetSelected] = useState(null);
	const [glovesSelected, setGlovesSelected] = useState(null);
	const [chestSelected, setChestSelected] = useState(null);
	const [bootsSelected, setBootsSelected] = useState(null);
	const [classItemSelected, setClassItemSelected] = useState(null);
	const [sliderValues, setSliderValues] = useState({min: 2, max: 40});

	function handleClassSelect(buttonText) {
		setSelectedClass(buttonText);
	}

	function handleHelmetSelect() {
		setHelmetSelected(helmetSelected ? false : true);
	}
	function handleGlovesSelect() {
		setGlovesSelected(glovesSelected ? false : true);
	}
	function handleChestSelect() {
		setChestSelected(chestSelected ? false : true);
	}
	function handleBootsSelect() {
		setBootsSelected(bootsSelected ? false : true);
	}
	function handleClassItemSelect() {
		setClassItemSelected(classItemSelected ? false : true);
	}

	function handleSliderChange(values) {
		setSliderValues({min: Number(values[0]), max: Number(values[1])});
	}

	return (
		<div className={styles.app}>
			<NavBar></NavBar>
			<div className={styles.content}>
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
								onClick={handleHelmetSelect}
								selected={helmetSelected}
								text="Helmet"
								showText={false}
								Icon={HelmetIcon}
								count={10}
							></Button>
							<Button
								onClick={handleGlovesSelect}
								selected={glovesSelected}
								text="Gloves"
								showText={false}
								Icon={GlovesIcon}
								count={47}
							></Button>
							<Button
								onClick={handleChestSelect}
								selected={chestSelected}
								text="Chest"
								showText={false}
								Icon={ChestIcon}
								count={26}
							></Button>
							<Button
								onClick={handleBootsSelect}
								selected={bootsSelected}
								text="Boots"
								showText={false}
								Icon={BootsIcon}
								count={14}
							></Button>
							<Button
								onClick={handleClassItemSelect}
								selected={classItemSelected}
								text="ClassItem"
								showText={false}
								Icon={ClassIcon}
								count={36}
							></Button>
						</Title>
						<Title title="HeatMap">
							<HeatMap
								slider={{minRange: 0, maxRange: 40, minVal: sliderValues.min, maxVal: sliderValues.max, onChange: handleSliderChange}}
							></HeatMap>
						</Title>
					</Menu>
					<Menu title="Options" titleBG="#232323" bodyBG="#323232">
						<CheckBox title={"Assume masterwork"}></CheckBox>
						<CheckBox title={"Simple armor selection"}></CheckBox>
						<CheckBox title={"Heatbar smoothing"}></CheckBox>
					</Menu>
				</div>
			</div>
		</div>
	);
}

export default App;
