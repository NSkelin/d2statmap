import React from "react";
import {NavBar, StatMap} from "./components";
import "./style.css";
import styles from "./app.module.css";
import dummyData from "../dummyData.json";

function App() {
	return (
		<div className={styles.app}>
			<NavBar></NavBar>
			<div className={styles.content}>
				<StatMap armorData={dummyData} minRange={2} maxRange={32}></StatMap>
			</div>
		</div>
	);
}

export default App;
