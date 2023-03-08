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
	function handleSelect(buttonText) {
		setSelectedClass(buttonText);
	}

	return (
		<div className={styles.app}>
			<NavBar></NavBar>
			<div className={styles.content}>
				<div className={styles.center}>
					<Menu title="Stat map" titleBG="#282828" bodyBG="#383838">
						<Title title="Class selection">
							<SelectOneButton
								onSelect={handleSelect}
								selectedButtonText={selectedClass}
								buttons={[
									{stretch: true, text: "Hunter", icon: HelmetIcon, count: 10},
									{stretch: true, text: "Warlock", icon: HelmetIcon, count: 147},
									{stretch: true, text: "Titan", icon: HelmetIcon, count: 26},
								]}
							></SelectOneButton>
						</Title>
						<Title title="Armor selection">
							<Button Icon={HelmetIcon} count={10}></Button>
							<Button Icon={GlovesIcon} count={47}></Button>
							<Button Icon={ChestIcon} count={26}></Button>
							<Button Icon={BootsIcon} count={14}></Button>
							<Button Icon={ClassIcon} count={36}></Button>
						</Title>
						<Title title="HeatMap">
							<HeatMap></HeatMap>
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
