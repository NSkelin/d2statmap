import React from "react";
import NavBar from "./components/navBar.jsx";
import Menu from "./components/menu.jsx";
import Title from "./components/title.jsx";
import HeatMap from "./components/heatMap.jsx";
import "./style.css";
import styles from "./app.module.css";

function App() {
	return (
		<div className={styles.app}>
			<NavBar></NavBar>
			<div className={styles.content}>
				<div className={styles.center}>
					<Menu title="Stat map" titleBG="#282828" bodyBG="#383838">
						<Title>
							<HeatMap></HeatMap>
						</Title>
					</Menu>
					<Menu title="Options" titleBG="#232323" bodyBG="#323232"></Menu>
				</div>
			</div>
		</div>
	);
}

export default App;
