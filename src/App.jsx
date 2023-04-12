import React, {useState} from "react";
import {NavBar, StatMap} from "./components";
import "./style.css";
import styles from "./app.module.css";
import dummyData from "../dummyData.json";

function App() {
	const [refreshing, setRefreshing] = useState(false);

	function handleRefresh() {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}

	function handleLogout() {}

	return (
		<div className={styles.app}>
			<NavBar rotate={refreshing} onLogout={handleLogout} onRefresh={handleRefresh}></NavBar>
			<div className={styles.content}>
				<StatMap armorData={dummyData} minRange={2} maxRange={32}></StatMap>
			</div>
		</div>
	);
}

export default App;
